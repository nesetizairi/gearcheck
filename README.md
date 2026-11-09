# GearCheck – gearcheck.ch

Statische Website (HTML, CSS, ein kleines JavaScript ohne fremde Bibliotheken). Hosting: GitHub Pages, Domain bei Infomaniak.
Zielmarkt: Deutschland, Österreich und Schweiz. Geschrieben in Schweizer Rechtschreibung (ss statt ß).
Der Ordnername `happypicks` ist noch vom alten Projektnamen, der Inhalt ist komplett GearCheck.

## Struktur

| Pfad | Inhalt |
|---|---|
| `index.html` | Startseite (Sportwelt, Sportarten, beliebte und neueste Ratgeber, Finder, die vier Fragen) |
| `home-gym/`, `kampfsport/`, … | Sportseiten mit allen Produktkarten |
| `ratgeber/index.html` | Übersicht aller Ratgeber mit Filter |
| `ratgeber/<slug>/index.html` | ein Ratgeber |
| `vergleiche/` | Übersicht aller Vergleiche (wird erzeugt) |
| `vergleiche/<slug>/index.html` | ein Vergleich mit Tabelle und Empfehlung |
| `ueber-uns/` | Über Neset, Methode (selbst getestet / recherchiert), Affiliate-Modell |
| `_vorlagen/artikel.html` | Vorlage für neue Ratgeber (wird nicht veröffentlicht) |
| `assets/css/style.css` | Design-System: Farben, Abstände, Radien, Schatten, alle Bausteine |
| `assets/js/gc.js` | Menü, Suche, Länderwahl, Rechner, Finder, Saisontipp, Teilen |
| `assets/data/suche.json` | Suchindex (erzeugt) |
| `assets/img/` | Logo, Icons (`icons.svg`), Sport-Szenen (`sport/`), Ratgeber-Szenen (`ratgeber/`), Sport-Symbole (`gear/`), Vorschaubilder (`og/`), Pin-Bilder (`pins/`) |
| `tools/build.pl` | Build: hält alle Seiten aktuell und prüft die Links |
| `tools/produkte.txt` | Produktkarten: Geeignet für, Achte auf, Vor- und Nachteil, Einschätzung (`^`), Selbst getestet (`+`), Aus meinem Training (`!`) |
| `tools/og/` | Vorschaubilder rendern (`render.ps1`) |
| `tools/gen/` | Sport-Symbole aus den Pin-Bauteilen erzeugen |
| `tools/serve.ps1` | lokale Vorschau auf http://localhost:8080 |

## Build (nach jeder Änderung)

```
perl tools/build.pl
```

Das Skript liest die Seiten selbst als Quelle und ergänzt bzw. aktualisiert:

- Kopf- und Fusszeile, Menü, Suche, Länderwahl auf allen Seiten
- `<head>`: Icons, CSS/JS mit Versionsnummer, Open Graph, Vorschaubild, strukturierte Daten (Article, Breadcrumb, WebSite)
- Produktkarten der Sportseiten (Symbol, Kennzeichnung „Recherchiert“, Zusatzinfos aus `tools/produkte.txt`, Sprungmarke pro Produkt)
- Kopfbereich, Unternavigation und Ratgeber-Liste jeder Sportseite
- Ratgeber: Inhaltsverzeichnis, Kennzeichnung, Teilen-Leiste, weiterführende Artikel, Handy-Tabellen
- Startseite: Zahlen, Sportwelt, Sportarten, beliebte und neueste Ratgeber (ohne Doppelte), Finder-Daten
- Ratgeber-Übersicht, Suchindex, Sitemap
- Am Schluss werden alle internen Links und Sprungmarken geprüft.

Zweimal laufen lassen ändert nichts mehr, das Skript ist wiederholbar.
In den Seiten stehen Markierungen wie `<!-- gc:newest -->`. Was dazwischen steht, wird bei jedem Lauf neu erzeugt.

Vorschaubilder (1200 × 630) nach neuen Seiten oder Titeln neu rendern, danach nochmals bauen:

