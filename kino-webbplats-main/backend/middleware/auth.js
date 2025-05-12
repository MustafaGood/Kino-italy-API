// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware för att kontrollera om användaren är inloggad
const auth = async (req, res, next) => {
  try {
    // Hämta token från Authorization-headern och ta bort 'Bearer ' från början
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Om ingen token finns, kasta ett fel
    if (!token) {
      throw new Error();
    }

    // Verifiera token med vår hemliga nyckel
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Hitta användaren i databasen med hjälp av användar-ID från token
    const user = await User.findOne({ _id: decoded.userId });

    // Om ingen användare hittas, kasta ett fel
    if (!user) {
      throw new Error();
    }

    // Lägg till användaren och token i request-objektet så att andra routes kan använda dem
    req.user = user;
    req.token = token;
    
    // Fortsätt till nästa middleware eller route
    next();
  } catch (error) {
    // Om något går fel, skicka ett felmeddelande om att användaren måste logga in
    res.status(401).json({ error: 'Vänligen logga in för att fortsätta.' });
  }
};

module.exports = auth;