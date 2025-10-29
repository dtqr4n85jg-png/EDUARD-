# Familien-Manager Discord Bot

## Projektübersicht
Ein umfassender Discord Bot für deutsche Familien/Gang-Verwaltung mit Moderation, Event-Ankündigungen, Ticket-System, Casino-Spiel und verschiedenen Utility-Commands.

## Bot-Einstellungen
- **Name**: Familien-Manager
- **Owner**: HXT 1
- **Owner-ID**: 1091039309085294733
- **Erlaubte Server**: 
  - 1356133600201932850
  - 1325218478772457542
- **Prefix**: !
- **Moderator-Rolle-ID**: 1432461398344077434

## Technologie-Stack
- Node.js 20
- discord.js v14
- dotenv für Umgebungsvariablen

## Projekt-Struktur
```
/
├── index.js              # Haupt-Bot-Datei
├── config.js             # Bot-Konfiguration
├── commands/             # Alle Bot-Commands
│   ├── clear.js         # Nachrichten löschen
│   ├── ban.js           # User bannen
│   ├── timeout.js       # Timeout vergeben
│   ├── role.js          # Rollen verwalten
│   ├── army.js          # Army Event
│   ├── hafen.js         # Hafen Event
│   ├── cosanostra.js    # Mafia Geschichte
│   ├── yaro.js          # Zufallszahl
│   ├── azul.js          # Custom Spruch
│   ├── casino.js        # Slot Machine
│   ├── online.js        # Online Status
│   ├── offline.js       # Offline Status
│   ├── ticket.js        # Ticket-System
│   ├── closeticket.js   # Ticket schließen
│   ├── embed.js         # Custom Embed
│   ├── familie.js       # Mitglieder-Liste
│   ├── events.js        # Event-Zeiten
│   ├── vorschlag.js     # Vorschlag einreichen
│   └── commands.js      # Hilfe-Command
├── package.json
└── README.md
```

## Features

### Moderation (nur für Moderator-Rolle)
- Nachrichten löschen (bis zu 100)
- User bannen
- Timeouts vergeben
- Rollen verwalten

### Event-Ankündigungen (nur für Moderator-Rolle)
- Army Events mit formatiertem Embed
- Hafenraub Events mit formatiertem Embed

### Fun Commands (für alle)
- Mafia-Geschichten
- Zufallszahl-Generator
- Custom Sprüche
- Casino Slot Machine mit Währungssystem (nur im Casino-Channel)

### Status Commands (für alle)
- Online/Offline Status mit farbigen Embeds

### Server-Systeme
- Ticket-System mit 3 Kategorien (Beschwerden, Support, Bewerbungen)
- Bewerbungsformular mit 9 Fragen
- Custom Embed Creator
- Mitglieder-Anzeige
- Event-Zeiten (Sommer/Winter für Hafen & Army)
- Vorschlagssystem

## Setup-Anleitung

1. Discord Token als Secret `DISCORD_TOKEN` hinzufügen
2. Bot in beiden erlaubten Servern einladen
3. Bot starten

## Hosting
Optimiert für Pella.app Hosting

## Letzte Änderungen
- Projekt erstellt am 28. Oktober 2025
- Alle Commands implementiert
- Ticket-System mit Modal-Forms
- Casino-System mit Buttons und Währung
