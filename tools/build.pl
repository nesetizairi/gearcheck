#!/usr/bin/perl
# GearCheck Build
# Hält auf allen Seiten aktuell: Kopf- und Fusszeile, Meta-Daten (Titel, Open Graph, strukturierte Daten),
# Produktkarten der Sportseiten, Ratgeber-Listen (Startseite, Übersicht, Sportseiten), Inhaltsverzeichnis,
# Teilen-Leiste, weiterführende Artikel, Suchindex, Sitemap. Am Schluss werden alle internen Links geprüft.
#
# Aufruf (Git Bash):  perl tools/build.pl
# Quelle der Wahrheit sind die Seiten selbst. Neue Inhalte also normal in die HTML-Datei schreiben,
# danach dieses Skript laufen lassen. Zusatzinfos zu Produkten stehen in tools/produkte.txt.
use strict;
use warnings;
use utf8;
use FindBin;
use File::Find;
use File::Copy qw(copy);
use File::Path qw(make_path);
use Digest::MD5 qw(md5_hex);
binmode STDOUT, ':encoding(UTF-8)';
binmode STDERR, ':encoding(UTF-8)';
chdir "$FindBin::Bin/.." or die "Projektordner nicht gefunden\n";

my $SITE = 'https://gearcheck.ch';
my @lt = localtime;
my $TODAY = sprintf '%04d-%02d-%02d', $lt[5] + 1900, $lt[4] + 1, $lt[3];

# ---------------------------------------------------------------- Konfiguration
my @SPORTS = (
  { dir => 'home-gym', cat => 'fitness', name => 'Home-Gym & Fitness', short => 'Home-Gym', h1 => 'Home-Gym- und Fitness-Ausrüstung',
    mega => 'Hanteln, Matten, Bänder', card => 'Hanteln, Matten, Bänder und Klimmzugstangen: alles fürs Training zu Hause, auch auf wenig Platz.', anim => 'lift' },
  { dir => 'kampfsport', cat => 'kampfsport', name => 'Kampfsport', short => 'Kampfsport', h1 => 'Kampfsport-Ausrüstung', dark => 1,
    mega => 'Boxen, Thaiboxen, MMA, Ringen', card => 'Handschuhe, Bandagen, Schutz und Boxsäcke für Boxen, Kickboxen, Thaiboxen und MMA.', anim => 'punch' },
  { dir => 'fussball', cat => 'fussball', name => 'Fussball', short => 'Fussball', h1 => 'Fussball-Ausrüstung',
    mega => 'Schuhe, Schutz, Training', card => 'Fussballschuhe für jeden Platz, Schienbeinschoner, Bälle und Trainingszubehör.', anim => 'spin' },
  { dir => 'running', cat => 'running', name => 'Running', short => 'Running', h1 => 'Running-Ausrüstung',
    mega => 'Laufschuhe, Bekleidung, Technik', card => 'Laufschuhe, Bekleidung, Laufuhr und Stirnlampe für Strasse und Trail.', anim => 'run' },
  { dir => 'radsport', cat => 'radsport', name => 'Radsport', short => 'Radsport', h1 => 'Radsport- und Fahrrad-Ausrüstung', dark => 1,
    mega => 'Helm, Licht, Werkzeug', card => 'Helm, Licht, Schloss, Bekleidung, Werkzeug und Rollentrainer rund ums Fahrrad.', anim => 'tilt' },
  { dir => 'schwimmen', cat => 'schwimmen', name => 'Schwimmen', short => 'Schwimmen', h1 => 'Schwimm-Ausrüstung',
    mega => 'Brille, Training, Freiwasser', card => 'Schwimmbrille, Badekappe, Trainingshilfen und Neopren für Becken und See.', anim => 'shine' },
  { dir => 'wintersport', cat => 'wintersport', name => 'Wintersport', short => 'Wintersport', h1 => 'Wintersport-Ausrüstung',
    mega => 'Helm, Brille, Bekleidung', card => 'Skihelm, Skibrille, Protektoren und Bekleidung für Ski und Snowboard.', anim => 'tilt' },
  { dir => 'tennis-padel', cat => 'racket', name => 'Tennis & Padel', short => 'Tennis & Padel', h1 => 'Tennis- und Padel-Ausrüstung',
    mega => 'Schläger, Bälle, Schuhe', card => 'Schläger für Einsteiger, Bälle, Schuhe und Zubehör für beide Racket-Sportarten.', anim => 'swing' },
);
my %SPORT_BY_CAT = map { $_->{cat} => $_ } @SPORTS;
my %SPORT_BY_DIR = map { $_->{dir} => $_ } @SPORTS;

# Beliebte Ratgeber auf der Startseite, mit Fragen als Überschrift. Diese erscheinen nicht nochmals bei "Neueste".
my @POPULAR = (
  ['boxhandschuhe-groesse', 'Welche Boxhandschuhe brauche ich?'],
  ['laufschuhe-einsteiger', 'Welcher Laufschuh passt zu mir?'],
  ['fussballschuhe-sohle', 'Welche Fussballschuhe brauche ich?'],
  ['kurzhanteln-verstellbar', 'Welche Kurzhanteln lohnen sich?'],
  ['schwimmbrille-kaufen', 'Welche Schwimmbrille ist die richtige?'],
  ['home-gym-einsteiger', 'Was brauche ich fürs Home-Gym?'],
);

# Pin-Bilder (hochformatig) für den Pinterest-Teilen-Knopf der Ratgeber
my %PIN = (
  'boxhandschuhe-groesse' => '01-boxhandschuhe', 'home-gym-einsteiger' => '02-home-gym', 'fussballschuhe-sohle' => '03-fussballschuhe',
  'laufschuhe-einsteiger' => '04-laufschuhe', 'velohelm-kaufen' => '05-velohelm', 'schwimmbrille-kaufen' => '06-schwimmbrille',
  'skihelm-skibrille' => '07-skibrille', 'schlaeger-einsteiger' => '08-schlaeger', 'boxsack-kaufen' => '17-boxsack',
  'skibekleidung-zwiebelprinzip' => '18-zwiebelprinzip', 'schienbeinschoner-groesse' => '19-schienbeinschoner', 'kurzhanteln-verstellbar' => '20-kurzhanteln',
  'handbandagen' => '27-handbandagen', 'mma-handschuhe' => '28-mma-handschuhe', 'klimmzugstange' => '29-klimmzugstange',
  # Vergleiche
  'boxsack-haengend-oder-stehend' => '30-vs-boxsack', 'fg-oder-ag' => '31-vs-fg-ag', 'verstellbare-oder-feste-kurzhanteln' => '32-vs-kurzhanteln',
  'kettlebell-oder-kurzhantel' => '33-vs-kettlebell', 'fahrradhelm-mit-oder-ohne-mips' => '34-vs-mips', 'trailschuhe-oder-strassenlaufschuhe' => '35-vs-trail',
);

