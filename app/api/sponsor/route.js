// app/api/sponsor/route.js

import { createConnection } from "@/lib/db.js";
import { access } from "fs";
import { NextResponse } from "next/server";

// Handle GET request to fetch sponsor and their sponsored items
export async function GET(req) {
  try {
    const db = await createConnection();
    const sponsorLoginInfo = req.headers.get('Authorization');
    const sponsorId = sponsorLoginInfo ? JSON.parse(sponsorLoginInfo).id : null;

    if (!sponsorId) {
      return NextResponse.json({ message: "Sponsor not found or not logged in" }, { status: 404 });
    }

    const sponsorSql = "SELECT * FROM sponsor WHERE id = ?";
    const [sponsor] = await db.query(sponsorSql, [sponsorId]);

    if (!sponsor.length) {
      return NextResponse.json({ message: "Sponsor not found" }, { status: 404 });
    }

    const sponsoredItemsSql = `
      SELECT s.name, s.email, se.funding_type, se.type_id, se.sponsor_amount
      FROM sponsor s
      JOIN fundings se ON s.id = se.sponsor_id
      WHERE s.id = ?
    `;
    const [sponsoredItems] = await db.query(sponsoredItemsSql, [sponsorId]);

    const itemsWithDetails = await Promise.all(sponsoredItems.map(async (item) => {
      let details = {};
      switch (item.funding_type) {
        case "athlete":
          const athleteSql = "SELECT * FROM athlete WHERE AthleteID = ?";
          const [athlete] = await db.query(athleteSql, [item.type_id]);
          details = athlete.length ? athlete[0] : { message: "Athlete not found" };
          break;

        case "coach":
          const coachSql = "SELECT * FROM coach WHERE CoachID = ?";
          const [coach] = await db.query(coachSql, [item.type_id]);
          details = coach.length ? coach[0] : { message: "Coach not found" };
          break;

        case "event":
          const eventSql = "SELECT * FROM event WHERE EventID = ?";
          const [event] = await db.query(eventSql, [item.type_id]);
          details = event.length ? event[0] : { message: "Event not found" };
          break;

        default:
          details = { message: "Unknown funding type" };
          break;
      }

      return { ...item, details };
    }));

    return NextResponse.json({ sponsor: sponsor[0], sponsoredItems: itemsWithDetails }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error fetching sponsor data", error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
    try {
    const db = await createConnection();
    const sponsorLoginInfo = req.headers.get('Authorization');
    const sponsorId = sponsorLoginInfo ? JSON.parse(sponsorLoginInfo).id : null;

    if (!sponsorId) {
      return NextResponse.json({ message: "Sponsor not found or not logged in" }, { status: 404 });
    }

    const { fundingType, typeId, sponsorAmount ,sponsorMessage} = await req.json();

    if (!fundingType || !typeId || !sponsorAmount) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const validFundingTypes = ["athlete", "coach", "event"];
    if (!validFundingTypes.includes(fundingType)) {
      return NextResponse.json({ message: "Invalid funding type" }, { status: 400 });
    }

    const insertSponsorshipSql = `
      INSERT INTO fundings (sponsor_id, funding_type, type_id, sponsor_amount,sponsor_message)
      VALUES (?, ?, ?, ?,?)
    `;
    
    await db.query(insertSponsorshipSql, [sponsorId, fundingType, typeId, sponsorAmount,sponsorMessage]);

    return NextResponse.json({ message: "Sponsorship added successfully" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error adding sponsorship", error: error.message }, { status: 500 });
  }
}
