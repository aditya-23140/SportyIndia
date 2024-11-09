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
      SELECT CoachID, Specialization FROM coach WHERE Email = ?
    `, [email]);

    if (coachRows.length === 0) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    const coachSpecializations = [];
    coachRows.forEach(coach => {
      coachSpecializations.push(...coach.Specialization.split(','));
    });

    const coachIDs = coachRows.map(coach => coach.CoachID);

    const [guideRows] = await connection.execute(`
      SELECT AthleteID FROM guides WHERE CoachID IN (${coachIDs.map(() => '?').join(', ')})
    `, coachIDs);

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
      AND sp.Name IN (${coachSpecializations.map(() => '?').join(', ')})
    `, [...athleteIDs, ...coachSpecializations]);

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


export async function PUT(request, { params }) {
  try {
    const { email } = params;
    const { position, performance,athleteID,SportName } = await request.json();

    if (!email || !athleteID || !SportName || position === undefined || performance === undefined) {
      return NextResponse.json({ error: 'Email, AthleteID, SportID, Position, and Performance are required' }, { status: 400 });
    }

    const connection = await createConnection();

    const [sportID] = await connection.execute(`SELECT SportID FROM sport WHERE Name = ?`,[SportName])
    const [coachRows] = await connection.execute(`
      SELECT CoachID FROM coach WHERE Email = ?
    `, [email]);

    if (coachRows.length === 0) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    const coachID = coachRows[0].CoachID;

    const [guideRows] = await connection.execute(`
      SELECT * FROM guides WHERE CoachID = ? AND AthleteID = ?
    `, [coachID, athleteID]);

    if (guideRows.length === 0) {
      return NextResponse.json({ error: 'Athlete is not associated with this coach' }, { status: 404 });
    }
    const [updateResult] = await connection.execute(`
      UPDATE positions 
      SET Position = ?, Performance = ? 
      WHERE AthleteID = ? AND SportID = ?
    `, [position, performance, athleteID, sportID[0].SportID]);

    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ error: 'No position found for the athlete in the specified sport' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Position and Performance updated successfully' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { email } = params;
    console.log(email);
    const {athleteID} = await request.json();

    console.log(athleteID);
    if (!email || !athleteID) {
      return NextResponse.json({ error: 'Email and AthleteID are required' }, { status: 400 });
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
      SELECT * FROM guides WHERE CoachID = ? AND AthleteID = ?
    `, [coachID, athleteID]);

    if (guideRows.length === 0) {
      return NextResponse.json({ error: 'Athlete is not associated with this coach' }, { status: 404 });
    }

    const [deleteGuideResult] = await connection.execute(`
      DELETE FROM guides WHERE CoachID = ? AND AthleteID = ?
    `, [coachID, athleteID]);

    const [deletePositionResult] = await connection.execute(`
      DELETE FROM positions WHERE AthleteID = ?
    `, [athleteID]);

    if (deleteGuideResult.affectedRows === 0 || deletePositionResult.affectedRows === 0) {
      return NextResponse.json({ error: 'Error removing athlete from database' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Athlete successfully removed from coach and positions' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 