# GearCheck Finder: je Sportart eine Frage zum Trainingsort, die Grundausstattung (start), sinnvolle Ergänzungen (mehr),
# typische Fehlkäufe und passende Ratgeber.
#   start: [Produktname wie auf der Sportseite, Begründung, Orte (leer = überall)]
#   mehr:  [Produktname, Begründung, Orte, Art]. Art: leer = wie die Einstufung der Produktkarte (bedarf -> nur bei Bedarf, sonst Ergänzung),
#          'plus' = Ergänzung, 'fort' = erst für Fortgeschrittene, 'bedarf' = nur in bestimmten Fällen, wird nie ins Budget eingerechnet.
#   fehl:  [Text, Orte]    ratgeber: [Slug, Orte]
# Preise kommen automatisch aus den Produktkarten.
my %FINDER = (
  'kampfsport' => { ort => ['Wo trainierst du?', [['gym', 'Im Gym oder Verein'], ['home', 'Zu Hause']]],
    start => [['Boxhandschuhe', '14–16 oz passen für die meisten Einsteiger', ''], ['Handbandagen', 'Stützen Handgelenk und Knöchel', ''], ['Mundschutz', 'Spätestens fürs erste Sparring', 'gym'], ['Springseil', 'Kondition und Fussarbeit', 'home'],
              ['Rashguard', 'Liegt eng an, nichts flattert, vor allem bei MMA und Thaiboxen', 'gym'], ['MMA- und Thai-Shorts', 'Bewegungsfreiheit für Tritte und Bodenkampf', 'gym']],
    mehr => [['Schienbeinschoner', 'Sobald Tritte dazukommen', 'gym', ''], ['Tiefschutz', 'Für Kickboxen, Thaiboxen und MMA', 'gym', ''], ['Sporttasche mit Nassfach', 'Hält Nasses und Trockenes getrennt', 'gym', ''], ['Kopfschutz', 'Für regelmässiges Sparring', 'gym', 'fort'],
             ['Boxsack, hängend', 'Oder ein Standboxsack, wenn du nicht bohren kannst', 'home', ''], ['Boxpratzen', 'Für Kombinationen mit Partner', '', ''], ['MMA-Handschuhe', 'Nur wenn du MMA trainierst und greifen musst', '', 'bedarf'], ['Puzzlematten für Bodenarbeit', 'Für Grappling zu Hause', 'home', 'bedarf']],
    fehl => [['Zu leichte Handschuhe fürs Sparring: Die meisten Gyms verlangen 16 oz.', 'gym'], ['Ohne Bandagen trainieren: Der Handschuh allein stützt das Handgelenk nicht.', ''], ['Einen hängenden Boxsack kaufen, ohne vorher die Decke zu prüfen.', 'home']],
    ratgeber => [['boxhandschuhe-groesse', ''], ['handbandagen', ''], ['mma-handschuhe', 'gym'], ['boxsack-kaufen', 'home']] },
  'home-gym' => { ort => ['Wie viel Platz hast du?', [['klein', 'Wenig Platz'], ['gross', 'Keller oder Garage']]],
    start => [['Trainingsmatte', 'Die Basis für fast jede Übung', ''], ['Widerstandsbänder mit Griffen', 'Viele Übungen auf wenig Platz', ''], ['Klimmzugstange', 'Rücken und Arme, ohne Bohren', ''], ['Springseil', 'Ausdauer für wenig Geld', '']],
    mehr => [['Verstellbare Kurzhanteln', 'Der nächste Schritt fürs Krafttraining', '', ''], ['Kettlebell', 'Schwungübungen und Ganzkörpertraining', '', ''], ['Schlingentrainer', 'Ganzkörpertraining fast ohne Platz', 'klein', ''], ['Hantelbank', 'Erweitert die Übungsauswahl', 'gross', ''],
             ['Faszienrolle', 'Für die Erholung', '', ''], ['Langhantel-Set', 'Für schwere Grundübungen', 'gross', 'fort'], ['Kniebeugenständer', 'Sicher schwer trainieren ohne Partner', 'gross', 'fort'], ['Bodenschutzmatten', 'Sobald schwere Gewichte im Spiel sind', 'gross', 'fort']],
    fehl => [['Teure Grossgeräte kaufen, bevor die Basis sitzt.', ''], ['Die Klimmzugstange kaufen, ohne den Türrahmen zu messen.', ''], ['Schwere Gewichte ohne Bodenschutz einsetzen.', 'gross']],
    ratgeber => [['home-gym-einsteiger', ''], ['klimmzugstange', 'klein'], ['kurzhanteln-verstellbar', 'gross'], ['kettlebell-gewicht', '']] },
  'fussball' => { ort => ['Wo spielst du?', [['verein', 'Im Verein'], ['garten', 'Im Garten oder privat']]],
    start => [['Multi-Ground-Schuh (MG)', 'Ein Schuh für Rasen und Kunstrasen', ''], ['Schienbeinschoner', 'Im Spiel Pflicht', 'verein'], ['Trainingsball', 'Grösse 5 ab etwa 12 Jahren', ''], ['Trinkflasche', 'Für Training und Spiel', '']],
    mehr => [['Grip-Socken', 'Mehr Halt im Schuh', 'verein', ''], ['Sporttasche mit Schuhfach', 'Trennt Schuhe und Kleidung', 'verein', ''], ['Hallenschuh (IN)', 'Fürs Hallentraining im Winter', 'verein', ''], ['Koordinationsleiter', 'Für schnelle Füsse', '', ''],
             ['Markierungshütchen', 'Für Übungen im Garten', 'garten', ''], ['Minitore', 'In Sekunden aufgebaut', 'garten', 'plus'], ['Ballpumpe', 'Für den eigenen Ball', 'garten', ''], ['Rebounder', 'Passen und Ballannahme allein üben', 'garten', 'bedarf'], ['Torwarthandschuhe', 'Nur, wenn du im Tor stehst', '', 'bedarf']],
    fehl => [['FG-Schuhe auf Kunstrasen tragen: Die Nocken können hängen bleiben.', ''], ['Schienbeinschoner nach Gefühl statt nach Körpergrösse kaufen.', 'verein'], ['Einen teuren Matchball für den Garten kaufen: Ein robuster Trainingsball hält mehr aus.', 'garten']],
    ratgeber => [['fussballschuhe-sohle', ''], ['schienbeinschoner-groesse', 'verein']] },
  'running' => { ort => ['Wo läufst du meistens?', [['strasse', 'Strasse und feste Wege'], ['trail', 'Wald und Trail']]],
    start => [['Laufschuhe für die Strasse', 'Das wichtigste Teil, am besten anprobieren', 'strasse'], ['Trailschuhe', 'Grobes Profil für Halt im Gelände', 'trail'], ['Laufsocken', 'Beugen Blasen vor', ''], ['Laufshirt', 'Trocknet schneller als Baumwolle', '']],
    mehr => [['Lauftights', 'Für kühle Tage', '', ''], ['Laufjacke', 'Für Wind und Regen', '', ''], ['Reflektorweste', 'Gesehen werden auf der Strasse', 'strasse', ''], ['Schlauchschal', 'Gegen kalte Luft beim Einatmen', '', ''], ['Stirnlampe', 'Für Läufe im Dunkeln', '', ''],
             ['Faszienrolle', 'Für die Erholung', '', ''], ['Laufweste', 'Wasser und Jacke auf langen Trails', 'trail', 'fort'], ['Soft Flask', 'Trinken unterwegs', 'trail', 'fort'], ['GPS-Laufuhr', 'Wenn du Fortschritte messen willst', '', 'fort']],
    fehl => [['Laufschuhe zu klein kaufen: Vorne gehört eine Daumenbreite Platz hin.', ''], ['In Baumwolle laufen: Sie wird nass, schwer und scheuert.', ''], ['Im Dunkeln ohne Licht oder Reflektoren an der Strasse laufen.', 'strasse'], ['Mit glatten Strassenschuhen auf nasse Trails: Das Profil findet kaum Halt.', 'trail']],
    ratgeber => [['laufschuhe-einsteiger', ''], ['laufen-im-winter', '']] },
  'radsport' => { ort => ['Wofür fährst du?', [['stadt', 'Pendeln und Alltag'], ['sport', 'Sport und Touren']]],
    start => [['Fahrradhelm (Velohelm)', 'Bei jeder Fahrt', ''], ['Licht-Set vorne und hinten', 'Nachts vorgeschrieben', ''], ['Fahrradklingel (Veloglocke)', 'In DE, AT und CH Pflicht', ''], ['Bügelschloss', 'Sicher abstellen', 'stadt'], ['Flickzeug und Reifenheber', 'Für den ersten Platten', 'sport'], ['Standpumpe mit Manometer', 'Der richtige Reifendruck', '']],
    mehr => [['Regenjacke fürs Rad', 'Trocken zur Arbeit', 'stadt', ''], ['Radhose mit Sitzpolster', 'Für längere Fahrten', 'sport', ''], ['Trinkflasche und Halter', 'Trinken ohne anzuhalten', 'sport', ''], ['Multitool', 'Kleine Reparaturen unterwegs', 'sport', ''],
             ['Fahrradhandschuhe', 'Entlasten die Hände', 'sport', ''], ['Satteltasche', 'Schlauch und Werkzeug immer dabei', 'sport', ''], ['Fahrradcomputer mit GPS', 'Tempo und Navigation', 'sport', 'fort']],
    fehl => [['Den Helm nicht richtig einstellen: Er schützt nur, wenn er sitzt.', ''], ['Mit zu wenig Luft fahren: Das kostet Kraft und Reifen.', ''], ['Ein teures Velo mit einem dünnen Kabelschloss sichern.', 'stadt']],
    ratgeber => [['velohelm-kaufen', ''], ['fahrradschloss', 'stadt']] },
  'schwimmen' => { ort => ['Wo schwimmst du?', [['halle', 'Hallenbad'], ['see', 'See und Freiwasser']]],
    start => [['Schwimmbrille', 'Dicht und ohne Druck', ''], ['Badekappe', 'In vielen Bädern Pflicht, im See gut sichtbar', ''], ['Trainingsbadeanzug', 'Oder eine eng anliegende Badehose', ''], ['Badeschuhe', 'Für Dusche und Beckenrand', 'halle'], ['Schwimmboje', 'Damit Boote und andere dich sehen', 'see']],
    mehr => [['Pull Buoy', 'Für das Armtraining', 'halle', ''], ['Kurze Trainingsflossen', 'Für Beinschlag und Tempo', '', ''], ['Anti-Fog-Spray', 'Gegen beschlagene Brillen', '', ''], ['Schwimmbrett', 'Für das Beintraining, viele Bäder leihen es aus', 'halle', ''],
             ['Schwimmuhr', 'Zählt Bahnen und Züge', '', 'fort'], ['Neoprenanzug zum Schwimmen', 'Für kaltes Freiwasser', 'see', 'bedarf']],
    fehl => [['Eine Brille ohne Saugtest kaufen.', ''], ['Im Freiwasser ohne Boje schwimmen: Boote sehen dich schlecht.', 'see'], ['Zu grosse Paddles zum Start kaufen: Sie belasten die Schultern.', 'halle']],
    ratgeber => [['schwimmbrille-kaufen', ''], ['trainingshilfen-schwimmen', 'halle']] },
  'wintersport' => { ort => ['Wo fährst du?', [['piste', 'Auf der Piste'], ['park', 'Park und Gelände']]],
    start => [['Skihelm', 'Auf der Piste heute Standard', ''], ['Skibrille', 'Passend zum Helm anprobieren', ''], ['Skijacke', 'Wasserdicht und atmungsaktiv', ''], ['Skihose', 'Mit Gamaschen über dem Schuh', ''], ['Skihandschuhe', 'Fäustlinge halten wärmer', ''],
              ['Skisocken', 'Nur ein Paar tragen', ''], ['Funktionsunterwäsche', 'Die erste Schicht auf der Haut', '']],
    mehr => [['Rückenprotektor', 'Für Park und schnelles Fahren', 'park', 'plus'], ['Halswärmer', 'Für Lift und Wind', '', ''], ['Schuhtrockner', 'Trockene Schuhe am Morgen', '', ''],
             ['Protektorenshorts', 'Beim Snowboarden lernen', 'park', 'bedarf'], ['Handgelenkschoner', 'Für Snowboard-Anfänger', 'park', 'bedarf'], ['Lawinen-Notfallset', 'Nur abseits der Piste und mit Kurs', 'park', 'bedarf']],
    fehl => [['Helm und Brille getrennt kaufen: Zusammen anprobieren, damit keine Lücke bleibt.', ''], ['Zwei Paar Socken übereinander tragen: Das drückt im Skischuh.', ''], ['Lawinenausrüstung ohne Kurs kaufen: Sie hilft nur, wenn du sie bedienen kannst.', 'park']],
    ratgeber => [['skihelm-skibrille', ''], ['skibekleidung-zwiebelprinzip', '']] },
  'tennis-padel' => { ort => ['Was spielst du?', [['tennis', 'Tennis'], ['padel', 'Padel']]],
    start => [['Tennisschläger für Einsteiger', 'Grosser Kopf, eher leicht', 'tennis'], ['Padelschläger für Einsteiger', 'Runde Form, grosser Sweetspot', 'padel'], ['Tennisbälle', 'Mehrere Dosen auf Vorrat', 'tennis'], ['Padelbälle', 'Weniger Druck als Tennisbälle', 'padel'], ['Griffband (Overgrip)', 'Besserer Halt, günstig', '']],
    mehr => [['Tennisschuhe', 'Halt bei seitlichen Bewegungen', 'tennis', ''], ['Padelschuhe', 'Mit Fischgrät-Sohle', 'padel', ''], ['Kantenschutz für den Padelschläger', 'Schützt den Rahmen', 'padel', ''], ['Schweissbänder', 'Damit der Griff trocken bleibt', '', ''],
             ['Tennistasche', 'Für Schläger und Schuhe', 'tennis', 'bedarf'], ['Padeltasche', 'Mit gepolstertem Schlägerfach', 'padel', 'bedarf'], ['Tennis-Trainer mit Gummiseil', 'Schlagtraining allein', 'tennis', 'bedarf']],
    fehl => [['Einen Profi-Schläger zum Start kaufen: Er verzeiht kaum Fehler.', ''], ['Tennisbälle fürs Padel nehmen: Padelbälle haben weniger Druck.', 'padel'], ['In Laufschuhen auf den Platz: Sie geben seitlich zu wenig Halt.', 'tennis']],
    ratgeber => [['schlaeger-einsteiger', ''], ['tennisschuhe-padelschuhe', '']] },
);

# "Passend dazu" am Ende jedes Ratgebers: Produktkarten (Sportart|Name) und Vergleiche (Slug)
my %PASSEND = (
  'boxhandschuhe-groesse' => { p => ['kampfsport|Boxhandschuhe', 'kampfsport|Handbandagen', 'kampfsport|Mundschutz', 'kampfsport|MMA-Handschuhe'],
                               v => ['boxhandschuhe-oder-mma-handschuhe', 'boxhandschuhe-leder-oder-kunstleder', 'handbandagen-oder-innenhandschuhe'] },
  'boxsack-kaufen' => { p => ['kampfsport|Boxsack, hängend', 'kampfsport|Standboxsack', 'kampfsport|Boxhandschuhe', 'kampfsport|Handbandagen'], v => ['boxsack-haengend-oder-stehend'] },
  'fussballschuhe-sohle' => { p => ['fussball|Multi-Ground-Schuh (MG)', 'fussball|Kunstrasenschuh (AG)', 'fussball|Turf-Schuh (TF)', 'fussball|Hallenschuh (IN)'], v => ['fg-oder-ag'] },
  'schienbeinschoner-groesse' => { p => ['fussball|Schienbeinschoner', 'fussball|Grip-Socken', 'fussball|Sporttape'], v => ['fg-oder-ag'] },
  'home-gym-einsteiger' => { p => ['home-gym|Trainingsmatte', 'home-gym|Widerstandsbänder mit Griffen', 'home-gym|Klimmzugstange', 'home-gym|Verstellbare Kurzhanteln'],
                             v => ['kurzhanteln-oder-langhantel', 'kettlebell-oder-kurzhantel'] },
  'kurzhanteln-verstellbar' => { p => ['home-gym|Verstellbare Kurzhanteln', 'home-gym|Hantelbank', 'home-gym|Kettlebell'],
                                 v => ['verstellbare-oder-feste-kurzhanteln', 'kurzhanteln-oder-langhantel', 'kettlebell-oder-kurzhantel'] },
  'laufschuhe-einsteiger' => { p => ['running|Laufschuhe für die Strasse', 'running|Trailschuhe', 'running|Laufsocken'], v => ['trailschuhe-oder-strassenlaufschuhe'] },
  'velohelm-kaufen' => { p => ['radsport|Fahrradhelm (Velohelm)', 'radsport|Licht-Set vorne und hinten', 'radsport|Bügelschloss'], v => ['fahrradhelm-mit-oder-ohne-mips'] },
  'schwimmbrille-kaufen' => { p => ['schwimmen|Schwimmbrille', 'schwimmen|Anti-Fog-Spray', 'schwimmen|Badekappe'] },
  'skihelm-skibrille' => { p => ['wintersport|Skihelm', 'wintersport|Skibrille', 'wintersport|Rückenprotektor'] },
  'skibekleidung-zwiebelprinzip' => { p => ['wintersport|Funktionsunterwäsche', 'wintersport|Skijacke', 'wintersport|Skihose', 'wintersport|Skisocken'] },
  'schlaeger-einsteiger' => { p => ['tennis-padel|Tennisschläger für Einsteiger', 'tennis-padel|Padelschläger für Einsteiger', 'tennis-padel|Griffband (Overgrip)'] },
  'handbandagen' => { p => ['kampfsport|Handbandagen', 'kampfsport|Boxhandschuhe', 'kampfsport|MMA-Handschuhe', 'fussball|Sporttape'],
                      v => ['handbandagen-oder-innenhandschuhe', 'boxhandschuhe-oder-mma-handschuhe'] },
  'mma-handschuhe' => { p => ['kampfsport|MMA-Handschuhe', 'kampfsport|Handbandagen', 'kampfsport|Mundschutz', 'kampfsport|Tiefschutz'],
                        v => ['boxhandschuhe-oder-mma-handschuhe', 'boxhandschuhe-leder-oder-kunstleder'] },
  'klimmzugstange' => { p => ['home-gym|Klimmzugstange', 'home-gym|Dip-Station', 'home-gym|Schlingentrainer', 'home-gym|Gewichtsweste'] },
  'kettlebell-gewicht' => { p => ['home-gym|Kettlebell', 'home-gym|Bodenschutzmatten', 'home-gym|Trainingsmatte', 'home-gym|Verstellbare Kurzhanteln'],
                            v => ['kettlebell-oder-kurzhantel', 'verstellbare-oder-feste-kurzhanteln'] },
  'laufen-im-winter' => { p => ['running|Schlauchschal', 'running|Lauftights','running|Laufjacke', 'running|Stirnlampe', 'running|Reflektorweste', 'running|Stirnband und Laufhandschuhe'],
                          v => ['trailschuhe-oder-strassenlaufschuhe'] },
  'fahrradschloss' => { p => ['radsport|Bügelschloss', 'radsport|Licht-Set vorne und hinten', 'radsport|Fahrradhelm (Velohelm)'] },
  'trainingshilfen-schwimmen' => { p => ['schwimmen|Pull Buoy', 'schwimmen|Kurze Trainingsflossen', 'schwimmen|Hand-Paddles', 'schwimmen|Frontschnorchel', 'schwimmen|Netzbeutel für Trainingshilfen'] },
  'tennisschuhe-padelschuhe' => { p => ['tennis-padel|Tennisschuhe', 'tennis-padel|Padelschuhe', 'tennis-padel|Tennisschläger für Einsteiger', 'tennis-padel|Padelschläger für Einsteiger'] },
);

