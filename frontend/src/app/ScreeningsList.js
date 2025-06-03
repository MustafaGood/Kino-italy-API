"use client"

import React, { useEffect, useState } from 'react';

export default function ScreeningsList({ days = 5, movieId = null }) {
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    // Use the static API endpoint without query parameters
    fetch('/api/screenings')
      .then(res => res.json())
      .then(data => {
        // Filter client-side if needed
        let filteredData = data || [];
        
        // Filter by movieId if provided
        if (movieId && filteredData.length > 0) {
          filteredData = filteredData.filter(screening => 
            screening.attributes.movie?.data?.id === movieId
          );
        }
        
        setScreenings(filteredData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching screenings:', err);
        setError('Kunde inte ladda visningar.');
        setLoading(false);
      });
  }, [days, movieId]);

  if (loading) return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
  );
  
  if (!screenings || screenings.length === 0) return (
    <div className="bg-gray-50 p-6 text-center rounded-md">
      <p className="text-gray-500">Inga visningar hittades för de kommande {days} dagarna.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b">
        <h3 className="font-semibold">Visningar de kommande {days} dagarna</h3>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {screenings.map((screening, idx) => {
          const movieTitle = screening.attributes.movie?.data?.attributes?.title || 'Okänd film';
          const screeningDate = new Date(screening.attributes.start_time);
          
          // Format the date in Swedish style
          const formattedDate = screeningDate.toLocaleDateString('sv-SE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          const formattedTime = screeningDate.toLocaleTimeString('sv-SE', {
            hour: '2-digit',
            minute: '2-digit'
          });
          
          return (
            <li key={idx} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <span className="font-semibold text-lg">{movieTitle}</span>
                  <p className="text-gray-600">
                    {formattedDate}, kl. {formattedTime}
                  </p>
                </div>
                <a 
                  href={`/book/${screening.id}`} 
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Boka platser
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 