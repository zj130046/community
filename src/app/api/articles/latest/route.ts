import pool from "../../../../lib/db";

export async function GET() {
  try {
    // 添加 is_published = true 条件来过滤已发布的文章，并限制结果为最新的 5 篇
    const result = await pool.query(
      "SELECT * FROM articles WHERE is_published = true ORDER BY created_at DESC LIMIT 5"
    );
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
