import React from 'react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Kontakta oss</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Besöksadress</h2>
          <p className="mb-4">
            Kino Italy<br />
            Via Cinema 123<br />
            12345 Roma<br />
            Italien
          </p>
          
          <h2 className="text-xl font-semibold mb-4 mt-8">Kontaktuppgifter</h2>
          <p className="mb-2">
            <strong>Telefon:</strong> +39 123 456 7890
          </p>
          <p className="mb-2">
            <strong>E-post:</strong> info@kinoitaly.com
          </p>
          <p className="mb-2">
            <strong>Öppettider:</strong> Alla dagar 10:00 - 22:00
          </p>
          
          <div className="mt-8 bg-gray-200 h-64 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Karta</span>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Skicka ett meddelande</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Namn
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-post
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Ämne
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Meddelande
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Skicka meddelande
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 