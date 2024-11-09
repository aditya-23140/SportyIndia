import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { email } = params;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const connection = await createConnection();

    const [coachRows] = await connection.execute(`
      SELECT CoachID FROM coach WHERE Email = ?
    `, [email]);

    if (coachRows.length === 0) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    const coachID = coachRows[0].CoachID;

    const [guideRows] = await connection.execute(`
      SELECT AthleteID FROM guides WHERE CoachID = ?
    `, [coachID]);

    if (guideRows.length === 0) {
      return NextResponse.json({ players: [] });
    }

    const athleteIDs = guideRows.map(row => row.AthleteID);

    const [playerRows] = await connection.execute(`
      SELECT 
        p.SportID, 
        sp.Name AS SportName,
        p.AthleteID, 
        p.Position, 
        p.Performance, 
        a.Name AS AthleteName, 
        a.DOB, 
        a.Gender, 
        a.ContactNum, 
        a.Email AS AthleteEmail, 
        a.Address
      FROM athlete a
      LEFT JOIN positions p ON a.AthleteID = p.AthleteID
      LEFT JOIN sport sp ON p.SportID = sp.SportID
      WHERE a.AthleteID IN (${athleteIDs.map(() => '?').join(', ')})
    `, athleteIDs);

    const players = playerRows.map(player => {
      const dob = new Date(player.DOB);
      const age = new Date().getFullYear() - dob.getFullYear();
      const monthDifference = new Date().getMonth() - dob.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && new Date().getDate() < dob.getDate())) {
        return { ...player, age: age - 1 };
      }
      return { ...player, age };
    });

    const finalPlayers = players.map(player => {
      return {
        AthleteID: player.AthleteID,
        AthleteName: player.AthleteName,
        SportName: player.SportName,
        Age: player.age,
        Gender: player.Gender,
        ContactNum: player.ContactNum,
        AthleteEmail: player.AthleteEmail,
        Address: player.Address,
        Position: player.Position || [],
        Performance: player.Performance || [],
      };
    });

    return NextResponse.json({ players: finalPlayers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
