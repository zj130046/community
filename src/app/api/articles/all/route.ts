import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET() {
  console.log("Received a GET request to /api/articles/all");
  try {
    const [articleResult, countResult, categoryCountResult, tagCountResult] =
      await Promise.all([
        pool.query("SELECT * FROM articles ORDER BY created_at DESC"),
        pool.query("SELECT COUNT(*) as total FROM articles"),
        pool.query(
          "SELECT COUNT(DISTINCT category) as categorytotal FROM articles",
        ),
        pool.query("SELECT COUNT(DISTINCT tag) as tagtotal FROM articles"),
      ]);
    const articles = articleResult.rows;
    const total = countResult.rows[0].total;
    const categoryTotal = categoryCountResult.rows[0].categorytotal;
    const tagTotal = tagCountResult.rows[0].tagtotal;
    return NextResponse.json({ articles, total, categoryTotal, tagTotal });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
