export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Sidan hittades inte</h1>
      <p className="text-xl mb-6">Vi kunde inte hitta sidan du letade efter.</p>
      <div className="p-4 bg-gray-100 rounded-lg mb-8 max-w-2xl text-left">
        <h2 className="font-semibold mb-2">Möjliga orsaker:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>URL:en kan vara felstavad</li>
          <li>Sidan kan ha flyttats eller tagits bort</li>
          <li>Next.js konfigurationen kan behöva justeras</li>
        </ul>
      </div>
      <a 
        href="/"
        className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
      >
        Gå till startsidan
      </a>
    </div>
  );
} 