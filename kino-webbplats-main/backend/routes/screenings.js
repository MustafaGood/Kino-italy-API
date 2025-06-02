const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

function filterScreeningsWithinDays(screenings, days) {
  const today = new Date();
  const lastFilterDay = new Date();
  lastFilterDay.setDate(today.getDate() + days);
  lastFilterDay.setHours(23, 59, 59, 999);

  if (days == 0 || screenings.length === 0) return null;

  return screenings
    .filter(item => {
      const screeningDate = new Date(item.attributes.start_time);
      return screeningDate >= today && screeningDate <= lastFilterDay;
    })
    .sort((a, b) => new Date(a.attributes.start_time) - new Date(b.attributes.start_time))
    .slice(0, 10);
}

router.get('/', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 5;
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const screenings = (await response.json()).data;
    const filtered = filterScreeningsWithinDays(screenings, days);
    res.json(filtered);
  } catch (error) {
    console.error('Misslyckades med att hämta visningar:', error);
    res.status(500).json({ message: 'Något gick fel! Försök igen' });
  }
});

module.exports = router; 