import { createConnection } from "@/lib/db";

export async function GET() {
  try {

    const connection = await createConnection();
  
    const eventsQuery = "SELECT EventID, EventName, Date, Venue, Description, EventTime FROM event";
    
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
