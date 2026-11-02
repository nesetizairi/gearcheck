# GearCheck – gearcheck.ch

Statische Website (reines HTML/CSS, kein Build-Schritt, kein JavaScript). Hosting: GitHub Pages, Domain bei Infomaniak.
Der Ordnername `happypicks` ist noch vom alten Projektnamen, der Inhalt ist komplett GearCheck.

## Struktur

| Pfad | Inhalt |
|---|---|
| `index.html` | Startseite |
| `home-gym/`, `kampfsport/`, `fussball/` | Rubrik-Seiten mit allen Ratgebern der Rubrik |
| `ratgeber/index.html` | Übersicht aller Ratgeber |
| `ratgeber/<slug>/index.html` | ein Ratgeber-Artikel |
| `_vorlagen/artikel.html` | Vorlage für neue Artikel (wird nicht veröffentlicht) |
| `assets/` | CSS, Logo, Favicon |
| `tools/serve.ps1` | lokale Vorschau: `powershell -ExecutionPolicy Bypass -File tools/serve.ps1`, dann http://localhost:8080 |

## Design

- Basis Schwarz/Weiss, Akzent Orange `#ff5a1f`. Alle Farben stehen oben in `assets/css/style.css`.
- Jede Rubrik hat eine eigene Farbe, gesetzt über eine Klasse am `<main>` oder an der Karte:

| Rubrik | Klasse | Farbe | Phase |
|---|---|---|---|
| Home-Gym & Fitness | `cat-fitness` | Orange | Start |
| Kampfsport | `cat-kampfsport` | Rot | Start |
| Fussball | `cat-fussball` | Grün | Start |
| Running | `cat-running` | Gelb-Grün | 2 |
| Radsport | `cat-radsport` | Lila | 2 |
| Schwimmen | `cat-schwimmen` | Blau | 3 |
| Wintersport | `cat-wintersport` | Hellblau | 3 |
| Tennis & Padel | `cat-racket` | Türkis | 3 |

Nur Sport-Themen, keine anderen Nischen.

## Neuen Artikel veröffentlichen

1. `_vorlagen/artikel.html` nach `ratgeber/<slug>/index.html` kopieren, alle `[Platzhalter]` ersetzen (inkl. Rubrik-Klasse `cat-…`).
2. Karte auf der Rubrik-Seite (`home-gym/`, `kampfsport/` oder `fussball/`) und auf `ratgeber/index.html` ergänzen.
3. Bei den neuesten Artikeln auch auf `index.html` unter „Neueste Ratgeber“.
4. URL in `sitemap.xml` eintragen.
5. Bei der ersten Fussball-Story: den Block „Die ersten Ratgeber sind in Arbeit“ auf `fussball/` durch die Karte ersetzen, auf der Startseite „Erste Ratgeber in Arbeit“ zu „Ratgeber ansehen“ ändern.

## Regeln für Inhalte (gilt auch für Claude-Routinen)

- **Ehrlich:** „getestet“ oder „selbst benutzt“ nur, wenn Neset das Produkt wirklich benutzt hat. Keine erfundenen Tests, Testsieger oder Erfahrungsberichte.
- **Keine Amazon-Produktbilder kopieren.** Bilder nur eigene Fotos oder eigene Grafiken.
- **Preise nur als grobe Spanne** mit Stand-Datum, nie als exakter aktueller Preis.
- **Jeder Amazon-Link:** `target="_blank" rel="sponsored nofollow noopener" data-amazon`, Linktext mit Stern (*), Hinweis-Box oben im Artikel.
- **Keine Link-Kürzer** (bit.ly usw.), immer direkte amazon.de-Links.
- **Zuerst erklären, dann empfehlen.** Jeder Artikel beantwortet eine echte Kauffrage.
- **Schnellauswahl oben:** Direkt nach „Kurz und knapp“ steht eine Schnellauswahl (`#schnellauswahl`) mit 2–4 Empfehlungen und Amazon-Button, für alle, die nicht lange lesen wollen. Pins und TikToks können direkt auf `…/#schnellauswahl` verlinken.

## Partner-Tag nach der Aufnahme

Alle Links mit `data-amazon` bekommen den Partner-Tag als Parameter `tag=<deine-id>-21`.

## Vor dem Livegang (TODO)

- [x] Name und Adresse in `impressum/` und `datenschutz/` eintragen
- [x] Sportarten auf `ueber-uns/` ergänzen
- [x] Rebranding Happy Picks → GearCheck
- [ ] GitHub-Repository anlegen (Account `nesetizairi`) und GitHub Pages aktivieren, Custom Domain `gearcheck.ch` (CNAME-Datei liegt bereit)
- [ ] DNS bei Infomaniak auf GitHub Pages zeigen lassen (MX-Einträge für E-Mail **nicht** ändern)
- [ ] Mindestens 10 Artikel online, dann beim Amazon-Partnerprogramm anmelden
