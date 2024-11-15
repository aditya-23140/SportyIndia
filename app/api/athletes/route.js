import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const connection = await createConnection();

  try {
    const [rows] = await connection.execute(`SELECT athlete.*, GROUP_CONCAT(sport.Name) AS sports
      FROM athlete
      LEFT JOIN plays ON athlete.AthleteID = plays.AthleteID
      LEFT JOIN sport ON plays.SportID = sport.SportID
      GROUP BY athlete.AthleteID`);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch athlete' }, { status: 500 });
  }
}

export async function POST(req) {
  const { name, age, sport } = await req.json();
  const connection = await createConnection();

  try {
    await connection.execute('INSERT INTO athlete (name, age, sport) VALUES (?, ?, ?)', [name, age, sport]);
    return NextResponse.json({ message: 'Athlete created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create athlete' }, { status: 500 });
  }
}
