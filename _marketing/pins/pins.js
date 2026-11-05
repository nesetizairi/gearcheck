// Inhalte aller Pinterest-Pins. Wird von vorlage.html (Bild) und index.html (Upload-Übersicht) gelesen.
// Fakten und Preise müssen mit den Ratgebern auf gearcheck.ch übereinstimmen.
window.PINS = [
  {
    id: 'boxhandschuhe', sport: 'kampfsport', board: 'Kampfsport Ausrüstung: Boxen, MMA, Thaiboxen',
    tag: 'Kampfsport · Kaufberatung',
    headline: 'Welche Grösse <em>Boxhandschuhe</em> brauchst du?',
    table: { head: ['Gewicht', 'Sack & Pratzen', 'Sparring'], rows: [
      ['bis 55 kg', '10–12 oz', '14 oz'], ['55–70 kg', '12–14 oz', '16 oz'],
      ['70–85 kg', '14–16 oz', '16 oz'], ['über 85 kg', '16 oz', '16–18 oz']] },
    note: 'Richtwerte. Im Gym gilt, was der Trainer vorgibt.',
    cta: 'Ganze Tabelle & Tipps',
    link: 'https://gearcheck.ch/ratgeber/boxhandschuhe-groesse/',
    title: 'Boxhandschuhe: Welche Grösse (Unzen) brauche ich? Tabelle nach Körpergewicht',
    description: 'Welche Grösse Boxhandschuhe brauchst du? Die Unzen-Tabelle nach Körpergewicht für Sandsack, Pratzen und Sparring. Plus: Klett oder Schnürung, Material und die häufigsten Fehler beim ersten Kauf. Ehrliche Kaufberatung aus der Schweiz auf gearcheck.ch',
    alt: 'Tabelle: Boxhandschuh-Grösse in Unzen nach Körpergewicht für Sandsack, Pratzen und Sparring'
  },
  {
    id: 'home-gym', sport: 'fitness', board: 'Home-Gym & Fitness Ausrüstung',
    tag: 'Home-Gym · Kaufberatung',
    headline: 'Home-Gym starten mit <em>ca.&nbsp;100&nbsp;€</em>',
    checks: [
      ['Trainingsmatte', '20–40 €'], ['Widerstandsbänder', '15–35 €'],
      ['Springseil', '10–25 €'], ['Klimmzugstange', '20–45 €']],
    note: 'Nach 2–3 Monaten: verstellbare Kurzhanteln dazu.',
    cta: 'Alle Budget-Stufen',
    link: 'https://gearcheck.ch/ratgeber/home-gym-einsteiger/',
    title: 'Home-Gym für Einsteiger: Die Grundausstattung für ca. 100 €',
    description: 'Training zu Hause ohne grosses Budget: Diese vier Geräte reichen für den Start. Matte, Widerstandsbänder, Springseil und Klimmzugstange, danach verstellbare Kurzhanteln. Mit Tipps für kleine Wohnungen und Mietwohnungen. Alle Budget-Stufen auf gearcheck.ch',
    alt: 'Checkliste: Home-Gym Grundausstattung für Einsteiger mit Preisspannen'
  },
  {
    id: 'fussballschuhe', sport: 'fussball', board: 'Fussball Ausrüstung',
    tag: 'Fussball · Kaufberatung',
    headline: 'Welche Sohle für <em>welchen Platz?</em>',
    table: { head: ['Sohle', 'Platz'], rows: [
      ['FG', 'Naturrasen'], ['AG', 'Kunstrasen'], ['MG', 'Rasen und Kunstrasen'],
      ['SG', 'nasser, tiefer Rasen'], ['TF', 'Hartplatz, Kleinfeld'], ['IN', 'Halle']] },
    note: 'Rasen im Sommer, Kunstrasen im Winter? Dann MG.',
    cta: 'Alle Sohlen erklärt',
    link: 'https://gearcheck.ch/ratgeber/fussballschuhe-sohle/',
    title: 'Fussballschuhe: FG, AG, MG, TF oder IN? Welche Sohle für welchen Platz',
    description: 'FG, AG, MG, SG, TF, IN: Was bedeuten die Kürzel auf Fussballschuhen? Die richtige Sohle für Naturrasen, Kunstrasen, Hartplatz und Halle auf einen Blick. Plus Tipps zu Grösse, Material und Preis. Ehrliche Kaufberatung auf gearcheck.ch',
    alt: 'Tabelle: Fussballschuh-Sohlen FG, AG, MG, SG, TF und IN und der passende Platz'
  },
  {
    id: 'laufschuhe', sport: 'running', board: 'Running & Laufen Ausrüstung',
    tag: 'Running · Kaufberatung',
    headline: 'Laufschuhe kaufen: <em>4&nbsp;Regeln</em>',
    checks: [
      ['Halbe bis ganze Nummer grösser', ''], ['Daumenbreite Platz vorne', ''],
      ['Nachmittags mit Laufsocken probieren', ''], ['Die Ferse darf nicht rutschen', '']],
    note: 'Neue Schuhe nach etwa 600–1000 km.',
    cta: 'Ratgeber für Einsteiger',
    link: 'https://gearcheck.ch/ratgeber/laufschuhe-einsteiger/',
    title: 'Laufschuhe kaufen: 4 Regeln für die richtige Grösse',
    description: 'Laufschuhe für Einsteiger: So findest du die richtige Grösse. Eine halbe bis ganze Nummer grösser, Daumenbreite Platz, nachmittags anprobieren. Dazu Dämpfung, Sprengung, neutral oder stabil und wann du neue Schuhe brauchst. Auf gearcheck.ch',
    alt: 'Checkliste: vier Regeln für die richtige Laufschuh-Grösse'
  },
  {
    id: 'velohelm', sport: 'radsport', board: 'Radsport & Velo Ausrüstung',
    tag: 'Radsport · Sicherheit',
    headline: 'Sitzt dein <em>Velohelm</em> richtig?',
    checks: [
      ['Waagrecht, 2 Finger über den Brauen', ''], ['Riemen bilden ein V unter dem Ohr', ''],
      ['1 Finger Platz am Kinnriemen', ''], ['Wackelt nicht beim Kopfschütteln', '']],
    note: 'Nach jedem Sturz mit Aufprall ersetzen.',
    cta: 'Grösse & Typen',
    link: 'https://gearcheck.ch/ratgeber/velohelm-kaufen/',
    title: 'Velohelm richtig einstellen: 4 Punkte für den perfekten Sitz',
    description: 'Ein Velohelm schützt nur, wenn er richtig sitzt. Waagrecht, zwei Finger über den Augenbrauen, Riemen im V unter dem Ohr und ein Finger Platz am Kinn. Dazu: Kopfumfang messen, Helmtypen, MIPS und wann der Helm ersetzt werden muss. Auf gearcheck.ch',
    alt: 'Checkliste: so sitzt der Velohelm richtig'
  },
  {
    id: 'schwimmbrille', sport: 'schwimmen', board: 'Schwimmen Ausrüstung',
    tag: 'Schwimmen · Kaufberatung',
    headline: 'Welche <em>Schwimmbrille</em> wofür?',
    table: { head: ['Glas', 'Wann sinnvoll'], rows: [
      ['Klar', 'Hallenbad, wenig Licht'], ['Leicht getönt', 'helle Hallen'],
      ['Dunkel getönt', 'Freibad und See'], ['Verspiegelt', 'starke Sonne']] },
    note: 'Saugtest: ohne Band andrücken. Hält sie, dichtet sie.',
    cta: 'Tipps gegen Beschlagen',
    link: 'https://gearcheck.ch/ratgeber/schwimmbrille-kaufen/',
    title: 'Schwimmbrille kaufen: Welche Glasfarbe wofür? Plus Saugtest',
    description: 'Klar, getönt oder verspiegelt? Welche Schwimmbrille fürs Hallenbad, Freibad oder den See passt. Mit dem einfachen Saugtest für die richtige Passform und Tipps, damit die Brille nicht beschlägt. Ehrliche Kaufberatung auf gearcheck.ch',
    alt: 'Tabelle: Schwimmbrillen-Glasfarben und wann sie sinnvoll sind'
  },
  {
    id: 'skibrille', sport: 'wintersport', board: 'Wintersport: Ski & Snowboard Ausrüstung',
    tag: 'Wintersport · Kaufberatung',
    headline: 'Skibrille: Welche <em>Filterkategorie?</em>',
    table: { head: ['Kat.', 'Licht'], rows: [
      ['S0', 'sehr wenig Licht, Nacht'], ['S1', 'Nebel, Schneefall'], ['S2', 'wechselhaft, Allrounder'],
      ['S3', 'sonnig, Skiferien'], ['S4', 'Gletscher, extrem hell']] },
    note: 'Nur eine Brille? Dann S2 oder S3.',
    cta: 'Helm & Brille richtig',
    link: 'https://gearcheck.ch/ratgeber/skihelm-skibrille/',
    title: 'Skibrille: Filterkategorie S0 bis S4 einfach erklärt',
    description: 'S1 bei Nebel, S3 bei Sonne: Welche Filterkategorie deine Skibrille braucht, auf einen Blick. Plus: Skihelm in der richtigen Grösse und wie Helm und Brille ohne Lücke zusammenpassen. Ehrliche Kaufberatung für die Skisaison auf gearcheck.ch',
    alt: 'Tabelle: Filterkategorien S0 bis S4 für Skibrillen'
  },
  {
    id: 'schlaeger', sport: 'racket', board: 'Tennis & Padel Ausrüstung',
    tag: 'Tennis & Padel · Kaufberatung',
    headline: 'Der richtige <em>Schläger</em> für Einsteiger',
    table: { head: ['', 'Tennis', 'Padel'], rows: [
      ['Form', 'grosser Kopf', 'rund'], ['Gewicht', '260–290 g', '355–365 g'],
      ['Wichtig', 'Griff L2–L3', 'weicher Kern']] },
    note: 'Kein Profi-Schläger zum Start: der verzeiht kaum Fehler.',
    cta: 'Tennis & Padel erklärt',
    link: 'https://gearcheck.ch/ratgeber/schlaeger-einsteiger/',
    title: 'Tennis- oder Padelschläger für Einsteiger: Darauf kommt es an',
    description: 'Welcher Schläger für den Start? Beim Tennis zählen grosser Kopf, 260–290 g und die richtige Griffstärke. Beim Padel eine runde Form, eher leichtes Gewicht und ein weicher Kern. Der Vergleich für Einsteiger auf gearcheck.ch',
    alt: 'Vergleich: Tennisschläger und Padelschläger für Einsteiger'
  },
  {
    id: 'kampfsport-liste', sport: 'kampfsport', board: 'Kampfsport Ausrüstung: Boxen, MMA, Thaiboxen',
    tag: 'Kampfsport · Checkliste',
    headline: 'Kampfsport: Die <em>komplette</em> Ausrüstung',
    two: true,
    checks: [['Boxhandschuhe', ''], ['Handbandagen', ''], ['Mundschutz', ''], ['Tiefschutz', ''],
      ['Schienbeinschoner', ''], ['Kopfschutz', ''], ['Pratzen & Thaipads', ''], ['Boxsack', '']],
    note: 'Boxen, Thaiboxen, MMA und Ringen, mit Tipps und Preisen.',
    cta: 'Zur Ausrüstung',
    link: 'https://gearcheck.ch/kampfsport/',
    title: 'Kampfsport Ausrüstung Checkliste: Was du für Boxen, Thaiboxen und MMA brauchst',
    description: 'Die komplette Kampfsport-Ausrüstung als Checkliste: Boxhandschuhe, Bandagen, Mundschutz, Tiefschutz, Schienbeinschoner, Kopfschutz, Pratzen und Boxsack. Zu jedem Teil, worauf du beim Kauf achten solltest, und was es ungefähr kostet. Auf gearcheck.ch',
    alt: 'Checkliste: komplette Kampfsport-Ausrüstung für Boxen, Thaiboxen und MMA'
  },
  {
    id: 'fussball-liste', sport: 'fussball', board: 'Fussball Ausrüstung',
    tag: 'Fussball · Checkliste',
    headline: 'Fussball: Die <em>komplette</em> Ausrüstung',
    two: true,
    checks: [['Fussballschuhe', ''], ['Schienbeinschoner', ''], ['Torwarthandschuhe', ''], ['Grip-Socken', ''],
      ['Trainingsball', ''], ['Ballpumpe', ''], ['Hütchen & Leiter', ''], ['Minitore', '']],
    note: 'Für Verein, Halle und Garten, mit Tipps und Preisen.',
    cta: 'Zur Ausrüstung',
    link: 'https://gearcheck.ch/fussball/',
    title: 'Fussball Ausrüstung Checkliste: Von den Schuhen bis zum Minitor',
    description: 'Was du für Fussball wirklich brauchst: Fussballschuhe für jeden Platz, Schienbeinschoner, Torwarthandschuhe, Grip-Socken, Trainingsball und Zubehör fürs Training. Zu jedem Teil Tipps und Preisspannen. Auf gearcheck.ch',
    alt: 'Checkliste: komplette Fussball-Ausrüstung'
  },
  {
    id: 'home-gym-liste', sport: 'fitness', board: 'Home-Gym & Fitness Ausrüstung',
    tag: 'Home-Gym · Checkliste',
    headline: 'Home-Gym: Die <em>komplette</em> Ausrüstung',
    two: true,
    checks: [['Trainingsmatte', ''], ['Widerstandsbänder', ''], ['Klimmzugstange', ''], ['Kurzhanteln', ''],
      ['Kettlebell', ''], ['Hantelbank', ''], ['Langhantel-Set', ''], ['Faszienrolle', '']],
    note: 'Von der ersten Matte bis zum eigenen Kraftraum.',
    cta: 'Zur Ausrüstung',
    link: 'https://gearcheck.ch/home-gym/',
    title: 'Home-Gym Ausrüstung Checkliste: Alles fürs Training zu Hause',
    description: 'Dein Home-Gym Schritt für Schritt: Matte, Widerstandsbänder, Klimmzugstange, Kurzhanteln, Kettlebell, Hantelbank, Langhantel und Faszienrolle. Zu jedem Gerät, worauf du achten solltest, auch für kleine Wohnungen. Auf gearcheck.ch',
    alt: 'Checkliste: komplette Home-Gym-Ausrüstung'
  },
  {
    id: 'running-liste', sport: 'running', board: 'Running & Laufen Ausrüstung',
    tag: 'Running · Checkliste',
    headline: 'Running: Die <em>komplette</em> Ausrüstung',
    two: true,
    checks: [['Laufschuhe', ''], ['Laufsocken', ''], ['Shirt & Tights', ''], ['Laufjacke', ''],
      ['GPS-Laufuhr', ''], ['Stirnlampe', ''], ['Laufweste', ''], ['Faszienrolle', '']],
    note: 'Für Strasse und Trail, mit Tipps und Preisen.',
    cta: 'Zur Ausrüstung',
    link: 'https://gearcheck.ch/running/',
    title: 'Running Ausrüstung Checkliste: Alles, was du zum Laufen brauchst',
    description: 'Laufen fängt bei den Schuhen an, hört dort aber nicht auf: Laufsocken, Funktionskleidung, Laufjacke, GPS-Uhr, Stirnlampe für den Winter und Laufweste für lange Läufe. Mit Tipps und Preisspannen auf gearcheck.ch',
    alt: 'Checkliste: komplette Running-Ausrüstung'
  },
  {
    id: 'radsport-liste', sport: 'radsport', board: 'Radsport & Velo Ausrüstung',
    tag: 'Radsport · Checkliste',
    headline: 'Radsport: Die <em>komplette</em> Ausrüstung',
    two: true,
    checks: [['Velohelm', ''], ['Licht-Set', ''], ['Bügelschloss', ''], ['Radhose', ''],
      ['Standpumpe', ''], ['Multitool', ''], ['Velocomputer', ''], ['Rollentrainer', '']],
    note: 'Von Sicherheit bis Wintertraining, mit Tipps und Preisen.',
    cta: 'Zur Ausrüstung',
    link: 'https://gearcheck.ch/radsport/',
    title: 'Radsport Ausrüstung Checkliste: Alles rund ums Velo',
    description: 'Was gehört zur Velo-Ausrüstung? Helm, Licht, Schloss, Radhose mit Polster, Pumpe, Multitool, Velocomputer und Rollentrainer für den Winter. Zu jedem Teil Tipps und Preisspannen. Auf gearcheck.ch',
    alt: 'Checkliste: komplette Radsport-Ausrüstung'
  },
  {
    id: 'schwimmen-liste', sport: 'schwimmen', board: 'Schwimmen Ausrüstung',
    tag: 'Schwimmen · Checkliste',
    headline: 'Schwimmen: Die <em>komplette</em> Ausrüstung',
    two: true,
    checks: [['Schwimmbrille', ''], ['Badekappe', ''], ['Badebekleidung', ''], ['Pull Buoy', ''],
      ['Paddles', ''], ['Kurze Flossen', ''], ['Schwimmuhr', ''], ['Neoprenanzug', '']],
    note: 'Fürs Hallenbad, Training und Freiwasser.',
    cta: 'Zur Ausrüstung',
    link: 'https://gearcheck.ch/schwimmen/',
    title: 'Schwimmen Ausrüstung Checkliste: Vom Hallenbad bis zum See',
    description: 'Die komplette Schwimm-Ausrüstung: Schwimmbrille, Badekappe, Trainingsbadebekleidung, Pull Buoy, Paddles, kurze Flossen, Schwimmuhr und Neoprenanzug fürs Freiwasser. Mit Tipps und Preisspannen auf gearcheck.ch',
    alt: 'Checkliste: komplette Schwimm-Ausrüstung'
  },
  {
    id: 'wintersport-liste', sport: 'wintersport', board: 'Wintersport: Ski & Snowboard Ausrüstung',
    tag: 'Wintersport · Checkliste',
    headline: 'Skiferien: Die <em>komplette</em> Ausrüstung',
    two: true,
    checks: [['Skihelm', ''], ['Skibrille', ''], ['Rückenprotektor', ''], ['Jacke & Hose', ''],
      ['Funktionswäsche', ''], ['Skisocken', ''], ['Skihandschuhe', ''], ['Schuhtrockner', '']],
    note: 'Schutz, Bekleidung und Zubehör für die Piste.',
    cta: 'Zur Ausrüstung',
    link: 'https://gearcheck.ch/wintersport/',
    title: 'Skiferien Packliste: Die komplette Wintersport-Ausrüstung',
    description: 'Packliste für die Skiferien: Skihelm, Skibrille, Rückenprotektor, Skijacke und Skihose, Funktionswäsche, Skisocken, Handschuhe und Schuhtrockner. Zu jedem Teil, worauf du achten solltest. Auf gearcheck.ch',
    alt: 'Checkliste: Packliste für Skiferien'
  },
  {
    id: 'tennis-padel-liste', sport: 'racket', board: 'Tennis & Padel Ausrüstung',
    tag: 'Tennis & Padel · Checkliste',
    headline: 'Tennis & Padel: Die <em>komplette</em> Ausrüstung',
    two: true,
    checks: [['Tennisschläger', ''], ['Padelschläger', ''], ['Bälle', ''], ['Tennisschuhe', ''],
      ['Padelschuhe', ''], ['Griffband', ''], ['Schlägertasche', ''], ['Schweissbänder', '']],
    note: 'Für Einsteiger in beide Sportarten, mit Tipps und Preisen.',
    cta: 'Zur Ausrüstung',
    link: 'https://gearcheck.ch/tennis-padel/',
    title: 'Tennis & Padel Ausrüstung Checkliste für Einsteiger',
    description: 'Was du für Tennis und Padel brauchst: Schläger für Einsteiger, Bälle, Tennis- und Padelschuhe, Griffband, Tasche und Schweissbänder. Zu jedem Teil Tipps und Preisspannen. Auf gearcheck.ch',
    alt: 'Checkliste: komplette Tennis- und Padel-Ausrüstung'
  }
  ,
  {
    id: 'boxsack', sport: 'kampfsport', board: 'Kampfsport Ausrüstung: Boxen, MMA, Thaiboxen',
    tag: 'Kampfsport · Kaufberatung',
    headline: 'Welcher <em>Boxsack</em> für zu Hause?',
    table: { head: ['Training', 'Länge', 'Gewicht'], rows: [
      ['Boxen', '80–120 cm', '25–40 kg'], ['Kick & Thai', '150–180 cm', '35–50 kg'], ['Kinder', '60–80 cm', '10–20 kg']] },
    note: 'Faustregel: etwa die Hälfte des Körpergewichts.',
    cta: 'Hängend oder stehend?',
    link: 'https://gearcheck.ch/ratgeber/boxsack-kaufen/',
    title: 'Boxsack für zu Hause: Welche Länge und welches Gewicht?',
    description: 'Welcher Boxsack passt zu deinem Training? Länge und Gewicht für Boxen, Kickboxen und Thaiboxen auf einen Blick. Plus: hängend oder Standboxsack, gefüllt oder ungefüllt und wie du ihn sicher an der Decke montierst. Auf gearcheck.ch',
    alt: 'Tabelle: Boxsack-Länge und Gewicht für Boxen, Kickboxen und Kinder'
  },
  {
    id: 'zwiebelprinzip', sport: 'wintersport', board: 'Wintersport: Ski & Snowboard Ausrüstung',
    tag: 'Wintersport · Kaufberatung',
    headline: 'Skifahren: Das <em>Zwiebelprinzip</em>',
    checks: [
      ['Basisschicht', 'Merino oder Synthetik auf der Haut'], ['Mittelschicht', 'Fleece oder leichte Daune'],
      ['Aussenschicht', 'wasserdicht und atmungsaktiv'], ['Keine Baumwolle', 'sie wird nass und kühlt aus']],
    note: 'Lieber eine Schicht mehr, die du ausziehen kannst.',
    cta: 'Richtig anziehen',
    link: 'https://gearcheck.ch/ratgeber/skibekleidung-zwiebelprinzip/',
    title: 'Skibekleidung: Das Zwiebelprinzip in 3 Schichten erklärt',
    description: 'Warm und trocken auf der Piste: Basisschicht aus Merino, Mittelschicht aus Fleece oder Daune und eine wasserdichte Skijacke. Dazu, was je nach Temperatur passt und warum zwei Paar Socken keine gute Idee sind. Auf gearcheck.ch',
    alt: 'Checkliste: Zwiebelprinzip mit drei Schichten für Skibekleidung'
  },
  {
    id: 'schienbeinschoner', sport: 'fussball', board: 'Fussball Ausrüstung',
    tag: 'Fussball · Kaufberatung',
    headline: 'Welche Grösse <em>Schienbeinschoner?</em>',
    table: { head: ['Körpergrösse', 'Grösse'], rows: [
      ['bis 120 cm', 'XS'], ['120–140 cm', 'S'], ['140–160 cm', 'M'], ['160–180 cm', 'L'], ['über 180 cm', 'XL']] },
    note: 'Typische Werte. Im Zweifel die Herstellertabelle prüfen.',
    cta: 'Grösse & Arten',
    link: 'https://gearcheck.ch/ratgeber/schienbeinschoner-groesse/',
    title: 'Schienbeinschoner: Welche Grösse? Tabelle nach Körpergrösse',
    description: 'Welche Grösse Schienbeinschoner brauchst du oder dein Kind? Die Tabelle nach Körpergrösse, dazu: mit oder ohne Knöchelschutz, Einschiebe-Schoner oder Klettband und wie sie nicht verrutschen. Auf gearcheck.ch',
    alt: 'Tabelle: Schienbeinschoner-Grösse nach Körpergrösse'
  },
  {
    id: 'kurzhanteln', sport: 'fitness', board: 'Home-Gym & Fitness Ausrüstung',
    tag: 'Home-Gym · Kaufberatung',
    headline: 'Verstellbare <em>Kurzhanteln:</em> welches System?',
    table: { head: ['System', 'Wechsel', 'Paar'], rows: [
      ['Scheiben', 'langsam', '40–120 €'], ['Stecksystem', 'schnell', '100–300 €'], ['Drehsystem', 'Sekunden', '150–400 €']] },
    note: 'Für den Start reichen oft 20–24 kg pro Hand.',
    cta: 'Systeme erklärt',
    link: 'https://gearcheck.ch/ratgeber/kurzhanteln-verstellbar/',
    title: 'Verstellbare Kurzhanteln: Scheiben, Steck- oder Drehsystem?',
    description: 'Ein Paar verstellbare Kurzhanteln ersetzt einen ganzen Hantelständer. Welches System passt zu dir, wie schwer sie sein müssen und worauf du beim Kauf achten solltest. Für dein Home-Gym auf gearcheck.ch',
    alt: 'Tabelle: Systeme verstellbarer Kurzhanteln mit Wechselzeit und Preis'
  }
];

