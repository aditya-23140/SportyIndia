import { createConnection } from "@/lib/db.js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const db = await createConnection();
    const { email, fullName, password } = await request.json();

    const checkUserSql = "SELECT * FROM users WHERE Email = ?";
    const [existingUser] = await db.query(checkUserSql, [email]);

    if (existingUser.length > 0) {
      return NextResponse.json({ success: false, message: "User already exists." });
    }

    const insertUserSql = "INSERT INTO users (Email, FullName, Password) VALUES (?, ?, ?)";
    const [result] = await db.query(insertUserSql, [email, fullName, password]);

    const insertAthleteSql = `
      INSERT INTO athlete (Name, DOB, Gender, ContactNum, Email, Address) 
      VALUES (?, NULL, NULL, NULL, ?, NULL)
    `;
    await db.query(insertAthleteSql, [fullName, email]);

    const newUserSql = "SELECT * FROM users WHERE UserID = ?";
    const [newUser] = await db.query(newUserSql, [result.insertId]);

    return NextResponse.json({
      success: true,
      message: "User registered successfully.",
      user: newUser[0], 
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}
