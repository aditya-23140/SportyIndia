import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const connection = await createConnection();

  try {
    const [rows] = await connection.execute(`SELECT 
    coach.*, 
    athlete.profilePicture, 
    athlete.AthleteID,
    GROUP_CONCAT(specialization.Specialization) AS Specialization
FROM 
    coach
LEFT JOIN 
    athlete ON coach.Name = athlete.Name
LEFT JOIN 
    specialization ON coach.CoachID = specialization.CoachID
GROUP BY 
    coach.CoachID, athlete.AthleteID;

    `);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coaches' }, { status: 500 });
  }
}

export async function POST(req) {
  const { name, experience, sport } = await req.json();
  const connection = await createConnection();

  try {
    await connection.execute('INSERT INTO coach (name, experience, sport) VALUES (?, ?, ?)', [name, experience, sport]);
    return NextResponse.json({ message: 'Coach created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create coach' }, { status: 500 });
  }
}
