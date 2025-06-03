import React from 'react';

// This would be replaced with actual data fetching
const dummyMovies = [
  { id: 1, title: 'Den Italienska Drömmen', image: '/placeholder.jpg', rating: '4.5/5' },
  { id: 2, title: 'Roma', image: '/placeholder.jpg', rating: '4.8/5' },
  { id: 3, title: 'La Dolce Vita', image: '/placeholder.jpg', rating: '4.7/5' },
  { id: 4, title: 'Cinema Paradiso', image: '/placeholder.jpg', rating: '4.9/5' },
  { id: 5, title: 'Il Postino', image: '/placeholder.jpg', rating: '4.3/5' },
  { id: 6, title: 'Malèna', image: '/placeholder.jpg', rating: '4.2/5' },
];

export default function Movies() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Våra Filmer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyMovies.map(movie => (
          <div key={movie.id} className="border rounded-lg overflow-hidden shadow-md">
            <div className="bg-gray-200 h-64 flex items-center justify-center">
              <span className="text-gray-500">Filmbild</span>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
              <div className="flex justify-between items-center">
                <span className="text-yellow-500">{movie.rating}</span>
                <a 
                  href={`/movies/${movie.id}`}
                  className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700"
                >
                  Läs mer
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 