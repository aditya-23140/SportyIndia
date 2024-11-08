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
        SELECT a.AthleteID, a.Name, a.Email, a.ContactNum, a.Address,
           GROUP_CONCAT(DISTINCT c.Name) AS Coaches, 
           GROUP_CONCAT(DISTINCT ach.Achievement) AS Achievements
        FROM athlete a
        LEFT JOIN guides g ON a.AthleteID = g.AthleteID
        LEFT JOIN coach c ON g.CoachID = c.CoachID
        LEFT JOIN achievements ach ON a.AthleteID = ach.AthleteID
        WHERE a.AthleteID = ?
        GROUP BY a.AthleteID, a.Name, a.Email, a.ContactNum, a.Address;
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

        } else if (action === "add_coach") {
            const { coachName } = body;

            if (!coachName) {
                return NextResponse.json({ error: "Coach name is required" }, { status: 400 });
            }

            const coachResult = await db.query(`
                SELECT CoachID FROM coach WHERE Name = ?
            `, [coachName]);

            if (coachResult.length === 0 || !coachResult[0][0].CoachID) {
                return NextResponse.json({ error: "Coach not found or invalid CoachID" }, { status: 404 });
            }

            const coachID = coachResult[0][0].CoachID;

            if (!coachID) {
                return NextResponse.json({ error: "CoachID is invalid" }, { status: 400 });
            }

            await db.query(`
                INSERT INTO guides (AthleteID, CoachID) VALUES (?, ?)
            `, [id, coachID]);

            return NextResponse.json({ success: true, message: "Coach assigned to athlete successfully" }, { status: 200 });
        } else if (action === "add_achievement") {
            const { achievement } = body;
            if (!achievement) {
                return NextResponse.json({ error: "Achievement is required" }, { status: 400 });
            }

            await db.query(`
                INSERT INTO achievements (AthleteID, Achievement) VALUES (?, ?)
            `, [id, achievement]);

            return NextResponse.json({ success: true, message: "Achievement added successfully" }, { status: 200 });
        } else if (action === "add_sport") {
            const { sport } = body;

            if (!sport) {
                return NextResponse.json({ error: "Sport name is required" }, { status: 400 });
            }

            const [sportData] = await db.query(`
                SELECT SportID FROM sport WHERE Name = ?
            `, [sport]);

            if (sportData.length === 0) {
                return NextResponse.json({ error: "Sport not found" }, { status: 404 });
            }

            const sportID = sportData[0].SportID;

            const [existingPlay] = await db.query(`
                SELECT * FROM plays WHERE AthleteID = ? AND SportID = ?
            `, [id, sportID]);

            if (existingPlay.length > 0) {
                return NextResponse.json({ error: "Sport already added to athlete" }, { status: 400 });
            }

            await db.query(`
                INSERT INTO plays (AthleteID, SportID) VALUES (?, ?)
            `, [id, sportID]);

            return NextResponse.json({ success: true, message: "Sport added to athlete successfully" }, { status: 200 });
        } else {
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
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
    }

    try {
        const db = await createConnection();
        const body = await request.json();
        
        const { name, DOB, contactNum, email, address } = body;

        if (!name && !DOB && !contactNum && !email && !address) {
            return NextResponse.json({ error: "At least one field must be provided for update" }, { status: 400 });
        }

        const updates = [];
        const updateValues = [];

        if (name) {
            updates.push("Name = ?");
            updateValues.push(name);
        }

        if (DOB) {
            updates.push("DOB = ?");
            updateValues.push(DOB);
        }

        if (contactNum) {
            updates.push("ContactNum = ?");
            updateValues.push(contactNum);
        }

        if (email) {
            updates.push("Email = ?");
            updateValues.push(email);
        }

        if (address) {
            updates.push("Address = ?");
            updateValues.push(address);
        }

        updateValues.push(id);

        const updateSql = `
            UPDATE athlete
            SET ${updates.join(", ")}
            WHERE AthleteID = ?
        `;

        const result = await db.query(updateSql, updateValues);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Athlete not found or no changes made" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Athlete information updated successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
