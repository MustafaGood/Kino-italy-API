// routes/auth.js - Hanterar användarautentisering och registrering

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Registrera ny användare
// Endpoint: POST /register
router.post('/register', async (req, res) => {
  try {
    // Hämta användardata från förfrågan
    const { name, email, password, confirmPassword } = req.body;
    
    // Kontrollera att alla obligatoriska fält är ifyllda
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Alla fält måste fyllas i (namn, e-post, lösenord).' });
    }

    // Kontrollera att lösenorden matchar
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Lösenorden matchar inte.' });
    }

    // Kontrollera om e-postadressen redan finns i databasen
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'E-postadressen är redan registrerad.' });
    }

    // Skapa ny användare och spara i databasen
    const user = new User({ 
      email,      // Användarens e-post
      password,   // Lösenord (kommer att krypteras automatiskt)
      name        // Användarens namn
    });
    await user.save();

    // Skapa en JWT-token som varar i 24 timmar
    // Token innehåller användarens ID för autentisering
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registreringsfel:', error);
    let details = error.message;
    if (error.errors) {
      details = Object.values(error.errors).map(e => e.message).join(', ');
    }
    res.status(400).json({ error: 'Kunde inte registrera användaren.', details });
  }
});

// Logga in användare
// Endpoint: POST /login
router.post('/login', async (req, res) => {
  try {
    // Hämta inloggningsuppgifter från förfrågan
    const { email, password } = req.body;
    
    // Hitta användaren i databasen
    const user = await User.findOne({ email });

    // Om användaren inte hittas, returnera felmeddelande
    if (!user) {
      console.error('Inloggningsfel: användare hittades inte:', email);
      return res.status(401).json({ error: 'Ogiltiga inloggningsuppgifter.' });
    }

    // Kontrollera om lösenordet är korrekt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.error('Inloggningsfel: fel lösenord för:', email);
      return res.status(401).json({ error: 'Ogiltiga inloggningsuppgifter.' });
    }

    // Skapa en JWT-token som varar i 24 timmar
    // Token innehåller användarens ID för autentisering
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ user, token });
  } catch (error) {
    console.error('Inloggningsfel:', error);
    res.status(400).json({ error: 'Kunde inte logga in.', details: error.message });
  }
});

// Hämta information om inloggad användare
// Endpoint: GET /me
// Använder auth-middleware för att säkerställa att användaren är inloggad
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;