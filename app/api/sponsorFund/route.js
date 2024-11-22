import { createConnection } from "@/lib/db.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const db = await createConnection();

    const sponsorSql = "SELECT * FROM sponsor";
    const [sponsors] = await db.query(sponsorSql);

    if (!sponsors.length) {
      return NextResponse.json({ message: "No sponsors found" }, { status: 404 });
    }

    const itemsWithDetails = await Promise.all(sponsors.map(async (sponsor) => {
      const sponsoredItemsSql = `
        SELECT s.name, s.email, se.funding_type, se.type_id, se.sponsor_amount,se.id
        FROM sponsor s
        JOIN fundings se ON s.id = se.sponsor_id
        WHERE s.id = ?
      `;
      const [sponsoredItems] = await db.query(sponsoredItemsSql, [sponsor.id]);

      const itemsDetails = await Promise.all(sponsoredItems.map(async (item) => {
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

      return { sponsor: sponsor, sponsoredItems: itemsDetails };
    }));

    return NextResponse.json({ sponsors: itemsWithDetails }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error fetching sponsor data", error: error.message }, { status: 500 });
  }
}
