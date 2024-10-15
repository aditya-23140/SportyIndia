import { createConnection } from "@/lib/db.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const db = await createConnection();
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(',')[0] : req.ip || "Unknown IP";
    const formattedIp = ip === '::1' ? '127.0.0.1' : ip;
    const referrer = req.headers.get("referer") || "Direct Access";
    const accessedPage = req.nextUrl.pathname;

    const insertLogSql = `
      INSERT INTO logs (ip, referrer, accessed_page)
      VALUES (?, ?, ?);
    `;
    
    await db.query(insertLogSql, [formattedIp, referrer, accessedPage]);

    const selectLogsSql = "SELECT * FROM logs";
    const [posts] = await db.query(selectLogsSql);
    
    return NextResponse.json(posts);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}

