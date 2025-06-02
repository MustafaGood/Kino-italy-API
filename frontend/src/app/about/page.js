import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Om Kino Italy</h1>
      
      <div className="mb-12">
        <div className="bg-gray-200 h-64 rounded-lg mb-6 flex items-center justify-center">
          <span className="text-gray-500">Biobild</span>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Vår historia</h2>
        <p className="mb-4">
          Kino Italy grundades 1982 av filmälskaren och entreprenören Giovanni Rossi. 
          Med en passion för italiensk film och ett brinnande intresse för att sprida 
          italiensk kultur, öppnade Giovanni sin första biosalong i centrala Rom.
        </p>
        <p className="mb-4">
          Under åren har Kino Italy vuxit från en ensam biosalong till ett nätverk av 
          biografer runt om i Italien, men alltid med samma kärnvärden: kvalitetsfilm, 
          bekväm upplevelse och äkta italiensk gästfrihet.
        </p>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Vår mission</h2>
        <p className="mb-4">
          På Kino Italy tror vi att film har makten att inspirera, utbilda och 
          transformera. Vår mission är att erbjuda högkvalitativa filmupplevelser 
          som både underhåller och berikar våra besökare.
        </p>
        <p className="mb-4">
          Vi är dedikerade till att:
        </p>
        <ul className="list-disc pl-8 mb-4 space-y-2">
          <li>Visa ett varierat utbud av filmer från hela världen, med särskilt fokus på italiensk film och kultur</li>
          <li>Erbjuda bekväma och moderna bioupplevelser</li>
          <li>Stödja lokala filmskapare och filmindustrin</li>
          <li>Skapa en välkomnande miljö för alla filmälskare</li>
        </ul>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Våra salonger</h2>
        <p className="mb-4">
          Alla våra salonger är utrustade med den senaste tekniken för ljud och bild, 
          samt bekväma fåtöljer för att ge dig den bästa filmupplevelsen.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 h-40 flex items-center justify-center">
              <span className="text-gray-500">Salong 1</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Salong Fellini</h3>
              <p className="text-gray-600">120 platser • THX-ljud</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 h-40 flex items-center justify-center">
              <span className="text-gray-500">Salong 2</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Salong Sophia</h3>
              <p className="text-gray-600">80 platser • Dolby Atmos</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 h-40 flex items-center justify-center">
              <span className="text-gray-500">Salong 3</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Salong Marcello</h3>
              <p className="text-gray-600">60 platser • Intim atmosfär</p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Kontakta oss</h2>
        <p className="mb-4">
          Har du frågor om Kino Italy, våra filmer eller något annat? 
          Tveka inte att <a href="/contact" className="text-blue-600 hover:underline">kontakta oss</a>.
        </p>
      </div>
    </div>
  );
} 