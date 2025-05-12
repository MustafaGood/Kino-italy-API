// routes/bookings.js - Hanterar alla bokningsrelaterade funktioner

const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Skapa en ny bokning
// Endpoint: POST /
router.post('/', async (req, res) => {
  try {
    // Hämta all bokningsdata från förfrågan
    const { movieId, screeningId, totalSeats, firstName, lastName, email, phone, specialRequests } = req.body;
    
    // Beräkna totalpris (100 kr per plats)
    const pricePerSeat = 100; // SEK per plats
    const totalPrice = totalSeats * pricePerSeat;

    // Skapa ny bokning med all data
    const booking = new Booking({
      // Om användaren är inloggad, använd deras ID, annars null
      user: req.user ? req.user._id : null,
      movie: movieId,          // Filmen som bokas
      screening: screeningId,  // Visningstid
      totalSeats,              // Antal platser
      totalPrice,              // Beräknat totalpris
      firstName,               // Bokarens förnamn
      lastName,                // Bokarens efternamn
      email,                   // Bokarens e-post
      phone,                   // Bokarens telefonnummer
      specialRequests,         // Eventuella särskilda önskemål
      paymentStatus: 'pending' // Sätter betalningsstatus till väntande
    });

    // Spara bokningen i databasen
    await booking.save();
    
    // Omdirigera till betalning istället för att bara returnera bokningsobjektet
    res.status(201).json({ 
      booking, 
      redirectUrl: `/payment/${booking._id}` 
    });
  } catch (error) {
    console.error('Bokningsfel:', error);
    res.status(400).json({ error: 'Kunde inte skapa bokningen.', details: error.message });
  }
});

// Hämta användarens bokningar
// Endpoint: GET /my-bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    // Hitta alla bokningar för den inloggade användaren
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // Sortera efter datum (nyast först)
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte hämta bokningar.' });
  }
});

// Avboka en bokning
// Endpoint: PATCH /:id/cancel
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    // Hitta bokningen och kontrollera att den tillhör användaren
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    
    // Om bokningen inte hittas
    if (!booking) {
      return res.status(404).json({ error: 'Bokning hittades inte.' });
    }

    // Om bokningen redan är avbokad
    if (booking.paymentStatus === 'refunded') {
      return res.status(400).json({ error: 'Bokningen är redan avbokad.' });
    }

    // Markera bokningen som avbokad/återbetald
    booking.paymentStatus = 'refunded';
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte avboka.' });
  }
});

// Hämta alla bokningar (endast för administratörer)
// Endpoint: GET /all
router.get('/all', auth, async (req, res) => {
  try {
    // Kontrollera att användaren är administratör
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Endast administratörer har behörighet.' });
    }
    // Hämta alla bokningar sorterade efter datum
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte hämta bokningar.' });
  }
});

// Ta bort en bokning (endast för administratörer)
// Endpoint: DELETE /:id
router.delete('/:id', auth, async (req, res) => {
  try {
    // Kontrollera att användaren är administratör
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Endast administratörer har behörighet.' });
    }
    // Hitta och ta bort bokningen
    const result = await Booking.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Bokning hittades inte.' });
    }
    res.json({ message: 'Bokning borttagen.' });
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte ta bort bokningen.' });
  }
});

// Ändra en bokning (endast för administratörer)
// Endpoint: PUT /:id
router.put('/:id', auth, async (req, res) => {
  try {
    // Kontrollera att användaren är administratör
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Endast administratörer har behörighet.' });
    }
    // Hitta och uppdatera bokningen
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Bokning hittades inte.' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte uppdatera bokningen.' });
  }
});

module.exports = router;