```
powershell -ExecutionPolicy Bypass -File tools/og/render.ps1
perl tools/build.pl
```

## Design

- Basis Schwarz/Weiss, Markenfarbe Orange `#ff5a1f`. Alle Werte stehen als Variablen oben in `style.css`.
- Jede Sportart hat eine eigene Farbwelt über eine Klasse (`--cat` Fläche, `--cat-ink` Text auf Weiss):

| Sportart | Ordner | Klasse | Farbe |
|---|---|---|---|
| Home-Gym & Fitness | `home-gym/` | `cat-fitness` | Orange |
| Kampfsport | `kampfsport/` | `cat-kampfsport` | Rot, dunkle Sportwelt |
| Fussball | `fussball/` | `cat-fussball` | Grün |
| Running | `running/` | `cat-running` | Gelb-Grün |
| Radsport | `radsport/` | `cat-radsport` | Lila, dunkle Sportwelt |
| Schwimmen | `schwimmen/` | `cat-schwimmen` | Blau |
| Wintersport | `wintersport/` | `cat-wintersport` | Hellblau |
| Tennis & Padel | `tennis-padel/` | `cat-racket` | Türkis |

- Neue Sportart: im Build-Skript in `@SPORTS` eintragen (Name, Farbe, Texte), Farbe in `style.css`, Szene in `assets/img/sport/`, Symbol in `tools/gen/gear.html`.
- Produktkarten-Symbole kommen aus `assets/img/icons.svg`. Beim Darüberfahren bewegen sie sich passend (Handschuh boxt, Hantel hebt sich, Ball dreht sich …), Zuordnung in `%ANIM` im Build-Skript. Keine Dauer-Animationen, `prefers-reduced-motion` wird beachtet.
- Jeder Ratgeber hat eine eigene Szene (`assets/img/ratgeber/<slug>.svg`, 800 × 350), bewusst anders als die Sportseite. Für neue Ratgeber immer eine neue Szene zeichnen.
- Achtung in SVG-Dateien: keine doppelten Bindestriche in Kommentaren.

## Neuen Vergleich veröffentlichen

1. Eine bestehende Seite in `vergleiche/` kopieren (Aufbau: Kurz gesagt, Tabelle, Was passt zu dir?, Darauf kommt es an, Weiter-Knöpfe).
2. Illustration in `tools/gen/vergleiche.html` ergänzen, `powershell -ExecutionPolicy Bypass -File tools/gen/vergleiche.ps1` ausführen.
3. `perl tools/build.pl`: erscheint automatisch in der Übersicht, auf der Sportseite, in der Suche und bei passenden Ratgebern (Zuordnung in `%PASSEND`).
4. Vorschaubild rendern.

## Produktkarten und Finder

- **Einschätzung** (`^` in `produkte.txt`): Grundausstattung, Ergänzung oder bei Bedarf, dazu „weniger geeignet für“ und sparsam ein Tipp-Label. Daraus entsteht pro Kategorie die GearCheck-Einschätzung (zuerst, später, bei Bedarf).
- **Aus meinem Training** (`!`): nur echte Aussagen von Neset, wörtlich nah, nichts dazudichten.
- **Finder** (`%FINDER` im Build): je Sportart eine Ortsfrage, Grundausstattung, Ergänzungen und Fehlkäufe. Preise kommen aus den Karten, die Auswahl rechnet mit Level, Ort und Budget.
- **Foto:** Sobald `assets/img/neset.jpg` (quadratisch, mind. 400 × 400) existiert, ersetzt das Build die Initiale auf „Über uns“ und in allen Autorenboxen.

## Neuen Ratgeber veröffentlichen

