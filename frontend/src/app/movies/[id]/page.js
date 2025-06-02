import React from 'react';
import ScreeningsList from '../../ScreeningsList';

// This would be replaced with actual data fetching based on the movie ID
const dummyMovieDetails = {
  id: 1,
  title: 'Den Italienska Drömmen',
  description: 'En vacker berättelse om kärlek, passion och livet i Italien. Filmen följer Maria, en ung kvinna som flyttar till en liten by i Toscana och finner sitt livs kärlek. Men allt är inte som det verkar, och hon måste navigera genom kulturella skillnader och familjehemligheter.',
  director: 'Giuseppe Rossi',
  cast: ['Anna Magnani', 'Marcello Mastroianni', 'Sophia Loren'],
  duration: '128 min',
  genre: 'Drama, Romantik',
  rating: '4.5/5',
  releaseYear: '2023'
};

// Mock movie list - in a real app you would fetch this from an API
const dummyMovies = [
  { id: 1, title: 'Den Italienska Drömmen' },
  { id: 2, title: 'Roma' },
  { id: 3, title: 'La Dolce Vita' },
  { id: 4, title: 'Cinema Paradiso' },
  { id: 5, title: 'Il Postino' },
  { id: 6, title: 'Malèna' },
];

// This function is required for static site generation with dynamic routes
export function generateStaticParams() {
  // Return an array of objects with the id param
  return dummyMovies.map(movie => ({
    id: movie.id.toString(),
  }));
}

export default function MovieDetails({ params }) {
  const { id } = params;
  const movie = dummyMovieDetails; // In a real app, you'd fetch based on id
  
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/3">
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Filmbild</span>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          
          <div className="mb-4">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-semibold mr-2">
              {movie.rating}
            </span>
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-semibold">
              {movie.duration}
            </span>
          </div>
          
          <p className="mb-4 text-gray-700">{movie.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold">Regissör:</h3>
              <p>{movie.director}</p>
            </div>
            <div>
              <h3 className="font-semibold">Genre:</h3>
              <p>{movie.genre}</p>
            </div>
            <div>
              <h3 className="font-semibold">Skådespelare:</h3>
              <p>{movie.cast.join(', ')}</p>
            </div>
            <div>
              <h3 className="font-semibold">Utgivningsår:</h3>
              <p>{movie.releaseYear}</p>
            </div>
          </div>
          
          <a 
            href={`/book/${id}`}
            className="inline-block bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors"
          >
            Boka biljetter
          </a>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Kommande visningar för denna film</h2>
        <ScreeningsList days={7} movieId={parseInt(id)} />
      </div>
    </div>
  );
} 