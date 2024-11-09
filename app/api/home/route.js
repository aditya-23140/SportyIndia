import { createConnection } from "@/lib/db";

export async function GET() {
    try {
      const connection = await createConnection();
  
      const postsQuery = "SELECT COUNT(*) AS count FROM videos";
      const athletesQuery = "SELECT COUNT(*) AS count FROM athlete";
      const eventsQuery = "SELECT COUNT(*) AS count FROM participates";
  
      const [posts] = await connection.query(postsQuery);
      const [athletes] = await connection.query(athletesQuery);
      const [events] = await connection.query(eventsQuery);
  
      const postsCount = posts[0]?.count || 0;
      const athletesCount = athletes[0]?.count || 0;
      const eventsCount = events[0]?.count || 0;
  
      return new Response(
        JSON.stringify({ postsCount, athletesCount, eventsCount }),
        { status: 200 }
      );
  
    } catch (error) {
      console.error("Error fetching stats:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }
  