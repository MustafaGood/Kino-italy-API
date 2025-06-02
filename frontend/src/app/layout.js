import './globals.css';

export const metadata = {
  title: 'Kino Italy - Din Filmupplevelse',
  description: 'Boka biljetter till de senaste filmerna på Kino Italy',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body>
        <header>
          <nav>
            <div className="container mx-auto px-4 py-6 flex justify-between items-center">
              <a href="/" className="text-2xl font-bold">Kino Italy</a>
              <div className="flex space-x-4">
                <a href="/" className="hover:underline">Hem</a>
                <a href="/movies" className="hover:underline">Filmer</a>
                <a href="/contact" className="hover:underline">Kontakt</a>
                <a href="/about" className="hover:underline">Om oss</a>
                <a href="/login" className="hover:underline">Logga in</a>
              </div>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-100 mt-12">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center">© {new Date().getFullYear()} Kino Italy. Alla rättigheter förbehållna.</p>
          </div>
        </footer>
      </body>
    </html>
  );
} 