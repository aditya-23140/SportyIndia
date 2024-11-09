import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const sport = params.sportName;
  const connection = await createConnection();

  try {
    if (!sport) {
      return NextResponse.json({ error: "Sport is required" }, { status: 400 });
    }

    const [dietRows] = await connection.execute(
      'SELECT Data FROM sportDiet WHERE SportID = (SELECT SportID FROM sport WHERE Name = ?)',
      [sport]
    );

    const [fitnessRows] = await connection.execute(
      'SELECT Data FROM sportFitness WHERE SportID = (SELECT SportID FROM sport WHERE Name = ?)',
      [sport]
    );

    if (dietRows.length === 0 || fitnessRows.length === 0) {
      return NextResponse.json({ error: "No data found for the selected sport" }, { status: 404 });
    }

    const diet = dietRows[0].Data;
    const fitness = fitnessRows[0].Data;

    return NextResponse.json({ diet, fitness }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
