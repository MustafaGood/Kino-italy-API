import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ user: body, token: 'mock-token' });
}

export async function GET(request) {
  return NextResponse.json({ user: null });
} 