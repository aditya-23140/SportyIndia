import { createConnection } from "@/lib/db";

export async function GET() {
  try {
    const connection = await createConnection();
    const videosQuery = "SELECT * FROM videos";
    const [videos] = await connection.query(videosQuery);
    return new Response(
      JSON.stringify(videos),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching videos:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