# Reihenfolge bei gleichem Datum (z. B. für "Neueste Ratgeber" auf der Startseite): diese zuerst
my @SAME_DAY_FIRST = qw(handbandagen mma-handschuhe klimmzugstange);
my %SAME_DAY_RANK = map { $SAME_DAY_FIRST[$_] => $_ + 1 } 0 .. $#SAME_DAY_FIRST;

# Symbol einer Produktkarte -> Bewegung beim Darüberfahren
my %ANIM;
$ANIM{$_} = 'punch' for qw(glove mmaglove mitt thaipad hand mitten);
$ANIM{$_} = 'lift'  for qw(dumbbell kettlebell barbell bench rack dip vest);
$ANIM{$_} = 'spin'  for qw(ball tennisball trainerball roller);
$ANIM{$_} = 'run'   for qw(runshoe sneaker boot slides socks);
$ANIM{$_} = 'swing' for qw(tennisracket padelracket rope bag freebag bell);
$ANIM{$_} = 'shine' for qw(goggles skigoggles sunglasses watch bikecomputer headlamp bikelight);
$ANIM{$_} = 'tilt'  for qw(bikehelmet skihelmet headgear swimcap cap beanie neckwarmer);

my %MON = (januar => 1, februar => 2, 'märz' => 3, april => 4, mai => 5, juni => 6, juli => 7, august => 8, september => 9, oktober => 10, november => 11, dezember => 12);
my @MON_NAME = qw(- Januar Februar März April Mai Juni Juli August September Oktober November Dezember);