window.SPORTS = {
  fitness:     { color: '#ff5a1f', text: '#e04a12', art: 'home-gym' },
  kampfsport:  { color: '#e0262b', text: '#d42228', art: 'kampfsport' },
  fussball:    { color: '#16a34a', text: '#139442', art: 'fussball' },
  running:     { color: '#a3cf1c', text: '#6a9600', art: 'running' },
  radsport:    { color: '#7c3aed', text: '#7c3aed', art: 'radsport' },
  schwimmen:   { color: '#1d6fe0', text: '#1d6fe0', art: 'schwimmen' },
  wintersport: { color: '#38bdf8', text: '#0e8bc9', art: 'wintersport' },
  racket:      { color: '#14b8a6', text: '#0f978a', art: 'tennis-padel' }
};

window.BOARDS = [
  { name: 'Home-Gym & Fitness Ausrüstung', description: 'Ausrüstung fürs Training zu Hause: Hanteln, Matten, Bänder, Klimmzugstangen und mehr. Ehrliche Kaufberatung, auch für kleine Wohnungen.' },
  { name: 'Kampfsport Ausrüstung: Boxen, MMA, Thaiboxen', description: 'Boxhandschuhe, Bandagen, Schutzausrüstung und Boxsäcke für Boxen, Thaiboxen, MMA und Ringen. Worauf es beim Kauf ankommt.' },
  { name: 'Fussball Ausrüstung', description: 'Fussballschuhe für jeden Platz, Schienbeinschoner, Torwarthandschuhe und Trainingszubehör. Kaufberatung für Verein, Halle und Garten.' },
  { name: 'Running & Laufen Ausrüstung', description: 'Laufschuhe, Laufbekleidung, Laufuhren und Zubehör für Strasse und Trail. Tipps für Einsteiger und alle, die mehr laufen wollen.' },
  { name: 'Radsport & Velo Ausrüstung', description: 'Velohelm, Licht, Schloss, Radbekleidung, Werkzeug und Rollentrainer. Alles rund ums Velo, ehrlich erklärt.' },
  { name: 'Schwimmen Ausrüstung', description: 'Schwimmbrillen, Badekappen, Trainingshilfen, Schwimmuhren und Neopren. Fürs Hallenbad, Training und Freiwasser.' },
  { name: 'Wintersport: Ski & Snowboard Ausrüstung', description: 'Skihelm, Skibrille, Protektoren, Skibekleidung und Zubehör. Packlisten und Kaufberatung für die Skisaison.' },
  { name: 'Tennis & Padel Ausrüstung', description: 'Tennis- und Padelschläger für Einsteiger, Bälle, Schuhe und Zubehör. Worauf es beim Kauf ankommt.' }
];
