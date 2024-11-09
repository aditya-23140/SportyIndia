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
            SELECT v.url, v.CreatedAt 
            FROM videos v
            WHERE v.AthleteID = ?
            ORDER BY v.CreatedAt DESC
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
            const { coachName, coachSpecialization } = body;

            if (!coachName || !coachSpecialization) {
                return NextResponse.json({ error: "Coach name and specialization are required" }, { status: 400 });
            }

            const coachResult = await db.query(`
                SELECT CoachID FROM coach WHERE Name = ? AND Specialization = ?
            `, [coachName, coachSpecialization]);
            if (coachResult.length === 0) {
                return NextResponse.json({ error: "Coach with the given name and specialization not found" }, { status: 404 });
            }

            const coachIDArr = coachResult[0];
            const coachID = coachIDArr[0].CoachID;
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
        } else if (action === "be_coach") {
            const { specialization } = body;
            if (!specialization) {
                return NextResponse.json({ error: "Specialization is required" }, { status: 400 });
            }

            const [athleteData] = await db.query(`
                SELECT Name, ContactNum, Email FROM athlete WHERE AthleteID = ?
            `, [id]);

            if (athleteData.length === 0) {
                return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
            }

            const { Name, ContactNum, Email } = athleteData[0];

            const result = await db.query(`
                INSERT INTO coach (Name, Specialization, ContactNum, Email) 
                VALUES (?, ?, ?, ?)
            `, [Name, specialization, ContactNum, Email]);

            if (result.affectedRows === 0) {
                return NextResponse.json({ error: "Failed to add the athlete as a coach" }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: "Athlete is now a coach" }, { status: 200 });
        } else {
            const { sport, date, match, performance, photo } = body;

            if (!sport || !date || !match || !performance) {
                return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
            }

            const [sportData] = await db.query(`
                SELECT SportID FROM sport WHERE Name = ?
            `, [sport]);

            if (sportData.length === 0) {
                return NextResponse.json({ error: "Sport not found" }, { status: 404 });
            }

            const sportID = sportData[0].SportID;

            const [eventData] = await db.query(`
                SELECT EventID FROM event WHERE EventName = ? AND Date = ?
            `, [match, date]);

            if (eventData.length === 0) {
                return NextResponse.json({ error: "Event not found or event date does not match" }, { status: 404 });
            }

            const eventID = eventData[0].EventID;

            const [existingPlay] = await db.query(`
                SELECT * FROM plays WHERE AthleteID = ? AND SportID = ?
            `, [id, sportID]);

            if (existingPlay.length === 0) {
                await db.query(`
                    INSERT INTO plays (AthleteID, SportID) VALUES (?, ?)
                `, [id, sportID]);
            }

            const athleteImage = photo ? Buffer.from(photo, 'base64') : null;

            await db.query(`
                INSERT INTO participates (AthleteID, EventID, SportID, Performance, AthleteImage) 
                VALUES (?, ?, ?, ?, ?)
            `, [id, eventID, sportID, performance, athleteImage]);

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

        if (email || name) {
            const updateUserSql = `
                UPDATE users
                SET FullName = ?, Email = ?
                WHERE UserID = ?
            `;
            const updateUserValues = [name || '', email || '', id];
            const updateUserResult = await db.query(updateUserSql, updateUserValues);

            if (updateUserResult.affectedRows === 0) {
                console.error(`User with UserID ${id} not found or no changes made.`);
            }
        }

        return NextResponse.json({ success: true, message: "Athlete and user information updated successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
    }

    try {
        const db = await createConnection();
        const body = await request.json();
        const { action, videoUrl, coachName, achievement, sport, eventName } = body;

        if (action === "delete_video" && videoUrl) {
            await db.query("DELETE FROM videos WHERE AthleteID = ? AND url = ?", [id, videoUrl]);
            return NextResponse.json({ success: true, message: "Video deleted successfully" });
        } else if (action === "delete_coach" && coachName) {
            await db.query("DELETE FROM guides WHERE AthleteID = ? AND CoachID = (SELECT CoachID FROM coach WHERE Name = ?)", [id, coachName]);
            return NextResponse.json({ success: true, message: "Coach deleted successfully" });
        } else if (action === "delete_achievement" && achievement) {
            await db.query("DELETE FROM achievements WHERE AthleteID = ? AND Achievement = ?", [id, achievement]);
            return NextResponse.json({ success: true, message: "Achievement deleted successfully" });
        } else if (action === "delete_sport" && sport) {
            await db.query("DELETE FROM plays WHERE AthleteID = ? AND SportID = (SELECT SportID FROM sport WHERE Name = ?)", [id, sport.Name]);
            return NextResponse.json({ success: true, message: "Sport deleted successfully" });
        } else if (action === "delete_event" && eventName) {
            const [event] = await db.query("SELECT EventID FROM event WHERE EventName = ?", [eventName]);
            const eventID = event[0]?.EventID;
            if (eventID) {
                await db.query("DELETE FROM participates WHERE AthleteID = ? AND EventID = ?", [id, eventID]);
                return NextResponse.json({ success: true, message: "Event participation deleted successfully" });
            }
        }

        return NextResponse.json({ error: "Invalid action or missing data" }, { status: 400 });
    } catch (error) {
        console.error("Error deleting:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
