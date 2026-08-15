# Södervång — Seating Chart Editor

Öppna `seatingchart.html` i en modern webbläsare för att köra verktyget lokalt.

Snabbstart
- Öppna filen `seatingchart.html` i din webbläsare.
- Skapa en ny sal med fältet "Room name" och klicka "New room".
- Exportera/importera hela projektet som JSON via "Export JSON" / "Import JSON".

Lokal sparning
- Verktyget använder `localStorage` för att spara ett utkast automatiskt i din webbläsare.
- Använd export för att spara en komplett JSON-fil på disken.

Filer
- `seatingchart.html` — Huvudsida för editor.
- `seatingchart.js` — App-logik (grid, import/export, autosave).
- `style.css` — Global CSS med Vellinge-färger och tillgänglighetsstöd.

Teknik
- HTML5, CSS3, Vanilla JavaScript. Ingen server krävs.
