# Kino-Italy API

Kino-Italy är en webbapplikation för att visa och boka italienska filmer. Den innehåller både en frontend och en backend som hanterar dynamiska data och användarinteraktioner.

## Funktioner

### 1. **Startsida**
- En välkomstsida med en videobakgrund och en sökfunktion för att hitta filmer.
- Navigeringsmeny med länkar till olika sektioner som Kontakt, Om oss, Filmer, Biljetter och Inloggning.

### 2. **Filmlista**
- Dynamisk visning av filmer hämtade från backend.
- Varje film visar:
  - Titel
  - Bild (eller en platshållarbild om ingen bild finns)
  - Kort introduktion
  - Betyg (med stjärnor och poäng)
  - Bokningsknapp och recensionsknapp.

### 3. **Bokning och Recensioner**
- Möjlighet att boka biljetter för en specifik film.
- Länk till att läsa eller skriva recensioner för filmer.

### 4. **Footer**
- Kontaktinformation (adress, e-post och telefonnummer).
- Länkar till sociala medier (Instagram, Facebook, TikTok).
- Möjlighet att prenumerera på nyhetsbrev.

### 5. **Responsiv Design**
- Designen är anpassad för olika skärmstorlekar och enheter.

## Teknologier

- **Frontend**: HTML, CSS, EJS (för dynamiska vyer).
- **Backend**: Node.js, Express.js.
- **Övrigt**: Statiska resurser som bilder, ikoner och videor.

## Installation

1. Klona detta repository:
   ```bash
   git clone https://github.com/ditt-repo/kino-italy-api.git
   ```
2. Navigera till projektmappen:
   ```bash
   cd kino-italy-api
   ```
3. Installera beroenden:
   ```bash
   npm install
   ```
4. Starta servern:
   ```bash
   npm start
   ```
5. Öppna applikationen i webbläsaren på `http://localhost:5080`.

 