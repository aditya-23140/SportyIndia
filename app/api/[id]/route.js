import { createConnection } from "@/lib/db.js";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
    }

    try {
        const db = await createConnection();

        const athleteSql = `
          SELECT a.AthleteID, a.Name, a.Email, a.ContactNum, a.Address, a.Achievements
          FROM athlete a
          WHERE a.AthleteID = ?
        `;
        const [athlete] = await db.query(athleteSql, [id]);

        const eventsSql = `
          SELECT e.EventName, e.Date, e.Venue, e.Description, p.performance, p.AthleteImage
          FROM participates p
          JOIN event e ON p.EventID = e.EventID
          WHERE p.AthleteID = ?
        `;
        const [events] = await db.query(eventsSql, [id]);

        const sportsSql = `
          SELECT s.SportID, s.Name, s.Category
          FROM plays p
          JOIN sport s ON p.SportID = s.SportID
          WHERE p.AthleteID = ?
        `;
        const [sports] = await db.query(sportsSql, [id]);

        const videosSql = `
          SELECT v.url, v.created_at
          FROM videos v
          WHERE v.AthleteID = ?
          ORDER BY v.created_at DESC
        `;
        const [videos] = await db.query(videosSql, [id]);

        if (athlete.length === 0) {
            return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            athlete: athlete[0],
            events: events,
            sports: sports,
            videos: videos
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
    }

    try {
        const db = await createConnection();
        const body = await request.json();
        const { action } = body;

        if (action === "add_video") {
            const { videoUrl } = body;
            if (!videoUrl) {
                return NextResponse.json({ error: "Video URL is required" }, { status: 400 });
            }

            await db.query(`
                INSERT INTO videos (AthleteID, url) VALUES (?, ?)
            `, [id, videoUrl]);

            return NextResponse.json({ success: true, message: "Video URL added successfully" }, { status: 200 });

        } else if (action === "update_data") {
            const { sport, date, match, performance, photo } = body;

            if (!sport || !date || !match || !performance) {
                return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
            }

            const [existingPlay] = await db.query(`
                SELECT * FROM plays WHERE AthleteID = ? AND SportID = (SELECT SportID FROM sport WHERE Name = ?)
            `, [id, sport]);

            if (existingPlay.length === 0) {
                const [sportData] = await db.query(`
                    SELECT SportID FROM sport WHERE Name = ?
                `, [sport]);

                if (sportData.length === 0) {
                    return NextResponse.json({ error: "Sport not found" }, { status: 404 });
                }

                const sportID = sportData[0].SportID;
                await db.query(`
                    INSERT INTO plays (AthleteID, SportID) VALUES (?, ?)
                `, [id, sportID]);
            }

            const [eventData] = await db.query(`
                SELECT EventID FROM event WHERE EventName = ? AND Date = ?
            `, [match, date]);

            if (eventData.length === 0) {
                return NextResponse.json({ error: "Event not found or event date does not match" }, { status: 404 });
            }

            const eventID = eventData[0].EventID;
            const athleteImage = photo ? Buffer.from(photo, 'base64') : null;

            await db.query(`
                INSERT INTO participates (AthleteID, EventID, performance, AthleteImage) 
                VALUES (?, ?, ?, ?)
            `, [id, eventID, performance, athleteImage]);

            return NextResponse.json({ success: true, message: "User data updated successfully" }, { status: 200 });

        } else {
            return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