# ---------------------------------------------------------------- Hilfsfunktionen
sub rd { my $f = shift; open my $h, '<:encoding(UTF-8)', $f or die "$f: $!\n"; local $/; my $c = <$h>; close $h; return $c; }
sub wr {
  my ($f, $c) = @_;
  return 0 if -e $f && rd($f) eq $c;
  open my $h, '>:encoding(UTF-8)', $f or die "$f: $!\n"; print $h $c; close $h; return 1;
}
sub dec { my $s = shift // ''; $s =~ s/&nbsp;/ /g; $s =~ s/&quot;/"/g; $s =~ s/&lt;/</g; $s =~ s/&gt;/>/g; $s =~ s/&#39;/'/g; $s =~ s/&amp;/&/g; return $s; }
sub txt { my $s = shift // ''; $s =~ s/<[^>]+>//g; $s = dec($s); $s =~ s/\s+/ /g; $s =~ s/^\s+|\s+$//g; return $s; }
sub h { my $s = shift // ''; $s =~ s/&/&amp;/g; $s =~ s/</&lt;/g; $s =~ s/>/&gt;/g; $s =~ s/"/&quot;/g; return $s; }
sub slugify {
  my $s = lc txt(shift);
  $s =~ s/ä/ae/g; $s =~ s/ö/oe/g; $s =~ s/ü/ue/g; $s =~ s/ß/ss/g; $s =~ s/é|è/e/g;
  $s =~ s/[^a-z0-9]+/-/g; $s =~ s/^-+|-+$//g;
  return $s;
}
sub js { my $s = shift // ''; $s =~ s/\\/\\\\/g; $s =~ s/"/\\"/g; $s =~ s/\r?\n/\\n/g; $s =~ s/\t/ /g; $s =~ s{</}{<\\/}g; return qq("$s"); }
sub json {
  my $v = shift;
  if (ref $v eq 'HASH') { return '{' . join(',', map { js($_) . ':' . json($v->{$_}) } sort keys %$v) . '}'; }
  if (ref $v eq 'ARRAY') { return '[' . join(',', map { json($_) } @$v) . ']'; }
  return 'null' unless defined $v;
  return $$v if ref $v eq 'SCALAR';
  return js($v);
}
sub between {   # ersetzt den Inhalt zwischen <!-- gc:NAME --> und <!-- /gc:NAME -->
  my ($html, $name, $content) = @_;
  my $n = ($html =~ s{(<!-- gc:\Q$name\E -->).*?(<!-- /gc:\Q$name\E -->)}{$1\n$content\n$2}s);
  warn "  Markierung gc:$name fehlt\n" unless $n;
  return $html;
}
sub date_de { my $iso = shift; my ($y, $m, $d) = split /-/, $iso; return ($d + 0) . '. ' . $MON_NAME[$m] . " $y"; }

my $ICON_RESEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>';
my $BADGE = qq(<span class="badge badge-research" title="Recherchierte Empfehlung, nicht selbst getestet">$ICON_RESEARCH Recherchiert</span>);
my $ICON_CHECK = q(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>);
my $BADGE_TESTED = qq(<span class="badge badge-tested" title="Selbst getestet: Neset hat diesen Produkttyp selbst im Training benutzt">$ICON_CHECK Selbst getestet</span>);
my %SVG = (
  search => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/></svg>',
  menu   => '<svg class="i-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close  => '<svg class="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  arrow  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  pin    => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2.1 0-3l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.2-1.9 3.2-4.6 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.6 2.2-4.6 4.4 0 .9.3 1.8.8 2.3l.1.4-.3 1.2c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A10 10 0 1 0 12 2z"/></svg>',
  fb     => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1v-2c0-.9.3-1.6 1.6-1.6h1.7V4.3c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.6V14h2.8v8z"/></svg>',
  wa     => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.2 21.8l4.9-1.3A9.8 9.8 0 1 0 12 2.2zm0 17.8c-1.5 0-3-.4-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.6-.4z"/></svg>',
  link   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></svg>',
  share  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>',
  truck  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/></svg>',
);
# Lieferhinweis unter dem Affiliate-Hinweis (Sportseiten und Ratgeber); gc.js ersetzt den Text passend zum gewählten Land
my $SHIP_NOTE = qq(<p class="ship-note" data-ship-note>$SVG{truck}<span>Die Links führen zu <b>Amazon.de</b>. Versandkosten und mögliche Zusatzgebühren können je nach Lieferland variieren.</span></p>);
my %FLAG = (
  DE => '<svg class="flag" viewBox="0 0 5 3" aria-hidden="true"><rect width="5" height="1" fill="#000"/><rect y="1" width="5" height="1" fill="#DD0000"/><rect y="2" width="5" height="1" fill="#FFCE00"/></svg>',
  AT => '<svg class="flag" viewBox="0 0 3 2" aria-hidden="true"><rect width="3" height="2" fill="#ED2939"/><rect y="0.667" width="3" height="0.667" fill="#fff"/></svg>',
  CH => '<svg class="flag flag-ch" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" fill="#D52B1E"/><path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#fff"/></svg>',
);

# ---------------------------------------------------------------- Produktdaten laden
my (%FACTS, %RENAME, %NEWDESC, %TESTED, %LEVEL, %NOTE);
my %LEVEL_LABEL = (basis => 'Grundausstattung', plus => 'Ergänzung', bedarf => 'Bei Bedarf');
for my $line (split /\n/, rd('tools/produkte.txt')) {
  next if $line =~ /^\s*(#|$)/;
  if ($line =~ /^=>\s*(.+)$/) { my ($s, $old, $new) = map { s/^\s+|\s+$//gr } split /\|/, $1; $RENAME{"$s|$old"} = $new; next; }
  if ($line =~ /^~\s*(.+)$/) { my ($s, $n, $d) = map { s/^\s+|\s+$//gr } split /\|/, $1, 3; $NEWDESC{"$s|$n"} = $d; next; }
  if ($line =~ /^\+\s*(.+)$/) { my ($s, $n) = map { s/^\s+|\s+$//gr } split /\|/, $1, 2; $TESTED{"$s|$n"} = 1; next; }
  if ($line =~ /^\^\s*(.+)$/) {
    my ($s, $n, $st, $we, $ti, $wh) = map { s/^\s+|\s+$//gr } split /\|/, $1, -1;
    warn "  produkte.txt: unbekannte Stufe '$st' bei $s | $n\n" unless $st =~ /^(basis|plus|bedarf)$/;
    warn "  produkte.txt: Tipp ohne Begründung bei $s | $n\n" if $ti && !$wh;
    $LEVEL{"$s|$n"} = { stufe => $st, weniger => $we // '', tipp => $ti // '', warum => $wh // '' };
    next;
  }
  if ($line =~ /^!\s*(.+)$/) { my ($s, $n, $t) = map { s/^\s+|\s+$//gr } split /\|/, $1, 3; $NOTE{"$s|$n"} = $t; next; }
  my @f = map { s/^\s+|\s+$//gr } split /\|/, $line;
  if (@f != 6) { warn "  produkte.txt: Zeile hat nicht 6 Felder: $line\n"; next; }
  $FACTS{"$f[0]|$f[1]"} = { fuer => $f[2], achte => $f[3], plus => $f[4], minus => $f[5] };
}

# ---------------------------------------------------------------- Seiten finden
my @files;
find({ no_chdir => 1, wanted => sub {
  my $f = $File::Find::name; $f =~ s{^\./}{};
  if (-d $_ && $f ne '.' && $f =~ m{(^|/)(_[^/]*|\.[^/]+|tools|assets)$}) { $File::Find::prune = 1; return; }
  push @files, $f if $f =~ m{(^|/)index\.html$} || $f eq '404.html';
} }, '.');
@files = sort @files;

sub url_of { my $f = shift; return '/404.html' if $f eq '404.html'; my $u = '/' . $f; $u =~ s{index\.html$}{}; return $u; }

my %PAGE;   # url -> { file, html, type, ... }
for my $f (@files) {
  my $u = url_of($f);
  my $type = $u eq '/' ? 'home' : $u eq '/404.html' ? '404' : $u eq '/ratgeber/' ? 'guides' : $u =~ m{^/ratgeber/[^/]+/$} ? 'guide'
           : $u eq '/vergleiche/' ? 'compares' : $u =~ m{^/vergleiche/[^/]+/$} ? 'compare'
           : ($u =~ m{^/([^/]+)/$} && $SPORT_BY_DIR{$1}) ? 'sport' : 'page';
  $PAGE{$u} = { file => $f, url => $u, html => rd($f), type => $type };
}

# Kurztexte der Ratgeber: aus data-teaser, beim ersten Lauf aus den alten Karten der Übersicht
my %OLD_TEASER;
for my $html (map { $_->{html} } grep { $_->{type} =~ /^(guides|home)$/ } values %PAGE) {
  while ($html =~ m{<a class="card[^"]*" href="(/ratgeber/[^"]+/)">.*?<h3>.*?</h3>\s*<p>(.*?)</p>}gs) { $OLD_TEASER{$1} //= txt($2); }
}

# ---------------------------------------------------------------- Ratgeber und Vergleiche einlesen
my (@GUIDES, @COMPARES);
for my $p (grep { $_->{type} eq 'guide' || $_->{type} eq 'compare' } values %PAGE) {
  my $html = $p->{html};
  my $kind = $p->{type} eq 'compare' ? 'vergleich' : 'ratgeber';
  my ($slug) = $p->{url} =~ m{^/(?:ratgeber|vergleiche)/([^/]+)/$};
  my ($h1) = $html =~ m{<h1[^>]*>(.*?)</h1>}s;
  my ($cat) = $html =~ m{<main[^>]*class="[^"]*\bcat-([a-z]+)}s;
  my ($meta) = $html =~ m{<p class="meta">(.*?)</p>}s;
  my $mt = txt($meta);
  my ($d, $mn, $y) = $mt =~ /Aktualisiert am (\d+)\.\s*(\S+)\s+(\d{4})/;
  die "Datum fehlt in $p->{file}\n" unless $y;
  my $iso = sprintf '%04d-%02d-%02d', $y, $MON{lc $mn} || 1, $d;
  my ($min) = $mt =~ /(\d+) Minuten/;
  my ($teaser) = $html =~ m{<main[^>]*data-teaser="([^"]*)"}s;
  $teaser = defined $teaser ? dec($teaser) : ($OLD_TEASER{$p->{url}} // '');
  my ($desc) = $html =~ m{<meta name="description" content="([^"]*)"}s;
  my ($title) = $html =~ m{<title>(.*?)</title>}s;
  my $entry = { slug => $slug, url => $p->{url}, h1_html => $h1, h1 => txt($h1), cat => $cat, date => $iso, min => $min || 5, kind => $kind,
                teaser => $teaser, desc => dec($desc), title => dec($title), img => $kind eq 'vergleich' ? "/assets/img/vergleiche/$slug.svg" : "/assets/img/ratgeber/$slug.svg" };
  push @{ $kind eq 'vergleich' ? \@COMPARES : \@GUIDES }, $entry;
  $p->{guide} = $entry;
  warn "  Kurztext fehlt: $slug\n" unless $teaser;
  warn "  Bild fehlt: $entry->{img}\n" unless -e substr($entry->{img}, 1);
}
@GUIDES = sort { $b->{date} cmp $a->{date} || ($SAME_DAY_RANK{$a->{slug}} || 99) <=> ($SAME_DAY_RANK{$b->{slug}} || 99) || $a->{slug} cmp $b->{slug} } @GUIDES;
my %CAT_ORDER = map { $SPORTS[$_]{cat} => $_ } 0 .. $#SPORTS;
@COMPARES = sort { $CAT_ORDER{$a->{cat}} <=> $CAT_ORDER{$b->{cat}} || $a->{slug} cmp $b->{slug} } @COMPARES;
my %GUIDE = map { $_->{slug} => $_ } @GUIDES;
my %COMPARE = map { $_->{slug} => $_ } @COMPARES;

# ---------------------------------------------------------------- Produkte der Sportseiten einlesen und Karten neu bauen
my %PRODUCTS;     # dir -> [ product ]
my $N_PRODUCTS = 0;

sub product_card {
  my ($p) = @_;
  my $anim = $ANIM{$p->{icon}} ? qq( data-anim="$ANIM{$p->{icon}}") : '';
  my $f = $p->{facts};
  my $lv = $p->{level} || {};
  my $weniger = $lv->{weniger} ? qq(<div><dt>Weniger geeignet</dt><dd>$lv->{weniger}</dd></div>) : '';
  my $facts = $f ? qq(\n                <dl class="gear-facts"><div><dt>Geeignet für</dt><dd>$f->{fuer}</dd></div>$weniger<div><dt>Achte auf</dt><dd>$f->{achte}</dd></div></dl>)
                 . qq(\n                <details class="gear-pros"><summary>Vor- und Nachteile</summary><ul><li class="pro">$f->{plus}</li><li class="con">$f->{minus}</li></ul></details>) : '';
  my $why = '';
  if ($lv->{tipp} && $lv->{warum}) {
    my $lead = $lv->{tipp} =~ /Tipp$/ ? "Warum $lv->{tipp}?" : "$lv->{tipp}:";
    $why = qq(\n                <p class="gear-why"><b>$lead</b> $lv->{warum}</p>);
  }
  my $note = $p->{note} ? qq(\n                <p class="gear-note"><span class="gear-note-av" aria-hidden="true">N</span><span><b>Aus meinem Training:</b> $p->{note}</span></p>) : '';
  my $tags = '';
  if ($lv->{stufe}) {
    $tags = qq(<span class="gear-level lv-$lv->{stufe}" title="GearCheck-Einschätzung">$LEVEL_LABEL{$lv->{stufe}}</span>);
    $tags .= qq(<span class="gear-tip">$lv->{tipp}</span>) if $lv->{tipp};
    $tags = qq(\n                <div class="gear-tags">$tags</div>);
  }
  my $label = h('Auf Amazon ansehen: ' . txt($p->{name}) . ' (Affiliate-Link)');
  my $extra = $p->{offers} ? " $p->{offers}" : '';
  my $guide = $p->{guide} ? "\n                  $p->{guide}" : '';
  return <<HTML;
            <article class="card gear-item" id="$p->{id}">
              <div class="gear-media"><span class="gear-icon"$anim><svg viewBox="0 0 48 48" aria-hidden="true"><use href="/assets/img/icons.svg#$p->{icon}"/></svg></span>@{[ $p->{tested} ? $BADGE_TESTED : $BADGE ]}</div>
              <div class="gear-body">$tags
                <h4>$p->{name}</h4>
                <p class="gear-desc">$p->{desc}</p>$why$facts$note
                <div class="gear-buy">
                  <p class="gear-price"><span>Preisorientierung</span>$p->{price}</p>
                  <a class="btn btn-amazon" href="$p->{href}" target="_blank" rel="sponsored nofollow noopener" data-amazon$extra aria-label="$label">Auf Amazon ansehen*</a>$guide
                </div>
              </div>
            </article>
HTML
}

for my $s (@SPORTS) {
  my $p = $PAGE{"/$s->{dir}/"} or next;
  my $html = $p->{html};
  my %seen;
  my $group = '';
  my @list;
  # Gruppen und Karten der Reihe nach durchgehen
  $html =~ s{(<div class="gear-group" id="([^"]+)">\s*<h3 class="gear-title">(.*?)</h3>)|([ \t]*<article class="card gear-item"[^>]*>.*?</article>\n?)}{
    if (defined $1) {
      my ($gid, $gt) = ($2, txt($3));
      $gt =~ s/\s*·?\s*\d+\s*Produkte?$//;
      $group = $gt;
      $p->{groups}{$gid} = $gt;
      push @{ $p->{group_order} }, $gid;
      qq(<div class="gear-group" id="$gid">\n          <h3 class="gear-title">$gt<small>GROUPCOUNT:$gid</small></h3>);
    } else {
      my $a = $4;
      my ($icon) = $a =~ m{icons\.svg#([\w-]+)};
      my ($name) = $a =~ m{<h4>(.*?)</h4>}s;
      $name = $RENAME{"$s->{dir}|" . txt($name)} // $name;
      my ($desc) = $a =~ m{<p class="gear-desc">(.*?)</p>}s;
      ($desc) = $a =~ m{</h4>\s*<p>(.*?)</p>}s unless defined $desc;
      $desc = $NEWDESC{"$s->{dir}|" . txt($name)} // $desc;
      my ($price) = $a =~ m{<p class="gear-price">(.*?)</p>}s;
      $price =~ s{<span>.*?</span>}{}s;
      my ($atag) = $a =~ m{(<a class="btn btn-amazon"[^>]*>)}s;
      my ($href) = $atag =~ m{href="([^"]+)"};
      my $offers = join ' ', $atag =~ m{(data-offer-[a-z]{2}="[^"]*")}g;
      my ($guide) = $a =~ m{(<a class="gear-guide"[^>]*>.*?</a>)}s;
      my $id = slugify($name);
      $id .= '-' . ++$seen{$id} if $seen{$id}++;
      my $facts = $FACTS{"$s->{dir}|" . txt($name)};
      warn "  Keine Zusatzinfos für $s->{dir} | " . txt($name) . "\n" unless $facts;
      my $prod = { icon => $icon, name => $name, desc => $desc, price => txt($price), href => $href, offers => $offers, guide => $guide,
                   id => $id, group => $group, facts => $facts, sport => $s, tested => $TESTED{"$s->{dir}|" . txt($name)},
                   level => $LEVEL{"$s->{dir}|" . txt($name)}, note => $NOTE{"$s->{dir}|" . txt($name)} };
      warn "  Keine Einschätzung für $s->{dir} | " . txt($name) . "\n" unless $prod->{level};
      push @list, $prod;
      product_card($prod);
    }
  }gse;
  for my $gid (keys %{ $p->{groups} }) {
    my $n = grep { $_->{group} eq $p->{groups}{$gid} } @list;
    $html =~ s{<small>GROUPCOUNT:\Q$gid\E</small>}{<small>· $n Produkte</small>};
  }
  $p->{html} = $html;
  $PRODUCTS{$s->{dir}} = \@list;
  $N_PRODUCTS += @list;
  my ($lead) = $html =~ m{<section class="(?:rubric-head|cat-hero)[^"]*">.*?<p class="lead">(.*?)</p>}s;
  $p->{lead} = $lead;
}
my %PRODUCT_BY = map { my $d = $_; map { ("$d|" . txt($_->{name})) => $_ } @{ $PRODUCTS{$d} } } keys %PRODUCTS;
for my $k (sort keys %TESTED) { warn "  Selbst getestet, aber kein solches Produkt: $k\n" unless $PRODUCT_BY{$k}; }

# ---------------------------------------------------------------- Bausteine
sub guide_card {
  my ($g, %o) = @_;
  my $s = $SPORT_BY_CAT{$g->{cat}};
  my $title = defined $o{title} ? h($o{title}) : $g->{h1_html};
  my $cls = "card guide-card cat-$g->{cat}" . ($o{featured} ? ' is-featured' : '');
  my $lazy = $o{eager} ? '' : ' loading="lazy"';
  my $id = $o{id} ? qq( id="$o{id}") : '';
  my $tag = ($g->{kind} // '') eq 'vergleich' ? 'Vergleich · ' . $s->{short} : $s->{short};
  return qq(<a class="$cls" href="$g->{url}"$id><div class="gc-art"><img src="$g->{img}" alt="" width="800" height="350"$lazy></div>)
       . qq(<div class="gc-body"><span class="tag">) . h($tag) . qq(</span><h3>$title</h3><p>) . h($g->{teaser}) . qq(</p>)
       . qq(<div class="gc-meta"><span class="time">$g->{min} Min. Lesezeit</span><span class="read">Lesen →</span></div></div></a>);
}

sub header_html {
  my ($url) = @_;
  my ($cur) = $url =~ m{^/([^/]+)/};
  my $cur_sport = $cur && $SPORT_BY_DIR{$cur} ? $cur : '';
  if (!$cur_sport && $url =~ m{^/ratgeber/([^/]+)/$} && $GUIDE{$1}) { $cur_sport = ''; }
  my $mega = join "\n", map {
    my $ac = $_->{dir} eq $cur_sport ? ' aria-current="page"' : '';
    qq(            <a class="mega-item cat-$_->{cat}" href="/$_->{dir}/"$ac><img src="/assets/img/gear/$_->{dir}.svg" alt="" width="46" height="46" loading="lazy"><span><b>) . h($_->{name}) . qq(</b><small>) . h($_->{mega}) . qq(</small></span></a>)
  } @SPORTS;
  my $mm = join "\n", map {
    my $ac = $_->{dir} eq $cur_sport ? ' aria-current="page"' : '';
    qq(              <a class="cat-$_->{cat}" href="/$_->{dir}/"$ac><img src="/assets/img/gear/$_->{dir}.svg" alt="" width="34" height="34" loading="lazy">) . h($_->{name}) . qq(</a>)
  } @SPORTS;
  my $nav_cls = $cur_sport ? ' is-current' : '';
  my $ac = sub { my $re = shift; return $url =~ $re ? ' aria-current="page"' : ''; };
  my ($ar, $av, $au) = ($ac->(qr{^/ratgeber/}), $ac->(qr{^/vergleiche/}), $ac->(qr{^/ueber-uns/}));
  my $ns = @SPORTS;
  return <<HTML;
<header class="site-header">
    <div class="wrap header-bar">
      <a class="brand" href="/"><img src="/assets/img/logo.svg" alt="GearCheck – zur Startseite" width="156" height="36"></a>
      <nav class="main-nav" aria-label="Hauptnavigation">
        <details class="nav-drop$nav_cls">
          <summary>Sportarten</summary>
          <div class="mega">
$mega
            <div class="mega-foot"><span>$ns Sportarten, $N_PRODUCTS Produkte erklärt</span><a href="/ratgeber/">Alle Ratgeber →</a></div>
          </div>
        </details>
        <a href="/ratgeber/"$ar>Ratgeber</a>
        <a href="/vergleiche/"$av>Vergleiche</a>
        <a href="/ueber-uns/"$au>Über uns</a>
      </nav>
      <div class="header-actions">
        <button class="icon-btn js-only" type="button" data-search-open aria-label="Suche öffnen">$SVG{search}</button>
        <details class="menu-drop">
          <summary class="icon-btn" aria-label="Menü">$SVG{menu}$SVG{close}</summary>
          <nav class="mobile-menu" aria-label="Menü">
            <p class="mm-title">Sportarten</p>
            <div class="mm-sports">
$mm
            </div>
            <div class="mm-links"><a href="/ratgeber/">Alle Ratgeber</a><a href="/vergleiche/">Vergleiche</a><a href="/ueber-uns/">Über uns</a></div>
          </nav>
        </details>
      </div>
    </div>
  </header>
HTML
}

sub footer_html {
  my $sports = join "\n", map { qq(          <a href="/$_->{dir}/">) . h($_->{name}) . '</a>' } @SPORTS;
  my $pop = join "\n", map { my $g = $GUIDE{$_->[0]}; $g ? qq(          <a href="$g->{url}">) . h($_->[1]) . '</a>' : () } @POPULAR[0 .. 4];
  my $flags = join '', map { qq(<button type="button" data-country="$_" aria-pressed="false" title=") . { DE => 'Deutschland', AT => 'Österreich', CH => 'Schweiz' }->{$_} . qq(">$FLAG{$_}$_</button>) } qw(DE AT CH);
  return <<HTML;
<footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="/assets/img/logo.svg" alt="GearCheck" width="139" height="32" loading="lazy">
          <p>Unabhängige Kaufberatung für Sportausrüstung. Gemacht in der Schweiz, für Deutschland, Österreich und die Schweiz.</p>
          <p><a href="mailto:hello\@gearcheck.ch">hello\@gearcheck.ch</a></p>
        </div>
        <nav class="footer-col" aria-label="Sportarten in der Fusszeile">
          <strong>Sportarten</strong>
$sports
        </nav>
        <nav class="footer-col" aria-label="Beliebte Ratgeber">
          <strong>Beliebte Ratgeber</strong>
$pop
        </nav>
        <nav class="footer-col" aria-label="Über GearCheck">
          <strong>GearCheck</strong>
          <a href="/ratgeber/">Alle Ratgeber</a>
          <a href="/vergleiche/">Vergleiche</a>
          <a href="/ueber-uns/">Über uns</a>
          <a href="/ueber-uns/#methode">So empfehlen wir</a>
          <a href="/impressum/">Impressum</a>
          <a href="/datenschutz/">Datenschutz</a>
        </nav>
      </div>
      <div class="footer-bottom">
        <p class="disclosure">* Mit Stern markierte Links sind Affiliate-Links. Als Amazon-Partner verdiene ich an qualifizierten Verkäufen. Für dich ändert sich am Preis nichts.</p>
        <div class="country js-only" role="group" aria-label="Land wählen"><span class="country-label">Dein Land</span><span class="seg">$flags</span></div>
      </div>
    </div>
  </footer>
  <dialog class="search-dialog" id="suche" aria-label="Suche">
    <form class="search-form" role="search" method="dialog">
      $SVG{search}
      <input type="search" id="suche-feld" placeholder="Wonach suchst du? z. B. Boxhandschuhe" autocomplete="off" aria-label="Suchbegriff">
      <button class="icon-btn" value="close" aria-label="Suche schliessen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    </form>
    <div class="search-results" id="suche-treffer" aria-live="polite"></div>
  </dialog>
HTML
}

my $VER_CSS = substr(md5_hex(do { open my $h, '<:raw', 'assets/css/style.css' or die; local $/; <$h> }), 0, 8);
my $VER_JS  = substr(md5_hex(do { open my $h, '<:raw', 'assets/js/gc.js' or die; local $/; <$h> }), 0, 8);

sub og_key {
  my $p = shift;
  return 'start' if $p->{type} eq 'home';
  return $p->{guide}{slug} if $p->{type} eq 'guide';
  return "vergleich-$p->{guide}{slug}" if $p->{type} eq 'compare';
  my ($k) = $p->{url} =~ m{^/([^/]+)/$};
  return $k // 'start';
}

sub head_html {
  my ($p, $title, $desc, $ld) = @_;
  my $canon = $p->{type} eq '404' ? '' : qq(\n  <link rel="canonical" href="$SITE$p->{url}">);
  my $robots = $p->{type} eq '404' ? qq(\n  <meta name="robots" content="noindex">) : '';
  my $ogtitle = $title; $ogtitle =~ s/\s*\|\s*GearCheck$//;
  $ogtitle = $p->{guide}{h1} if $p->{guide};
  my $key = og_key($p);
  my $img = -e "assets/img/og/$key.png" ? "/assets/img/og/$key.png" : -e 'assets/img/og/start.png' ? '/assets/img/og/start.png' : '';
  my $ogimg = $img ? qq(\n  <meta property="og:image" content="$SITE$img">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n  <meta property="og:image:alt" content=") . h($ogtitle) . '">' : '';
  my $type = $p->{guide} ? 'article' : 'website';
  my $extra = $p->{type} eq 'home' ? qq(\n  <meta name="p:domain_verify" content="8cb4d07ae38832ec0129be50aa1534ad">) : '';
  my $article = $p->{guide} ? qq(\n  <meta property="article:modified_time" content="$p->{guide}{date}">\n  <meta property="article:section" content=") . h($SPORT_BY_CAT{$p->{guide}{cat}}{name}) . '">' : '';
  my $ldjson = $ld ? qq(\n  <script type="application/ld+json">$ld</script>) : '';
  my $t = h($title); my $d = h($desc);
  return <<HTML;
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>$t</title>
  <meta name="description" content="$d">$canon$robots
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/img/favicon-192.png" type="image/png" sizes="192x192">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <link rel="stylesheet" href="/assets/css/style.css?v=$VER_CSS">
  <script>document.documentElement.className = document.documentElement.className.replace('no-js', 'js');</script>
  <script src="/assets/js/gc.js?v=$VER_JS" defer></script>
  <meta name="theme-color" content="#0d0d0d">
  <meta property="og:type" content="$type">
  <meta property="og:site_name" content="GearCheck">
  <meta property="og:locale" content="de_DE">
  <meta property="og:locale:alternate" content="de_AT">
  <meta property="og:locale:alternate" content="de_CH">
  <meta property="og:title" content="@{[h($ogtitle)]}">
  <meta property="og:description" content="$d">@{[ $canon ? qq(\n  <meta property="og:url" content="$SITE$p->{url}">) : '' ]}$ogimg$article
  <meta name="twitter:card" content="summary_large_image">$extra$ldjson
</head>
HTML
}

sub breadcrumbs_ld {
  my @items = @_;   # [name, url] ...
  my (@els, $i);
  for my $it (@items) { my $n = ++$i; push @els, { '@type' => 'ListItem', position => \$n, name => $it->[0], item => $SITE . $it->[1] }; }
  return { '@type' => 'BreadcrumbList', itemListElement => \@els };
}

sub structured_data {
  my ($p, $title, $desc) = @_;
  my $org = { '@type' => 'Organization', name => 'GearCheck', url => "$SITE/", logo => "$SITE/assets/img/favicon-192.png", email => 'hello@gearcheck.ch' };
  my @graph;
  if ($p->{type} eq 'home') {
    push @graph, { '@type' => 'WebSite', name => 'GearCheck', url => "$SITE/", inLanguage => 'de', description => $desc, publisher => $org };
  } elsif ($p->{guide}) {
    my $g = $p->{guide}; my $s = $SPORT_BY_CAT{$g->{cat}};
    my $key = og_key($p);
    my $img = -e "assets/img/og/$key.png" ? "$SITE/assets/img/og/$key.png" : "$SITE$g->{img}";
    push @graph, { '@type' => 'Article', headline => $g->{h1}, description => $desc, image => $img, inLanguage => 'de',
                   datePublished => $g->{date}, dateModified => $g->{date}, mainEntityOfPage => "$SITE$g->{url}",
                   author => { '@type' => 'Person', name => 'Neset Izairi', url => "$SITE/ueber-uns/" }, publisher => $org };
    push @graph, $g->{kind} eq 'vergleich'
      ? breadcrumbs_ld(['Start', '/'], ['Vergleiche', '/vergleiche/'], [$g->{h1}, $g->{url}])
      : breadcrumbs_ld(['Start', '/'], [$s->{name}, "/$s->{dir}/"], [$g->{h1}, $g->{url}]);
  } elsif ($p->{type} eq 'sport') {
    my ($dir) = $p->{url} =~ m{^/([^/]+)/$}; my $s = $SPORT_BY_DIR{$dir};
    push @graph, { '@type' => 'CollectionPage', name => $s->{h1}, description => $desc, url => "$SITE$p->{url}", inLanguage => 'de' };
    push @graph, breadcrumbs_ld(['Start', '/'], [$s->{name}, $p->{url}]);
  } elsif ($p->{type} ne '404') {
    my $name = $title; $name =~ s/\s*\|\s*GearCheck$//; $name =~ s/:.*$//;
    push @graph, breadcrumbs_ld(['Start', '/'], [$name, $p->{url}]);
  }
  return '' unless @graph;
  return json({ '@context' => 'https://schema.org', '@graph' => \@graph });
}

# ---------------------------------------------------------------- Seitentypen
sub build_sport {
  my ($p) = @_;
  my ($dir) = $p->{url} =~ m{^/([^/]+)/$};
  my $s = $SPORT_BY_DIR{$dir};
  my $html = $p->{html};
  my @prods = @{ $PRODUCTS{$dir} };
  my @guides = grep { $_->{cat} eq $s->{cat} } @GUIDES;
  my ($stand) = $html =~ /Stand (\p{L}+ \d{4})/;
  $stand //= 'November 2026';

  # Was suchst du? Erst Produkte mit Ratgeber, dann das erste jeder Gruppe, bis 6
  my @quick = grep { $_->{guide} } @prods;
  for my $gid (@{ $p->{group_order} }) { my ($first) = grep { $_->{group} eq $p->{groups}{$gid} } @prods; push @quick, $first if $first; }
  my %q; @quick = grep { !$q{$_->{id}}++ } @quick; splice @quick, 6 if @quick > 6;
  my $chips = join '', map { qq(<a class="chip" href="#$_->{id}">) . txt($_->{name}) =~ s/&/&amp;/gr . '</a>' } @quick;
  my $dark = $s->{dark} ? ' is-dark' : '';
  my $ng = @guides; my $np = @prods;
  my $hero = <<HTML;
<section class="cat-hero cat-$s->{cat}$dark">
      <div class="wrap">
        <p class="breadcrumb"><a href="/">Start</a> › @{[h($s->{name})]}</p>
        <span class="tag">Sportart</span>
        <h1 class="display">@{[h($s->{h1})]}</h1>
        <p class="lead">$p->{lead}</p>
        <ul class="cat-facts"><li>$np Produkte erklärt</li><li>$ng @{[ $ng == 1 ? 'Ratgeber' : 'Ratgeber' ]}</li><li>Preise: Stand $stand</li></ul>
        <div class="cat-quick"><span>Was suchst du?</span><div>$chips</div></div>
      </div>
    </section>
HTML
  $html =~ s{<section class="(?:rubric-head|cat-hero)[^"]*">.*?</section>\n}{$hero}s or warn "  Kopfbereich nicht gefunden: $p->{file}\n";

  # Unternavigation
  my $links = join '', map { qq(<a class="chip" href="#$_">) . h($p->{groups}{$_}) . '</a>' } @{ $p->{group_order} };
  $links .= qq(<a class="chip" href="#ratgeber">Ratgeber</a>) if @guides;
  my $subnav = qq(<nav class="subnav" aria-label="Kategorien auf dieser Seite"><div class="subnav-inner">$links</div></nav>);
  $html =~ s{<nav class="(?:gear-nav|subnav)".*?</nav>}{$subnav}s;

  # Hinweis zu Affiliate-Links, Kennzeichnung und Lieferland
  my $ntested = grep { $_->{tested} } @prods;
  my $kennz = $ntested
    ? "Produkte mit „Selbst getestet“ habe ich selbst im Training benutzt, alle anderen sind recherchierte Empfehlungen"
    : 'Alle Produkte hier sind recherchierte Empfehlungen, nicht selbst getestet';
  my $notice = qq(<p class="notice"><span>Diese Seite enthält Affiliate-Links (*). Kaufst du darüber ein, erhalte ich eine kleine Provision, für dich ändert sich am Preis nichts. $kennz (<a href="/ueber-uns/#methode">so arbeiten wir</a>). Preisspannen sind grobe Richtwerte, Stand $stand.</span></p>)
             . qq(\n        $SHIP_NOTE);
  # Hinweise stehen unter den Produkten, damit Besucher (z. B. von Pinterest) direkt bei der Ausrüstung landen.
  # Die Kennzeichnung bleibt sichtbar: Stern (*) an jedem Amazon-Knopf, Lieferhinweis für die Schweiz unter jedem Knopf (gc.js).
  $html =~ s{\s*<div class="page-notes">.*?</div><!-- /page-notes -->}{}s;
  $html =~ s{\s*<p class="notice">.*?</p>(\s*<p class="ship-note".*?</p>)?}{}s;
  $html =~ s{(\s*</div>\s*</section>\s*<section class="section section-soft" id="ratgeber">)}{\n        <div class="page-notes">$notice</div><!-- /page-notes -->$1}s
    or warn "  Platz für Hinweise nicht gefunden: $p->{file}\n";
  $html =~ s{<div class="section-title">}{<div class="section-head">}g;

  # Ratgeber und Vergleiche der Sportart
  my @vs = grep { $_->{cat} eq $s->{cat} } @COMPARES;
  my $cards = join "\n", map { '          ' . guide_card($_) } @guides, @vs;
  my $sec_title = @vs ? 'Ratgeber und Vergleiche' : 'Ausführliche Ratgeber';
  $html =~ s{<h2>(?:Ausführliche Ratgeber|Ratgeber und Vergleiche)</h2>}{<h2>$sec_title</h2>};
  if ($html !~ /<!-- gc:guides -->/) {
    $html =~ s{(<h2>Ausführliche Ratgeber</h2>\s*</div>\s*)<div class="grid">.*?</div>}{$1<div class="guide-grid"><!-- gc:guides -->\n<!-- /gc:guides --></div>}s
      or warn "  Ratgeber-Bereich nicht gefunden: $p->{file}\n";
  }
  $html =~ s{<section class="section section-soft">(\s*<div class="wrap">\s*<div class="section-head">\s*<h2>Ausführliche Ratgeber)}{<section class="section section-soft" id="ratgeber">$1}s;
  $html = between($html, 'guides', $cards);

  # GearCheck-Einschätzung je Kategorie: was zuerst, was später, was nur bei Bedarf
  for my $gid (@{ $p->{group_order} }) {
    my @g = grep { $_->{group} eq $p->{groups}{$gid} } @prods;
    my %by;
    push @{ $by{ ($_->{level} || {})->{stufe} // 'plus' } }, $_ for @g;
    my $lnk = sub { join ', ', map { qq(<a href="#$_->{id}">) . h(txt($_->{name})) . '</a>' } @{ $_[0] } };
    my @parts;
    push @parts, '<span><b>Zuerst:</b> ' . $lnk->($by{basis}) . '</span>' if $by{basis};
    push @parts, '<span><b>Später sinnvoll:</b> ' . $lnk->($by{plus}) . '</span>' if $by{plus};
    push @parts, '<span><b>Nur bei Bedarf:</b> ' . $lnk->($by{bedarf}) . '</span>' if $by{bedarf};
    my $adv = qq(<p class="gear-advice"><span class="ga-label">GearCheck-Einschätzung</span>) . join('', @parts) . '</p>';
    $html =~ s{(<div class="gear-group" id="\Q$gid\E">\s*<h3 class="gear-title">.*?</h3>)(\s*<p class="gear-advice">.*?</p>)?}{$1\n          $adv}s;
  }
  $p->{html} = $html;
}

sub passend_html {
  my ($g) = @_;
  my $cfg = $PASSEND{$g->{slug}} or return '';
  my @prod = grep { defined } map { my $x = $PRODUCT_BY{$_}; warn "  Passend dazu: Produkt fehlt: $_\n" unless $x; $x } @{ $cfg->{p} || [] };
  my @vs = grep { defined } map { my $x = $COMPARE{$_}; warn "  Passend dazu: Vergleich fehlt: $_\n" unless $x; $x } @{ $cfg->{v} || [] };
  return '' unless @prod || @vs;
  my $items = join '', map {
    my $s = $_->{sport};
    qq(<li><a href="/$s->{dir}/#$_->{id}"><span><b>) . h(txt($_->{name})) . qq(</b><small>Produktkarte · $_->{price}</small></span>) . ($_->{tested} ? qq(<span class="pd-tested">$ICON_CHECK getestet</span>) : '') . '</a></li>'
  } @prod;
  $items .= join '', map { qq(<li><a href="$_->{url}"><span><b>) . h($_->{h1}) . qq(</b><small>Vergleich · $_->{min} Min.</small></span></a></li>) } @vs;
  return qq(<!-- gc:passend -->\n    <section class="passend" aria-labelledby="passend-dazu"><h2 id="passend-dazu">Passend dazu</h2><ul>$items</ul></section>\n    <!-- /gc:passend -->);
}

sub build_guide {
  my ($p) = @_;
  my $g = $p->{guide};
  my $is_cmp = $g->{kind} eq 'vergleich';
  my $html = $p->{html};
  # Erzeugte Blöcke vom letzten Lauf entfernen, sie werden unten neu gebaut
  $html =~ s{\s*<!-- gc:(toc|share|related|passend) -->.*?<!-- /gc:\1 -->}{}gs;

  # Alt-Text fürs Titelbild aus der Beschreibung in der SVG-Datei (erster Kommentar)
  if ($html =~ m{<figure class="article-art"><img src="(/assets/img/[^"]+\.svg)" alt=""}) {
    my $svgfile = substr($1, 1);
    if (-e $svgfile && rd($svgfile) =~ m{<!--\s*(?:[^:]*:\s*)?(.*?)\s*-->}s) {
      my $alt = 'Illustration: ' . txt($1);
      $alt =~ s/"//g; $alt =~ s/\s*\(([^)]*)\)/ ($1)/g;
      $html =~ s{(<figure class="article-art"><img src="[^"]+") alt=""}{$1 . ' alt="' . h($alt) . '"'}e;
    }
  }

  # Kurztext dauerhaft an der Seite speichern
  if ($html !~ /<main[^>]*data-teaser=/) { my $t = h($g->{teaser}); $html =~ s{<main ([^>]*)>}{<main $1 data-teaser="$t">}; }

  # Ratgeber: Affiliate- und Lieferhinweis stehen am Ende des Artikels (vor "Passend dazu"), damit Besucher
  # direkt beim Inhalt landen. Die Amazon-Knöpfe bleiben mit Stern (*) gekennzeichnet.
  my $notes = '';
  if (!$is_cmp) {
    my ($notice) = $html =~ m{(<p class="notice">.*?</p>)}s;
    $html =~ s{\s*<div class="page-notes">.*?</div><!-- /page-notes -->}{}s;
    $html =~ s{\s*<p class="ship-note"[^>]*>.*?</p>}{}s;
    $html =~ s{\s*<p class="notice">.*?</p>}{}s;
    $notes = qq(<div class="page-notes">$notice) . ($html =~ /data-amazon/ ? "\n    $SHIP_NOTE" : '') . qq(</div><!-- /page-notes -->\n\n    ) if $notice;
  }

  # Meta-Zeile einheitlich
  my $meta = qq(<p class="meta"><span>Aktualisiert am <time datetime="$g->{date}">) . date_de($g->{date}) . qq(</time></span><span>ca. $g->{min} Minuten Lesezeit</span><span>von <a href="/ueber-uns/">Neset</a></span></p>);
  $html =~ s{<p class="meta">.*?</p>}{$meta}s;

  # Überschriften mit Sprungmarken
  my %used; my @toc;
  $html =~ s{<h2( id="([^"]*)")?>(.*?)</h2>}{
    my ($id, $inner) = ($2, $3);
    $id ||= slugify($inner);
    $id .= '-' . ++$used{$id} if $used{$id}++;
    push @toc, [$id, txt($inner)];
    qq(<h2 id="$id">$inner</h2>);
  }gse;

  # Inhaltsverzeichnis nach der Schnellauswahl (oder nach "Kurz und knapp")
  $html =~ s{\s*<!-- gc:toc -->.*?<!-- /gc:toc -->}{}s;
  my $toc = qq(\n\n    <!-- gc:toc -->\n    <details class="toc" open><summary>Inhalt</summary><ol>) . join('', map { qq(<li><a href="#$_->[0]">) . h($_->[1]) . '</a></li>' } @toc) . qq(</ol></details>\n    <!-- /gc:toc -->);
  if (!$is_cmp) { $html =~ s{(<section class="quickpick".*?</section>)}{$1$toc}s or $html =~ s{(<div class="tip">.*?</div>)}{$1$toc}s; }

  # Schnellauswahl: Kennzeichnung je Zeile (data-tested = Produkttyp selbst benutzt) und Stand
  my ($mon, $yr) = (split / /, date_de($g->{date}))[1, 2];
  $html =~ s{\s*<span class="qp-tested">.*?</span>}{}g;
  my $qtested = 0;
  $html =~ s{(<div class="quickpick-row"[^>]*\bdata-tested[^>]*>\s*<div><span class="quickpick-label">.*?</span>)}{$qtested++; $1 . qq( <span class="qp-tested">$ICON_CHECK selbst getestet</span>)}gse;
  my $foot = $qtested ? 'Mit „selbst getestet“ markierte Produkttypen habe ich selbst benutzt, die anderen sind recherchiert' : 'Recherchierte Empfehlungen, nicht selbst getestet';
  $html =~ s{\s*<p class="quickpick-foot">.*?</p>}{}s;
  $html =~ s{(<section class="quickpick".*?)(\s*</section>)}{$1\n      <p class="quickpick-foot">$foot · Preise grob, Stand $mon $yr</p>$2}s;

  # Amazon-Buttons: einheitliche Beschriftung, sprechende Bezeichnung für Screenreader
  $html =~ s{(<div><span class="quickpick-label">.*?</span><b>(.*?)</b>.*?</div>\s*)<a class="btn btn-amazon"([^>]*?)(?: aria-label="[^"]*")?>[^<]*</a>}{$1 . qq(<a class="btn btn-amazon"$3 aria-label=") . h('Auf Amazon ansehen: ' . txt($2) . ' (Affiliate-Link)') . qq(">Auf Amazon ansehen*</a>)}gse;
  $html =~ s{(<article class="card pick"[^>]*>(?:(?!</article>).)*?<h3>(.*?)</h3>(?:(?!</article>).)*?)<a class="btn btn-amazon"([^>]*?)(?: aria-label="[^"]*")?>[^<]*</a>}{$1 . qq(<a class="btn btn-amazon"$3 aria-label=") . h('Auf Amazon ansehen: ' . txt($2) . ' (Affiliate-Link)') . qq(">Auf Amazon ansehen*</a>)}gse;

  # Empfehlungen: "Selbst getestet" bei data-tested, sonst "Recherchiert"
  $html =~ s{<div class="pick-top">(<span class="pick-badge">.*?</span>).*?</div>}{$1}gs;
  $html =~ s{(<article class="card pick"([^>]*)>\s*)<span class="pick-badge">(.*?)</span>}{
    my ($open, $attrs, $label) = ($1, $2, $3);
    $open . qq(<div class="pick-top"><span class="pick-badge">$label</span>) . ($attrs =~ /data-tested/ ? $BADGE_TESTED : $BADGE) . '</div>';
  }gse;

  # Teilen-Leiste und weiterführende Artikel
  my $u = "$SITE$g->{url}";
  my $enc = sub { my $s = shift; utf8::encode($s); $s =~ s/([^A-Za-z0-9\-_.~])/sprintf('%%%02X', ord $1)/ge; return $s; };
  my $media = $PIN{$g->{slug}} && -e "assets/img/pins/$g->{slug}.png" ? "$SITE/assets/img/pins/$g->{slug}.png" : "$SITE/assets/img/og/" . og_key($p) . '.png';
  my $what = $is_cmp ? 'den Vergleich' : 'den Ratgeber';
  my $share = qq(<!-- gc:share -->\n    <div class="share"><span>Hilfreich? Teile $what:</span>)
    . qq(<a href="https://www.pinterest.com/pin/create/button/?url=) . $enc->($u) . '&amp;media=' . $enc->($media) . '&amp;description=' . $enc->($g->{h1}) . qq(" target="_blank" rel="noopener">$SVG{pin}Pinterest</a>)
    . qq(<a href="https://wa.me/?text=) . $enc->("$g->{h1} $u") . qq(" target="_blank" rel="noopener">$SVG{wa}WhatsApp</a>)
    . qq(<a href="https://www.facebook.com/sharer/sharer.php?u=) . $enc->($u) . qq(" target="_blank" rel="noopener">$SVG{fb}Facebook</a>)
    . qq(<button type="button" class="js-only" data-share-native>$SVG{share}<span>Teilen</span></button>)
    . qq(<button type="button" class="js-only" data-share-copy>$SVG{link}<span>Link kopieren</span></button></div>\n    <!-- /gc:share -->);
  $html =~ s{\s*<!-- gc:share -->.*?<!-- /gc:share -->}{}s;
  my $passend = $is_cmp ? '' : passend_html($g);
  $passend = "$passend\n\n    " if $passend;
  $html =~ s{(\s*<div class="author">)}{\n\n    $notes$passend$share$1}s;

  # Weiterlesen: bei Ratgebern zuerst gleiche Sportart, bei Vergleichen zuerst andere Vergleiche derselben Sportart
  my @rel;
  if ($is_cmp) {
    @rel = grep { $_->{slug} ne $g->{slug} && $_->{cat} eq $g->{cat} } @COMPARES;
    push @rel, grep { $_->{cat} eq $g->{cat} } @GUIDES;
    push @rel, grep { $_->{slug} ne $g->{slug} && $_->{cat} ne $g->{cat} } @COMPARES;
  } else {
    @rel = grep { $_->{slug} ne $g->{slug} && $_->{cat} eq $g->{cat} } @GUIDES;
    push @rel, grep { $_->{slug} ne $g->{slug} && $_->{cat} ne $g->{cat} } @GUIDES;
  }
  splice @rel, 3;
  my $rel_title = $is_cmp ? 'Weitere Vergleiche und Ratgeber' : 'Das könnte dich auch interessieren';
  my $related = qq(<!-- gc:related -->\n    <section class="related" aria-labelledby="weiterlesen"><h2 id="weiterlesen">$rel_title</h2><div class="guide-grid">)
    . join('', map { guide_card($_) } @rel) . qq(</div></section>\n    <!-- /gc:related -->);
  $html =~ s{\s*<!-- gc:related -->.*?<!-- /gc:related -->}{}s;
  $html =~ s{(<div class="author">.*?</div>)}{$1\n\n    $related}s;
  $p->{html} = $html;
}

sub build_compares_index {
  my ($p) = @_;
  my @cats = grep { my $c = $_->{cat}; grep { $_->{cat} eq $c } @COMPARES } @SPORTS;
  my $n = @COMPARES;
  my $chips = join '', map { qq(<a class="chip cat-$_->{cat}" href="#$_->{dir}">) . h($_->{short}) . '</a>' } @cats;
  my $i = 0;
  my $sections = join "\n", map {
    my $s = $_; my @v = grep { $_->{cat} eq $s->{cat} } @COMPARES;
    my $soft = $i++ % 2 ? ' section-soft' : '';
    my $cards = join "\n", map { '          ' . guide_card($_, id => $_->{slug}) } @v;
    <<HTML;
    <section class="section guide-section cat-$s->{cat}$soft" id="$s->{dir}">
      <div class="wrap">
        <div class="section-head"><div><span class="kicker">@{[scalar @v]} @{[ @v == 1 ? 'Vergleich' : 'Vergleiche' ]}</span><h2>@{[h($s->{name})]}</h2></div><a class="more-link" href="/$s->{dir}/">Zur kompletten Ausrüstung →</a></div>
        <div class="guide-grid">
$cards
        </div>
      </div>
    </section>
HTML
  } @cats;
  my $main = <<HTML;
<main id="inhalt">
    <section class="page-hero">
      <div class="wrap">
        <p class="breadcrumb"><a href="/">Start</a> › Vergleiche</p>
        <span class="kicker">Entscheidungshilfe</span>
        <h1 class="display">Was passt besser?</h1>
        <p class="lead">$n Entscheidungen, die vor dem Kauf immer wieder auftauchen, im direkten Vergleich. Jeweils mit kurzer Antwort, Tabelle, klarer Empfehlung und dem Weg zur passenden Ausrüstung.</p>
        <div class="filter-bar">$chips</div>
      </div>
    </section>

$sections  </main>
HTML
  $p->{html} =~ s{<main.*?</main>\n}{$main}s;
}

sub build_guides_index {
  my ($p) = @_;
  my @cats = grep { my $c = $_->{cat}; grep { $_->{cat} eq $c } @GUIDES } @SPORTS;
  my $n = @GUIDES; my $ns = @cats;
  my $filters = qq(<button type="button" class="chip" data-filter="alle" aria-pressed="true">Alle</button>)
    . join('', map { qq(<button type="button" class="chip cat-$_->{cat}" data-filter="$_->{cat}" aria-pressed="false">) . h($_->{short}) . '</button>' } @cats);
  my $i = 0;
  my $sections = join "\n", map {
    my $s = $_; my @g = grep { $_->{cat} eq $s->{cat} } @GUIDES;
    my $soft = $i++ % 2 ? ' section-soft' : '';
    my $cards = join "\n", map { '          ' . guide_card($_) } @g;
    <<HTML;
    <section class="section guide-section cat-$s->{cat}$soft" data-cat="$s->{cat}" id="$s->{dir}">
      <div class="wrap">
        <div class="section-head"><div><span class="kicker">@{[scalar @g]} Ratgeber</span><h2>@{[h($s->{name})]}</h2></div><a class="more-link" href="/$s->{dir}/">Zur kompletten Ausrüstung →</a></div>
        <div class="guide-grid">
$cards
        </div>
      </div>
    </section>
HTML
  } @cats;
  my $main = <<HTML;
<main id="inhalt">
    <section class="page-hero">
      <div class="wrap">
        <p class="breadcrumb"><a href="/">Start</a> › Alle Ratgeber</p>
        <span class="kicker">Kaufberatung</span>
        <h1 class="display">Alle Ratgeber</h1>
        <p class="lead">Jeder Ratgeber erklärt zuerst, worauf es ankommt, und empfiehlt erst dann. $n Ratgeber zu $ns Sportarten, dazu <a href="/vergleiche/">Vergleiche</a> der wichtigsten Ausrüstungstypen.</p>
        <div class="filter-bar js-only" role="group" aria-label="Nach Sportart filtern">$filters</div>
      </div>
    </section>

$sections  </main>
HTML
  $p->{html} =~ s{<main.*?</main>\n}{$main}s;
}

sub build_about {
  my ($p) = @_;
  my (@blocks, @none);
  for my $s (@SPORTS) {
    my @t = grep { $_->{tested} } @{ $PRODUCTS{$s->{dir}} || [] };
    if (!@t) { push @none, $s->{name}; next; }
    my $links = join ', ', map { qq(<a href="/$s->{dir}/#$_->{id}">) . h(txt($_->{name})) . '</a>' } @t;
    push @blocks, qq(      <div class="tested-sport cat-$s->{cat}"><h4>) . h($s->{name}) . qq(</h4><p>$links</p></div>);
  }
  my $html = qq(    <div class="tested-list">\n) . join("\n", @blocks) . qq(\n    </div>);
  $html .= "\n    <p>" . h(join(' und ', @none)) . ': Hier arbeite ich bisher nur mit Recherche.</p>' if @none;
  $p->{html} = between($p->{html}, 'tested', $html);
}

sub build_home {
  my ($p) = @_;
  my $html = $p->{html};
  my $ng = @GUIDES; my $ns = @SPORTS;
  $html = between($html, 'stats', qq(          <ul class="hero-stats"><li><b>$ns</b><span>Sportarten</span></li><li><b>$N_PRODUCTS</b><span>Produkte erklärt</span></li><li><b>$ng</b><span>Ratgeber</span></li></ul>));

  my $i = 0;
  my @tiles = map {
    my $t = $i++;
    my $anim = $_->{anim} eq 'shine' ? 'anim-shine' : "anim-$_->{anim}";
    qq(            <a class="sw-tile cat-$_->{cat}" href="/$_->{dir}/" style="--i:$t"><img class="$anim" src="/assets/img/gear/$_->{dir}.svg" alt="" width="200" height="200"><span>) . h($_->{name}) . '</span></a>'
  } @SPORTS;
  splice @tiles, 4, 0, qq(            <div class="sw-tile sw-check" style="--i:4" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="square"><path d="M4 12.5l5 5L20 6.5"/></svg><b>8 Sportarten.<br>Ein Check.</b></div>);
  $html = between($html, 'sportworld', join("\n", @tiles));

  my $cards = join "\n", map {
    my $s = $_; my $np = @{ $PRODUCTS{$s->{dir}} || [] }; my $g = grep { $_->{cat} eq $s->{cat} } @GUIDES;
    qq(          <a class="card sport-card cat-$s->{cat}" href="/$s->{dir}/"><div class="sc-art"><img src="/assets/img/sport/$s->{dir}.svg" alt="" width="600" height="320" loading="lazy"></div>)
    . qq(<div class="sc-body"><span class="sc-meta">$np Produkte · $g Ratgeber</span><h3>) . h($s->{name}) . qq(</h3><p>) . h($s->{card}) . qq(</p><span class="more">Ausrüstung entdecken</span></div></a>)
  } @SPORTS;
  $html = between($html, 'sports', $cards);

  my %pop = map { $_->[0] => 1 } @POPULAR;
  $html = between($html, 'popular', join("\n", map { my $g = $GUIDE{$_->[0]}; $g ? '          ' . guide_card($g, title => $_->[1]) : () } @POPULAR));

  my @new = grep { !$pop{$_->{slug}} } @GUIDES;
  splice @new, 5;
  my $first = shift @new;
  my $mag = '          ' . guide_card($first, featured => 1) . qq(\n          <div class="mag-list">\n) . join("\n", map { '            ' . guide_card($_) } @new) . qq(\n          </div>);
  $html = between($html, 'newest', $mag);

  # Finder-Daten
  my %fd;
  for my $dir (keys %FINDER) {
    my $s = $SPORT_BY_DIR{$dir};
    # Einträge: [Name, Sprungmarke, Begründung, Preis von, Preis bis, Orte, selbst getestet, Art (basis, plus, fort, bedarf)]
    my $conv = sub { my ($list, $is_start) = @_; [ map {
      my $pr = $PRODUCT_BY{"$dir|$_->[0]"};
      warn "  Finder: Produkt fehlt: $dir | $_->[0]\n" unless $pr;
      my ($lo, $hi) = $pr ? $pr->{price} =~ /(\d+)\s*–\s*(\d+)/ : ();
      my $art = $is_start ? 'basis' : ($_->[3] || ((($pr && $pr->{level}) || {})->{stufe} // '') eq 'bedarf' && 'bedarf' || 'plus');
      $pr ? [txt($pr->{name}), $pr->{id}, $_->[1], \($lo // 0), \($hi // 0), $_->[2] // '', \($pr->{tested} ? 1 : 0), $art] : ()
    } @$list ] };
    my @rg = map { my $g = $GUIDE{$_->[0]}; warn "  Finder: Ratgeber fehlt: $_->[0]\n" unless $g; $g ? [$g->{h1}, $g->{url}, $_->[1]] : () } @{ $FINDER{$dir}{ratgeber} || [] };
    $fd{$dir} = { name => $s->{short}, cat => $s->{cat}, url => "/$s->{dir}/", frage => $FINDER{$dir}{ort}[0],
                  orte => $FINDER{$dir}{ort}[1], start => $conv->($FINDER{$dir}{start}, 1), mehr => $conv->($FINDER{$dir}{mehr}, 0),
                  fehl => $FINDER{$dir}{fehl}, ratgeber => \@rg };
  }
  my $order = join ',', map { js($_->{dir}) . ':' . json($fd{$_->{dir}}) } grep { $fd{$_->{dir}} } @SPORTS;
  my $fchips = join '', map { qq(<button type="button" class="chip cat-$_->{cat}" data-finder-sport="$_->{dir}" aria-pressed="false">) . h($_->{short}) . '</button>' } @SPORTS;
  $html = between($html, 'finder', qq(          <script type="application/json" id="finder-daten">{$order}</script>\n          <div class="finder-step"><span>1 · Sportart</span><div class="finder-chips">$fchips</div></div>));
  $p->{html} = $html;
}

# ---------------------------------------------------------------- Alle Seiten zusammensetzen
for my $p (values %PAGE) { build_sport($p) if $p->{type} eq 'sport'; }
for my $p (values %PAGE) {
  my $t = $p->{type};
  build_guide($p) if $t eq 'guide' || $t eq 'compare';
  build_guides_index($p) if $t eq 'guides';
  build_compares_index($p) if $t eq 'compares';
  build_home($p) if $t eq 'home';
  build_about($p) if $p->{url} eq '/ueber-uns/';

  my $html = $p->{html};
  my ($title) = $html =~ m{<title>(.*?)</title>}s; $title = dec($title // 'GearCheck');
  my ($desc) = $html =~ m{<meta name="description" content="([^"]*)"}s; $desc = dec($desc // '');
  my $ld = structured_data($p, $title, $desc);
  $html =~ s{<html[^>]*>}{<html lang="de" class="no-js">};
  $html =~ s{<head>.*?</head>\n?}{head_html($p, $title, $desc, $ld)}se;
  $html =~ s{<header class="site-header">.*?</header>\n?}{header_html($p->{url})}se;
  $html =~ s{<footer class="site-footer">.*?</footer>(\s*<dialog class="search-dialog".*?</dialog>)?\n?}{footer_html()}se;
  $html =~ s{<main(?![^>]*\bid=)}{<main id="inhalt"};
  $html =~ s/\n{3,}/\n\n/g;

  # Echtes Foto statt Initiale, sobald assets/img/neset.jpg existiert (quadratisch, mind. 400 × 400)
  if (-e 'assets/img/neset.jpg') {
    $html =~ s{<span class="avatar" aria-hidden="true">N</span>}{<img class="avatar" src="/assets/img/neset.jpg" alt="Neset" width="54" height="54" loading="lazy">}g;
    $html =~ s{<div class="about-avatar" aria-hidden="true">N</div>}{<div class="about-avatar"><img src="/assets/img/neset.jpg" alt="Neset, Gründer von GearCheck" width="128" height="128"></div>}g;
  }

  # Tabellen: Spaltennamen für die Kartenansicht auf dem Handy
  $html =~ s{(<table>.*?</table>)}{
    my $t = $1;
    my @th = map { txt($_) } ($t =~ m{<th[^>]*>(.*?)</th>}gs);
    $t =~ s{(<tr>)(.*?)(</tr>)}{
      my ($o, $row, $c) = ($1, $2, $3); my $i = 0;
      $row =~ s{<td(?: data-label="[^"]*")?>}{ my $l = $th[$i++] // ''; $l ne '' ? qq(<td data-label=") . h($l) . '">' : '<td>' }ge;
      "$o$row$c";
    }gse;
    $t;
  }gse;
  $p->{html} = $html;
}

# ---------------------------------------------------------------- Pin-Bilder, Suchindex, Sitemap, Daten für Vorschaubilder
make_path('assets/img/pins', 'assets/data', 'tools/og');
for my $slug (sort keys %PIN) {
  my $src = "_marketing/pins/bilder/$PIN{$slug}.png";
  my $dst = "assets/img/pins/$slug.png";
  next unless -e $src;
  copy($src, $dst) if !-e $dst || (stat $src)[9] > (stat $dst)[9];
}

my @idx;
for my $s (@SPORTS) {
  my $np = @{ $PRODUCTS{$s->{dir}} || [] };
  push @idx, { k => 's', t => $s->{name}, u => "/$s->{dir}/", c => $s->{cat}, d => $s->{card}, m => "$np Produkte · Ausrüstung und Ratgeber",
               x => join(' ', map { txt($_->{name}) } @{ $PRODUCTS{$s->{dir}} || [] }) };
}
for my $g (@GUIDES) {
  push @idx, { k => 'g', t => $g->{h1}, u => $g->{url}, c => $g->{cat}, d => "$g->{teaser} $g->{desc}", m => "Ratgeber · $SPORT_BY_CAT{$g->{cat}}{short} · $g->{min} Min." };
}
for my $s (@SPORTS) {
  for my $pr (@{ $PRODUCTS{$s->{dir}} || [] }) {
    my $f = $pr->{facts} || {};
    push @idx, { k => 'p', t => txt($pr->{name}), u => "/$s->{dir}/#$pr->{id}", c => $s->{cat},
                 d => txt("$pr->{desc} " . ($f->{fuer} // '') . ' ' . ($f->{achte} // '')), m => "$s->{short} · $pr->{group} · $pr->{price}" };
  }
}
for my $v (@COMPARES) {
  push @idx, { k => 'g', t => $v->{h1}, u => $v->{url}, c => $v->{cat}, d => "$v->{teaser} $v->{desc}", m => "Vergleich · $SPORT_BY_CAT{$v->{cat}}{short} · $v->{min} Min." };
}
push @idx, { k => 'x', t => 'Über uns', u => '/ueber-uns/', d => 'Wer hinter GearCheck steckt, wie Empfehlungen entstehen, selbst getestet oder recherchiert, Affiliate', m => 'Neset, Methode und Transparenz' };
push @idx, { k => 'x', t => 'Alle Ratgeber', u => '/ratgeber/', d => 'Übersicht Kaufberatung', m => scalar(@GUIDES) . ' Ratgeber' };
push @idx, { k => 'x', t => 'Vergleiche', u => '/vergleiche/', d => 'Ausrüstungstypen im direkten Vergleich', m => 'Was passt besser?' } if $PAGE{'/vergleiche/'};
push @idx, { k => 'x', t => 'Impressum', u => '/impressum/', d => 'Kontakt Anbieter', m => 'Rechtliches' };
push @idx, { k => 'x', t => 'Datenschutz', u => '/datenschutz/', d => 'Datenschutzerklärung DSG DSGVO', m => 'Rechtliches' };
wr('assets/data/suche.json', json(\@idx) . "\n");

my @sm = map {
  my $p = $PAGE{$_};
  my $lm = $p->{guide} ? $p->{guide}{date} : $TODAY;
  "  <url><loc>$SITE$_</loc><lastmod>$lm</lastmod></url>"
} grep { $PAGE{$_}{type} ne '404' } sort keys %PAGE;
wr('sitemap.xml', qq(<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n) . join("\n", @sm) . "\n</urlset>\n");

# Daten für die Vorschaubilder (tools/og/render.ps1)
my @og;
for my $u (sort keys %PAGE) {
  my $p = $PAGE{$u}; next if $p->{type} eq '404';
  my $key = og_key($p);
  my ($title) = $p->{html} =~ m{<title>(.*?)</title>}s; $title = dec($title); $title =~ s/\s*\|\s*GearCheck$//;
  my ($cat, $art, $kicker) = ('fitness', '', 'GearCheck');
  if ($p->{guide}) { my $g = $p->{guide}; ($cat, $art, $kicker, $title) = ($g->{cat}, $g->{img}, $SPORT_BY_CAT{$g->{cat}}{name} . ($g->{kind} eq 'vergleich' ? ' · Vergleich' : ' · Kaufberatung'), $g->{h1}); }
  elsif ($p->{type} eq 'sport') { my ($d) = $u =~ m{^/([^/]+)/$}; my $s = $SPORT_BY_DIR{$d}; ($cat, $art, $kicker, $title) = ($s->{cat}, "/assets/img/sport/$d.svg", 'Sportart · ' . scalar(@{ $PRODUCTS{$d} }) . ' Produkte erklärt', $s->{h1}); }
  elsif ($p->{type} eq 'home') { ($kicker, $title) = ('Kaufberatung für Sportausrüstung', 'Erst checken. Dann kaufen.'); }
  push @og, { key => $key, title => $title, kicker => $kicker, cat => $cat, art => $art };
}
wr('tools/og/daten.js', 'window.OG = ' . json(\@og) . ";\n");

# ---------------------------------------------------------------- Schreiben und Links prüfen
my $changed = 0;
for my $u (sort keys %PAGE) { my $p = $PAGE{$u}; if (wr($p->{file}, $p->{html})) { $changed++; print "  aktualisiert: $p->{file}\n"; } }

my @broken;
my %ids = map { my $u = $_; ($u => { map { $_ => 1 } ($PAGE{$u}{html} =~ m{\bid="([^"]+)"}g) }) } keys %PAGE;
for my $u (sort keys %PAGE) {
  my $html = $PAGE{$u}{html};
  $html =~ s{<script type="application/json".*?</script>}{}gs;
  while ($html =~ m{(?:href|src)="(/[^"]*|#[^"]+)"}g) {
    my $link = dec($1);
    my ($path, $frag) = $link =~ m{^([^#?]*)(?:\?[^#]*)?(?:#(.*))?$};
    $path = $u if $path eq '';
    my $target = $path;
    if ($target =~ m{/$}) { $target .= 'index.html'; }
    my $file = substr($target, 1);
    if (!$PAGE{$path} && !-e $file && !-e "$file/index.html") { push @broken, "$u -> $link"; next; }
    if (defined $frag && $frag ne '' && $PAGE{$path} && !$ids{$path}{$frag}) { push @broken, "$u -> $link (Sprungmarke fehlt)"; }
  }
}
printf "Fertig: %d Seiten, %d Ratgeber, %d Produkte, %d Datei(en) geändert.\n", scalar(keys %PAGE), scalar(@GUIDES), $N_PRODUCTS, $changed;
if (@broken) { print "Defekte Links:\n", map { "  $_\n" } @broken; exit 1; }
print "Alle internen Links in Ordnung.\n";
