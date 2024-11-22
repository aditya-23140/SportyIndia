import { createConnection } from "@/lib/db";

export async function GET() {
  try {
    const connection = await createConnection();

    const eventsQuery = "SELECT * FROM event";
    
    const [events] = await connection.query(eventsQuery);
    
    return new Response(
      JSON.stringify(events), 
      { status: 200 }
    ); 
  } catch (error) {
    console.error("Error fetching events:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const eventData = await request.json();
    const { coachEmail, EventName, Date, Venue, Description, EventTime, EventImage } = eventData;

    if (!EventName || !Date || !Venue || !Description || !EventTime || !EventImage || !coachEmail) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const connection = await createConnection();

    const insertEventQuery = `
      INSERT INTO event (EventName, Date, Venue, Description, EventTime, EventImage)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [eventResult] = await connection.query(insertEventQuery, [
      EventName, Date, Venue, Description, EventTime, EventImage
    ]);

    const eventId = eventResult.insertId;

    const insertOrganizesQuery = `
      INSERT INTO organizes (Email, EventID)
      VALUES (?, ?)
    `;

    await connection.query(insertOrganizesQuery, [
      coachEmail, eventId
    ]);

    return new Response(
      JSON.stringify({ message: "Event added successfully", eventId }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding event:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
