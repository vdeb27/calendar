import { useRef, useEffect, useState, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

interface SwipeState {
  offsetX: number;
  isSwiping: boolean;
  yearIndicator: 'left' | 'right' | null;
  indicatorKey: number;
}

export function useSwipe(
  ref: React.RefObject<HTMLElement | null>,
  contentRef: React.RefObject<HTMLElement | null>,
  handlers: SwipeHandlers,
) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    offsetX: 0,
    isSwiping: false,
    yearIndicator: null,
    indicatorKey: 0,
  });

  const startX = useRef(0);
  const startY = useRef(0);
  const tracking = useRef(false);
  const locked = useRef<'horizontal' | 'vertical' | null>(null);
  const indicatorTimeout = useRef<ReturnType<typeof setTimeout>>();

  const showIndicator = useCallback((direction: 'left' | 'right') => {
    if (indicatorTimeout.current) clearTimeout(indicatorTimeout.current);
    setSwipeState(s => ({ ...s, yearIndicator: direction, indicatorKey: s.indicatorKey + 1 }));
    indicatorTimeout.current = setTimeout(() => {
      setSwipeState(s => ({ ...s, yearIndicator: null }));
    }, 800);
  }, []);

  useEffect(() => {
    const el = ref.current;
    const content = contentRef.current;
    if (!el || !content) return;

    const THRESHOLD = 60;
    const LOCK_DISTANCE = 10;
    const MAX_OFFSET = 120;

    const onTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      tracking.current = true;
      locked.current = null;
      content.style.transition = 'none';
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking.current) return;

      const dx = e.touches[0].clientX - startX.current;
      const dy = e.touches[0].clientY - startY.current;

      // Determine direction lock
      if (locked.current === null && (Math.abs(dx) > LOCK_DISTANCE || Math.abs(dy) > LOCK_DISTANCE)) {
        locked.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      }

      if (locked.current !== 'horizontal') return;

      // Clamp offset with rubber-band effect
      const clamped = Math.sign(dx) * Math.min(Math.abs(dx), MAX_OFFSET);
      content.style.transform = `translateX(${clamped}px)`;
      setSwipeState(s => ({ ...s, offsetX: clamped, isSwiping: true }));
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking.current) return;
      tracking.current = false;

      const dx = e.changedTouches[0].clientX - startX.current;

      content.style.transition = 'transform 0.25s ease-out';

      if (locked.current === 'horizontal' && Math.abs(dx) >= THRESHOLD) {
        // Animate off-screen, then trigger callback
        const direction = dx > 0 ? 'right' : 'left';
        const offscreen = direction === 'right' ? window.innerWidth : -window.innerWidth;
        content.style.transform = `translateX(${offscreen}px)`;

        setTimeout(() => {
          content.style.transition = 'none';
          content.style.transform = 'translateX(0)';
          if (direction === 'left') handlers.onSwipeLeft?.();
          else handlers.onSwipeRight?.();
          showIndicator(direction);
        }, 200);
      } else {
        // Snap back
        content.style.transform = 'translateX(0)';
      }

      setSwipeState(s => ({ ...s, offsetX: 0, isSwiping: false }));
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      if (indicatorTimeout.current) clearTimeout(indicatorTimeout.current);
    };
  }, [ref, contentRef, handlers, showIndicator]);

  return swipeState;
}
