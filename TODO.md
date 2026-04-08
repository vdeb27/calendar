# TODO

## ~~1. Mooiere toggle Traditional/Olympian~~ DONE
Slider/pill toggle in plaats van de huidige knoppen om te kiezen tussen Traditional en Olympian weergave.

## ~~2. Taalkeuze Nederlands/Engels~~ DONE
NL/EN toggle via React context. Alle UI-teksten, dag/maandnamen, periodenamen (Athene, Hephaistos) en intercalary-namen (Lentevreugde etc.) vertaald.

## ~~3. Mobiele weergave~~ DONE
PWA met installeerbare app (vite-plugin-pwa), compacte single-column layout (≤600px), inline seizoen/periode/maand-headers, weeknummers, horizontale swipe-navigatie met peek-panels en jaar-indicator. Default taal Nederlands.

## ~~4. Intercalary weken optimaliseren~~ DONE
DP-optimalisatie uitputtend gemaximaliseerd: timezone-fix (UTC-consistent), drift als tiebreaker, onafhankelijke verificatie. Resultaat: 1284/1600 events (80.25%) in Vreugde-weken, bewezen optimaal.

## 5. Uitlegpagina
Pagina toevoegen die de gedachte achter de kalender uitlegt. Vorm (route, modal, overlay) nog te bepalen bij aanvang.

## ~~6. Standaardjaar dynamisch maken~~ DONE
App opent nu op het huidige jaar in plaats van hardcoded 2026.

## ~~7. Tests toevoegen~~ DONE
73 tests in 5 bestanden via Vitest: astronomische berekeningen, date utilities, 400-jarig DP-patroon, kalenderopbouw, en traditionele kalender.

## ~~8. Astronomische databronnen consolideren~~ DONE
Hardcoded tabel en ongebruikte analyse-functies verwijderd. Alleen de algoritmische bron (Jean Meeus) en de DP-functie blijven over.

## ~~9. ViewMode naamgeving~~ DONE
`'custom'` hernoemd naar `'olympian'` in type definitie en alle referenties.

## 10. Print-stylesheet
CSS toevoegen zodat de kalender goed printbaar is, passend bij de inspiratie van de fysieke wandkalender.

## ~~11. Referentie-screenshots opruimen~~ DONE
Screenshots verplaatst naar `docs/design-references/`.

## ~~12. Maanfasen integreren~~ DONE
Maanfasen (nieuwe maan, eerste kwartier, volle maan, laatste kwartier) weergeven in de kalender als kleine iconen in de dagcellen. Berekend via Jean Meeus algoritme, getest op bekende data.

## ~~13. Schoolvakanties weergeven~~ DONE
Schoolvakanties (Noord/Midden/Zuid, default Midden) visueel gemarkeerd met diagonaal streepjespatroon. Data 2020-2030 van rijksoverheid open data. Regio-toggle (N/M/Z) in header. Eerste weekend overgeslagen voor schonere weergave.

## 14. Optie-venster voor een uitleg en de opties
Een tandwiel rechtsboven met daarachter alle configuratie opties. Visueel gemaakt: iets als 📅/🏔️ toggle voor de keuze tussen traditionele en Olympische kalenders, ☀️ on/off voor de astronomische gebeurtenissen, 🌙 on/off voor de maanfases, 🏫 on/off voor schoolvakanties, 🇳🇱/🇬🇧 voor de taal, en een three-way toggle voor de keuze Noord/Midden/Zuid ⬆️/↔️/⬇️.