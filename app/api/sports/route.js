import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const connection = await createConnection();

  try {
    const [rows] = await connection.execute('SELECT * FROM sport');
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sports' }, { status: 500 });
  }
}

export async function POST(req) {
  const { name, category } = await req.json();
  const connection = await createConnection();

  try {
    await connection.execute('INSERT INTO sport (name, category) VALUES (?, ?)', [name, category]);
    return NextResponse.json({ message: 'Sport created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create sport' }, { status: 500 });
  }
}
