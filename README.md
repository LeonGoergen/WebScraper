# Cinema notifications

### Projektbeschreibung
Das Ziel dieses Projekts ist es, Filmbegeisterten eine einfache Möglichkeit zu bieten, über neue Filmangebote im Rostocker CineStar Capitol Kino auf dem Laufenden zu bleiben. Hierfür werden automatische Benachrichtigungen in Form von Posts auf den Social Media Plattformen Twitter und Instagram generiert, sobald ein neuer Film im Kino angeboten wird. Durch die Implementierung von Webscraping-Techniken werden die erforderlichen Informationen direkt von der Website des Kinos extrahiert.

Unsere Lösung bietet den Filminteressierten eine einfache Möglichkeit, über die neuesten Filmangebote informiert zu bleiben, ohne die Website des Kinos regelmäßig besuchen zu müssen. Die Benachrichtigungen auf Twitter und Instagram enthalten alle relevanten Informationen wie Filmtitel, Filmstart, Spielzeiten, eine kurze Beschreibung und eine Schau-Empfehlung, um gegebenfalls das Interesse zu wecken.

### Arbeitspakete
Die Arbeitspakete können grob wie folgt gegliedert werden:

AP1: Webserver aufsetzen: Es wird eine Webanwendung mittels Express.js auf einem Webserver entwickelt. Zudem wird ein main-Programm entwickelt, das die      einzelnen Services zusammenführt und den Abgleich der alten und neuen Filmdaten vornimmt.\
AP2: Webscraper: Durch den Einsatz geeigneter Tools wie puppeteer wird die Website des Rostocker CineStar Capitol Kinos nach den aktuell angebotenen Filmen durchsucht. Dabei werden relevante Informationen wie Filmtitel, Spielzeiten und Filmstart extrahiert. Die extrahierten Daten werden ins JSON-Format gebracht und aufbereitet, um sie später in den Social Media Posts verwenden zu können.\
AP3: API Service IMdB: Es sollen weitere Informationen zu den Filmen wie Beschreibung und User-Score gesammelt werden. Dafür soll die API von ImdB oder einer vergleichbaren Filmdatenbank angesprochen werden.\
AP4/5: API Services: Nachdem die neuen Filme identifiziert wurden, werden mittels der entsprechenden APIs von Twitter(AP4) und Instagram(AP5) sowie axios.js Post-Anfragen erzeugt, welche die gesammelten Informationen in ansprechender Form enthalten.

### Tools
- Sprache: JavaScript
- Webserver: Express.js, node.js
- Webscraper: puppeteer
- Http Requests: Axios
- Datenhaltung: JSON

### Zeitplan/Meilensteine
17.5.:Filmtitel extrahieren und als JSON abspeichern, Social Media Accounts einrichten, Grundgerüst des Webservers\
24.5.:API Service für ImdB oder vergleichbare Filmdatenbank, Strukturierung/Zusammenführung der Daten\
31.5.:Erfolgreiche POST Requests an Twitter und Instagram, Abgleich der Filmdaten\
7.6. :Ansprechende Gestaltung der Posts\
14.6.:Puffer, Anpassungen, etc.

# Push neuer Inhalte

## How to git

### Repository/Branch clonen
- Terminal öffnen
- Zu gewünschtem Ordner navigieren (cd/ls)
- " git clone -b cinema-notification https://github.com/clecap/web20-2023.git "
- cd web20-2023
- npm -i / pnpm -i (node_modules)

Have fun!

### Commits

Versucht euch an [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) zu halten. 

Lieber zuviele Commits, als zuwenige!
