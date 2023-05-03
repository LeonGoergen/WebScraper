# Cinema notifications

### Projektbeschreibung
Das Ziel dieses Projekts ist es, Filmbegeisterten eine einfache Möglichkeit zu bieten, über neue Filmangebote im Rostocker CineStar Capitol Kino auf dem Laufenden zu bleiben. Hierfür werden automatische Benachrichtigungen in Form von Posts auf den Social Media Plattformen Twitter und Instagram generiert, sobald ein neuer Film im Kino angeboten wird. Durch die Implementierung von Webscraping-Techniken werden die erforderlichen Informationen direkt von der Website des Kinos extrahiert.

Unsere Lösung bietet den Filminteressierten eine einfache Möglichkeit, über die neuesten Filmangebote informiert zu bleiben, ohne die Website des Kinos regelmäßig besuchen zu müssen. Die Benachrichtigungen auf Twitter und Instagram enthalten alle relevanten Informationen wie Filmtitel, Filmstart, Spielzeiten, eine kurze Beschreibung und eine Schau-Empfehlung, um gegebenfalls das Interesse zu wecken.

### Projektverlauf
Die Arbeitspakete können grob wie folgt gegliedert werden:

1. Webserver aufsetzen: Es wird eine Webanwendung mittels Express.js auf einem Webserver entwickelt.
2. Webscraper: Durch den Einsatz geeigneter Tools wie puppeteer wird die Website des Rostocker CineStar Capitol Kinos nach den aktuell angebotenen Filmen durchsucht. Dabei werden relevante Informationen wie Filmtitel, Spielzeiten und Filmstart extrahiert. Die extrahierten Daten werden ins JSON-Format gebracht und aufbereitet, um sie später in den Social Media Posts verwenden zu können.
3. Abgleich neue und alte Daten: Nach jedem abgeschlossenen Webscraping-Vorgang werden die neuen Daten mit den vorherigen abgeglichen. Sollten neue Einträge vorhanden sein, werden jeweils neue Benachrichtigungen verfasst.
4. API Services: Nachdem die neuen Filme identifiziert wurden, werden mittels der entsprechenden APIs von Twitter und Instagram sowie axios.js Post-Anfragen erzeugt, welche die gesammelten Informationen in ansprechender Form enthalten.

# Push neuer Inhalte


## How to git

### Repository/Branch clonen
- Terminal öffnen
- Zu gewünschtem Ordner navigieren (cd/ls)
- " git clone -b cinema-notification https://github.com/clecap/web20-2023.git "
- npm -i / pnpm -i (node_modules)

Have fun!

### Commits

Versucht euch an [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) zu halten. 

Lieber zuviele Commits, als zuwenige!
