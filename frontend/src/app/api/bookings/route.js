import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/dbConnect'; // If you have a db util
// import Booking from '@/models/Booking'; // If you move your model

export async function POST(request) {
  try {
    // await dbConnect();
    const body = await request.json();
    // const booking = await Booking.create(body);
    // For now, just echo the body for structure
    return NextResponse.json({ booking: body, redirectUrl: `/payment/mock-id` }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte skapa bokningen.', details: error.message }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    // await dbConnect();
    // const bookings = await Booking.find({ user: ... });
    // For now, just return a mock
    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte hämta bokningar.' }, { status: 500 });
  }
} 