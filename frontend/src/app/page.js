import ScreeningsList from './ScreeningsList';

export default function Home() {
  return (
    <div>
      <section className="bg-gray-100 py-10 mb-8 -mx-4 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Välkommen till Kino Italy</h1>
          <p className="text-xl mb-6">Upptäck filmupplevelsen i hjärtat av Italien</p>
          <a 
            href="/movies" 
            className="inline-block bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors"
          >
            Se alla filmer
          </a>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Kommande visningar</h2>
        <ScreeningsList days={5} />
      </section>
      
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Om Kino Italy</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <p className="mb-4">
              Kino Italy erbjuder den ultimata filmupplevelsen med bekväma säten,
              fantastisk ljud- och bildkvalitet, och ett brett utbud av filmer från
              hela världen.
            </p>
            <p>
              Besök oss idag och upplev magi på stor duk!
            </p>
          </div>
          <div className="flex-1">
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Biobild</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 