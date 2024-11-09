import { createConnection } from "@/lib/db.js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const db = await createConnection();
    const { email, password } = await request.json();

    const checkUserSql = "SELECT * FROM users WHERE Email = ? AND Password = ?";
    const [user] = await db.query(checkUserSql, [email, password]);
    console.log(user);
    console.log(user[0]);
    if (user.length > 0) {
      return NextResponse.json({
        success: true,
        user: user[0], 
      });
    } else {
      return NextResponse.json({ success: false, message: "Invalid email or password." });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}
