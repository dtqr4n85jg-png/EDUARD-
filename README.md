# Familien-Manager Discord Bot

Ein umfassender Discord Bot für Familien/Gang-Management mit Moderation, Events, Ticket-System und Fun-Commands.

## Features

### ⚙️ Moderation
- `!clear <Anzahl>` - Löscht bis zu 100 Nachrichten
- `!ban <@User> [Grund]` - Bannt einen User
- `!timeout <@User> <Minuten> [Grund]` - Gibt einen Timeout
- `!role <@User> <@Rolle>` - Verwaltet Rollen

### ⚔️ Events
- `!army` - Army Event Ankündigung mit Embed
- `!hafen` - Hafenraub Ankündigung mit Embed

### 🎭 Fun Commands
- `!cosanostra` - Mafia Geschichte
- `!yaro` - Zufällige Zahl (1-30 cm)
- `!azul` - Custom Spruch
- `!casino` - Slot Machine mit Währungssystem

### 📊 Status
- `!online` - Grünes Embed (User ist online)
- `!offline` - Rotes Embed (User ist offline)

### 📑 Server-Systeme
- `!setupticket` - Erstellt Ticket-System (Beschwerden, Support, Bewerbungen)
- `!closeticket` - Schließt ein Ticket
- `!embed` - Erstellt Custom Embeds
- `!familie` - Zeigt alle Mitglieder
- `!events` - Zeigt Event-Zeiten (Sommer/Winter)
- `!vorschlag` - Vorschlag einreichen

### 📜 Hilfe
- `!commands` - Zeigt alle Commands

## Setup für Pella.app

1. Bot Token in die Secrets als `DISCORD_TOKEN` eintragen
2. Bot starten
3. Fertig!

## Konfiguration

Die Bot-Einstellungen befinden sich in `config.js`:
- Erlaubte Server
- Moderator-Rolle
- Channel-IDs
- Prefix

## Entwickler

Erstellt von HXT 1

## Hosting

Optimiert für Pella.app Hosting