1. `_vorlagen/artikel.html` nach `ratgeber/<slug>/index.html` kopieren, alle `[Platzhalter]` ersetzen (inkl. `cat-…` und `data-teaser`).
2. Szene `assets/img/ratgeber/<slug>.svg` zeichnen.
3. `perl tools/build.pl`: Der Ratgeber erscheint automatisch auf Startseite (Neueste), Übersicht, Sportseite, in der Suche und in der Sitemap.
4. Passende Produktkarten auf der Sportseite mit `<a class="gear-guide" href="/ratgeber/<slug>/">…</a>` verlinken, nochmals bauen.
5. Vorschaubild rendern (siehe oben).

## DACH: Länder, Links, Preise

- Alle drei Länder bestellen über **Amazon.de** mit der Partner-ID **gearcheck02-21**. Amazon.de liefert nach Deutschland und Österreich, in die Schweiz viele, aber nicht alle Artikel.
- Länderwahl in der Fusszeile (DE/AT/CH). Ohne Auswahl schätzt die Seite das Land über Browsersprache und Zeitzone, nur lokal. Gespeichert wird erst, wenn jemand selbst wählt.
- Je Land passt sich der Lieferhinweis auf den Sportseiten an. Links werden nicht verändert, solange alle Länder dieselbe Konfiguration haben (`MARKETS` in `gc.js`).
- Ein anderer Link für ein einzelnes Produkt und Land: am Amazon-Link `data-offer-ch="https://…"` (oder `-de`, `-at`) ergänzen. Das Build-Skript übernimmt das Attribut.
- Preise stehen als grobe Spanne in Euro, weil Amazon.de in Euro abrechnet. Keine umgerechneten Franken-Preise erfinden.

## Regeln für Inhalte (gilt auch für Claude-Routinen)

- **Ehrlich:** „Selbst getestet“ nur für Produkttypen, die Neset selbst benutzt hat (Liste in `tools/produkte.txt`, Zeilen mit `+`, Stand 8. November 2026). Empfehlungen in Ratgebern bekommen die Kennzeichnung mit `data-tested` am `<article class="card pick">` bzw. an der `quickpick-row`. Alles andere ist „Recherchiert“. Keine erfundenen Tests, Testsieger, Bewertungen oder Rabatte.
- **Keine Amazon-Produktbilder kopieren.** Bilder nur eigene Grafiken oder eigene Fotos.
- **Preise nur als grobe Spanne** mit Stand-Datum, nie als exakter aktueller Preis.
- **Jeder Amazon-Link:** `target="_blank" rel="sponsored nofollow noopener" data-amazon`, Linktext mit Stern (*), Hinweis-Box oben. Tracking-Parameter nie verändern.
- **Keine Link-Kürzer**, immer direkte amazon.de-Links mit `&amp;tag=gearcheck02-21`.
- **Zuerst erklären, dann empfehlen.** Jeder Artikel beantwortet eine echte Kauffrage.
- **Schnellauswahl oben** (`#schnellauswahl`) mit 2–4 Empfehlungen. Pins und Videos können direkt darauf verlinken.
- **DACH-Begriffe:** wo Länder unterschiedlich sprechen, beide nennen (Fahrradhelm/Velohelm, Rennrad/Rennvelo), ohne Texte zu überladen.

## Pinterest-Pins

`_marketing/pins/`: Inhalte in `pins.js`, markierte Themen in `window.TOPICS`. Jeder Pin hat eine eigene Szene in `art-szenen.js` (Bauteile in `art-teile.js`). Neue Pins: eigene Szene plus Themen. Vorschau: `art-vorschau.html`, Bilder: `render.ps1`.

## Partner-Programm

Partner-ID **gearcheck02-21** (seit 05.11.2026). Amazon prüft das Konto nach den ersten 3 Verkäufen innerhalb von 180 Tagen (bis ca. 04.05.2027).

## Offene rechtliche Prüfpunkte

Impressum und Datenschutz beschreiben den technischen Stand korrekt, wurden aber nicht juristisch geprüft. Da sich die Seite an Deutschland und Österreich richtet, lohnt eine Prüfung durch eine Fachperson, insbesondere: DSGVO-Anforderungen für Besucher aus der EU, Impressumspflicht nach deutschem Recht, Kennzeichnung von Werbung in DE und AT.
