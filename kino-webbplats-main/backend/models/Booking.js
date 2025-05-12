// Booking.js - Modell för filmbokningar

const mongoose = require('mongoose');

// Definierar strukturen för en bokning i databasen
const bookingSchema = new mongoose.Schema({
  // Koppling till användaren som gjorde bokningen
  // required: false betyder att gäster kan boka utan att vara inloggade
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',           // Refererar till User-modellen
    required: false        // Krävs inte (gästbokning tillåts)
  },

  // Information om filmen som bokats
  movie: {
    type: String,
    required: true,        // Filmtitel måste anges
    trim: true            // Tar bort onödiga mellanslag
  },

  // Information om visningen/föreställningen
  screening: {
    type: String,
    required: true,        // Visningstid måste anges
    trim: true            // Tar bort onödiga mellanslag
  },

  // Förnamn på bokaren
  firstName: {
    type: String,
    required: true,        // Förnamn måste anges
    trim: true            // Tar bort onödiga mellanslag
  },

  // Antal bokade platser
  totalSeats: {
    type: Number,
    required: true,        // Antal platser måste anges
    min: 1,               // Minst 1 plats måste bokas
    max: 10               // Max 10 platser per bokning
  },

  // Totalt pris för bokningen
  totalPrice: {
    type: Number,
    required: true,        // Pris måste anges
    min: 0                // Priset kan inte vara negativt
  },

  // Telefonnummer till bokaren
  phone: {
    type: String,
    required: true,        // Telefonnummer måste anges
    trim: true,           // Tar bort onödiga mellanslag
    match: [/^[0-9+\-\s()]+$/, 'Vänligen ange ett giltigt telefonnummer'] // Validering av telefonnummerformat
  },

  // Efternamn på bokaren
  lastName: {
    type: String,
    required: true,        // Efternamn måste anges
    trim: true            // Tar bort onödiga mellanslag
  },

  // E-postadress till bokaren
  email: {
    type: String,
    required: true,        // E-postadress måste anges
    trim: true,           // Tar bort onödiga mellanslag
    lowercase: true,      // Konverterar till små bokstäver
    match: [/^\S+@\S+\.\S+$/, 'Vänligen ange en giltig e-postadress'] // Validering av e-postformat
  },

  // Valfria önskemål eller specialkrav
  specialRequests: {
    type: String,
    trim: true,           // Tar bort onödiga mellanslag
    maxlength: [500, 'Specialönskemål kan inte vara längre än 500 tecken'] // Maxlängd på specialönskemål
  },

  // Betalningsstatus för bokningen
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'    // Standardvärde är väntande betalning
  },

  // Betalningsmetod som användes
  paymentMethod: {
    type: String,
    enum: ['card', 'swish', 'other'],
    required: false       // Sätts när betalning genomförs
  },

  // Transaktions-ID för betalningen
  transactionId: {
    type: String,
    required: false       // Sätts när betalning genomförs
  },

  // Tidpunkt när betalningen genomfördes
  paidAt: {
    type: Date,
    required: false       // Sätts när betalning genomförs
  },

  // Tidpunkt när bokningen skapades
  createdAt: {
    type: Date,
    default: Date.now     // Sätts automatiskt till nuvarande tidpunkt
  }
});

// Exporterar bokningsmodellen så den kan användas i andra delar av applikationen
module.exports = mongoose.model('Booking', bookingSchema);