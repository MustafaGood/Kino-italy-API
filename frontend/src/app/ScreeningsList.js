import React, { useEffect, useState } from 'react';

export default function ScreeningsList({ days = 5 }) {
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/screenings?days=${days}`)
      .then(res => res.json())
      .then(data => {
        setScreenings(data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Kunde inte ladda visningar.');
        setLoading(false);
      });
  }, [days]);

  if (loading) return <div>Laddar visningar...</div>;
  if (error) return <div>{error}</div>;
  if (!screenings || screenings.length === 0) return <div>Inga visningar hittades.</div>;

  return (
    <div>
      <h2>Kommande visningar</h2>
      <ul>
        {screenings.map((screening, idx) => (
          <li key={idx} style={{ marginBottom: 16 }}>
            <strong>{screening.attributes.movie?.data?.attributes?.title || 'Okänd film'}</strong><br />
            Starttid: {new Date(screening.attributes.start_time).toLocaleString()}<br />
            {/* Lägg till fler detaljer om du vill */}
          </li>
        ))}
      </ul>
    </div>
  );
} 