# TODO

## ~~1. Mooiere toggle Traditional/Olympian~~ DONE
Slider/pill toggle in plaats van de huidige knoppen om te kiezen tussen Traditional en Olympian weergave.

## 2. Taalkeuze Nederlands/Engels
Toggle om te wisselen tussen NL en EN. Vertaling van alle teksten: UI-labels, maand- en dagnamen, periodenamen (Zeus/Hera/... vs NL-equivalenten), seizoensnamen, en intercalary-namen (Springjoy vs Lentevreugde). Taal hoeft niet in URL bewaard te worden.

## 3. Mobiele weergave
Kalender geschikt maken voor telefoonschermen. Alles compacter: sidebars, dagcellen, spacing. Testen via browser device emulation. Idealiter past een seizoen op een scherm, anders een maand/periode.

## 4. Intercalary weken optimaliseren
Uitputtend optimaliseren van de verdeling van intercalary/leap weken over het 400-jarig patroon. Doel: bewezen maximaal aantal astronomische gebeurtenissen (zonnewende, equinox) binnen de Vreugde-weken. Huidige DP-aanpak heeft suboptimale tiebreaking en weegt drift niet mee als secundair criterium.

## 5. Uitlegpagina
Pagina toevoegen die de gedachte achter de kalender uitlegt. Vorm (route, modal, overlay) nog te bepalen bij aanvang.

## ~~6. Standaardjaar dynamisch maken~~ DONE
App opent nu op het huidige jaar in plaats van hardcoded 2026.

## 7. Tests toevoegen
Unit tests voor de astronomische berekeningen (Jean Meeus), de DP-optimalisatie, en de kalenderopbouw. Vooral belangrijk als basis voor TODO #4.

## ~~8. Astronomische databronnen consolideren~~ DONE
Hardcoded tabel en ongebruikte analyse-functies verwijderd. Alleen de algoritmische bron (Jean Meeus) en de DP-functie blijven over.

## ~~9. ViewMode naamgeving~~ DONE
`'custom'` hernoemd naar `'olympian'` in type definitie en alle referenties.

## 10. Print-stylesheet
CSS toevoegen zodat de kalender goed printbaar is, passend bij de inspiratie van de fysieke wandkalender.

## ~~11. Referentie-screenshots opruimen~~ DONE
Screenshots verplaatst naar `docs/design-references/`.
