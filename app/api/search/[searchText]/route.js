import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function GET(req, { params }) {
  const { searchText } = params;
  const searchPattern = `%${searchText}%`; 

  let connection;
  try {
    connection = await createConnection();

    const athletesQuery = `
      SELECT 
        athlete.*, 
        GROUP_CONCAT(DISTINCT sport.name) AS sports
      FROM athlete
      LEFT JOIN plays ON athlete.AthleteID = plays.AthleteID
      LEFT JOIN sport ON plays.SportID = sport.SportID
      WHERE athlete.name LIKE ? OR sport.name LIKE ?
      GROUP BY athlete.AthleteID
    `;
    const coachesQuery = `
      SELECT 
        coach.*, 
        athlete.profilePicture, 
        athlete.AthleteID,
        GROUP_CONCAT(DISTINCT specialization.Specialization) AS Specializations
      FROM coach
      LEFT JOIN athlete ON coach.Name = athlete.Name
      LEFT JOIN specialization ON coach.CoachID = specialization.CoachID
      WHERE coach.Name LIKE ? OR specialization.Specialization LIKE ?
      GROUP BY coach.CoachID, athlete.AthleteID
    `;

    const sportsQuery = `
      SELECT * 
      FROM sport 
      WHERE name LIKE ?
    `;
    const [athletes, coaches, sports] = await Promise.all([
      connection.execute(athletesQuery, [searchPattern, searchPattern]),
      connection.execute(coachesQuery, [searchPattern, searchPattern]),
      connection.execute(sportsQuery, [searchPattern]),
    ]);

    return NextResponse.json({
      athletes: athletes[0],
      coaches: coaches[0],
      sports: sports[0],
    });

  } catch (error) {
    console.error("Error during search:", error);
    return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
  } finally {
    if (connection) {
      connection.end();
    }
  }
}
