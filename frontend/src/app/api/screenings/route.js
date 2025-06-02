import { NextResponse } from 'next/server';

function filterScreeningsWithinDays(screenings, days) {
  const today = new Date();
  const lastFilterDay = new Date();
  lastFilterDay.setDate(today.getDate() + days);
  lastFilterDay.setHours(23, 59, 59, 999);

  if (days === 0 || screenings.length === 0) return null;

  return screenings
    .filter(item => {
      const screeningDate = new Date(item.attributes.start_time);
      return screeningDate >= today && screeningDate <= lastFilterDay;
    })
    .sort((a, b) => new Date(a.attributes.start_time) - new Date(b.attributes.start_time))
    .slice(0, 10);
}

// Default to 5 days to enable static generation
const DEFAULT_DAYS = 5;

export async function GET() {
  try {
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie');
    if (!response.ok) {
      return NextResponse.json({ message: 'Något gick fel! Försök igen' }, { status: 500 });
    }
    const screenings = (await response.json()).data;
    const filtered = filterScreeningsWithinDays(screenings, DEFAULT_DAYS);
    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Misslyckades med att hämta visningar:', error);
    return NextResponse.json({ message: 'Något gick fel! Försök igen' }, { status: 500 });
  }
}

// Add this configuration to specify that this route should be statically generated
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour 