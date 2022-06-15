# Start des Backends
Im Terminal im Projektverzeichnis folgenden Kommand ausführen: \
`node backend.js`

# Start des Frontends
Kein Start notwendig. Man kann einfach per rechtsklick die HTML-Seite im Browser öffnen.

# Datenbank zurücksetzen
In database Ordner die Datenbank (db.sqlite) löschen.
Im database Ordner folgende Befehle ausführen: \
`sqlite3 db.sqlite`\
`.read init/db.sql`\
`.quit`

# Notwendige Plugins
- Sqlite Viewer (Vs Code)
- Sqlite (Vs Code)

# Wie kommt man an die Session-Informationen?
Über:\
```
const userName = localStorage.getItem('username');
```
```
const email = localStorage.getItem('email');
```

# Hilfreiche Tools
Zum testen von Post Requests: https://addons.mozilla.org/de/firefox/addon/rested/\
**Wichtig:** Als Header den `Content-Type` = `application/json` nutzen

# Aufbau der Datenbank
```
CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS roar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  text TEXT DEFAULT "",
  timestamp CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS favourite (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  roar_id INTEGER,
  FOREIGN KEY(roar_id) REFERENCES roar(id),
  FOREIGN KEY(user_id) REFERENCES user(id)
);
```