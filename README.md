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

| Sportart | Ordner | Klasse | Farbe |
|---|---|---|---|
| Home-Gym & Fitness | `home-gym/` | `cat-fitness` | Orange |
| Kampfsport | `kampfsport/` | `cat-kampfsport` | Rot |
| Fussball | `fussball/` | `cat-fussball` | Grün |
| Running | `running/` | `cat-running` | Gelb-Grün |
| Radsport | `radsport/` | `cat-radsport` | Lila |
| Schwimmen | `schwimmen/` | `cat-schwimmen` | Blau |
| Wintersport | `wintersport/` | `cat-wintersport` | Hellblau |
| Tennis & Padel | `tennis-padel/` | `cat-racket` | Türkis |

Jede Sportart-Seite ist eine komplette Ausrüstungsübersicht (Karten `.gear-item` in Gruppen mit Sprungmarken), darunter die ausführlichen Ratgeber. Die Sportarten-Leiste (`.sportbar`) steht in der Kopfzeile jeder Seite.

Produktkarten haben oben ein gezeichnetes Symbol aus `assets/img/icons.svg`, eingebunden mit `<span class="gear-icon"><svg viewBox="0 0 48 48"><use href="/assets/img/icons.svg#glove"/></svg></span>`. Neue Symbole dort als `<symbol>` ergänzen; Flächen mit `style="fill:var(--ia)"` übernehmen die Farbe der Sportart. Achtung: In Kommentaren der SVG-Datei keine doppelten Bindestriche, sonst lädt die ganze Datei nicht. Jeder Ratgeber hat oben eine eigene, zu seinem Thema gezeichnete Szene (`assets/img/ratgeber/<slug>.svg`, 800 × 350, als `.article-art`). Sie soll sich bewusst von der Szene der Sportart-Seite (`assets/img/sport/`) unterscheiden; für neue Ratgeber also immer eine neue Szene zeichnen.

Nur Sport-Themen, keine anderen Nischen.

## Neuen Artikel veröffentlichen

1. `_vorlagen/artikel.html` nach `ratgeber/<slug>/index.html` kopieren, alle `[Platzhalter]` ersetzen (inkl. Rubrik-Klasse `cat-…`).
2. Karte auf der Sportart-Seite (unter „Ausführliche Ratgeber“) und auf `ratgeber/index.html` ergänzen, passende Produktkarten mit `gear-guide`-Link auf den Artikel verweisen lassen.
3. Bei den neuesten Artikeln auch auf `index.html` unter „Neueste Ratgeber“.
4. URL in `sitemap.xml` eintragen.
5. Bei der ersten Ratgeber-Story einer neuen Sportart: den Block „Ratgeber in Arbeit“ auf deren Seite durch die Artikel-Karte ersetzen.

## Regeln für Inhalte (gilt auch für Claude-Routinen)

- **Ehrlich:** „getestet“ oder „selbst benutzt“ nur, wenn Neset das Produkt wirklich benutzt hat. Keine erfundenen Tests, Testsieger oder Erfahrungsberichte.
- **Keine Amazon-Produktbilder kopieren.** Bilder nur eigene Fotos oder eigene Grafiken.
- **Preise nur als grobe Spanne** mit Stand-Datum, nie als exakter aktueller Preis.
- **Jeder Amazon-Link:** `target="_blank" rel="sponsored nofollow noopener" data-amazon`, Linktext mit Stern (*), Hinweis-Box oben im Artikel.
- **Keine Link-Kürzer** (bit.ly usw.), immer direkte amazon.de-Links.
- **Zuerst erklären, dann empfehlen.** Jeder Artikel beantwortet eine echte Kauffrage.
- **Schnellauswahl oben:** Direkt nach „Kurz und knapp“ steht eine Schnellauswahl (`#schnellauswahl`) mit 2–4 Empfehlungen und Amazon-Button, für alle, die nicht lange lesen wollen. Pins und TikToks können direkt auf `…/#schnellauswahl` verlinken.

## Partner-Tag nach der Aufnahme

Partner-ID: **gearcheck02-21** (seit 05.11.2026). Jeder Amazon-Link endet auf `&amp;tag=gearcheck02-21`, auch in neuen Artikeln (die Vorlage enthält ihn schon). Amazon prüft das Konto nach den ersten 3 Verkäufen (innerhalb von 180 Tagen).

## Vor dem Livegang (TODO)

- [x] Name und Adresse in `impressum/` und `datenschutz/` eintragen
- [x] Sportarten auf `ueber-uns/` ergänzen
- [x] Rebranding Happy Picks → GearCheck
- [ ] GitHub-Repository anlegen (Account `nesetizairi`) und GitHub Pages aktivieren, Custom Domain `gearcheck.ch` (CNAME-Datei liegt bereit)
- [ ] DNS bei Infomaniak auf GitHub Pages zeigen lassen (MX-Einträge für E-Mail **nicht** ändern)
- [ ] Mindestens 10 Artikel online, dann beim Amazon-Partnerprogramm anmelden
