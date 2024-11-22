import { createConnection } from "@/lib/db.js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const db = await createConnection();
    const { email, password, action } = await request.json();

    let checkUserSql;
    let user;

    if (action === "athlete") {
      checkUserSql = "SELECT * FROM users WHERE Email = ? AND Password = ?";
      [user] = await db.query(checkUserSql, [email, password]);
    } else if (action === "sponsor") {
      checkUserSql = "SELECT * FROM sponsor WHERE email = ? AND password = ?";
      [user] = await db.query(checkUserSql, [email, password]);
    } else {
      return NextResponse.json({ success: false, message: "Invalid action." });
    }

    if (user.length > 0) {
      return NextResponse.json({
        success: true,
        user: user[0],
      });
    }

    checkUserSql = "SELECT * FROM admin WHERE email = ? AND password = ?";
    [user] = await db.query(checkUserSql, [email, password]);

    if (user.length > 0) {
      return NextResponse.json({
        success: true,
        user: user[0],
        role: 'admin',
      });
    } else {
      return NextResponse.json({ success: false, message: "Invalid email or password." });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}
