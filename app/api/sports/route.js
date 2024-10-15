import { createConnection } from "@/lib/db.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await createConnection();
    const selectSportsSql = "SELECT * FROM sports";
    const [sports] = await db.query(selectSportsSql);
    
    return NextResponse.json(sports);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}

export async function POST(request) {
  try {
    const db = await createConnection();
    const payload = await request.json();

    const insertSportsSql = `
      INSERT INTO sports (name, rating, playerCount)
      VALUES (?, ?, ?);
    `;
    
    const result = await db.query(insertSportsSql, [payload.name, payload.rating, payload.playerCount]);

    return NextResponse.json({ result, success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}
