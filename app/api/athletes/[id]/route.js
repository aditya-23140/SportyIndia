import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;
  const connection = await createConnection();

  try {
    const [rows] = await connection.execute('SELECT * FROM athlete WHERE AthleteID = ?', [id]);
    return NextResponse.json(rows[0] || {}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch athlete' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { name, age, sport } = await req.json();
  const connection = await createConnection();

  try {
    await connection.execute('UPDATE athlete SET name = ?, age = ?, sport = ? WHERE id = ?', [name, age, sport, id]);
    return NextResponse.json({ message: 'Athlete updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update athlete' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  const connection = await createConnection();

  try {
    await connection.execute('DELETE FROM athlete WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Athlete deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete athlete' }, { status: 500 });
  }
}
