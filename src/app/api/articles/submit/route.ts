import pool from "@/lib/db"; // 引入数据库连接池

// 自动生成slug
function generateSlug(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  return `${slug}-${Date.now()}`; // 加上时间戳确保slug唯一
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); // 读取请求体
    const { title, excerpt, content, category, tag, img } = body;

    // 检查必要字段
    if (!title || !excerpt || !content || !category || !tag) {
      return new Response(
        JSON.stringify({ message: "缺少必要字段" }),
        { status: 400 } // 使用 `Response` 对象的 `status` 设置响应状态码
      );
    }

    const slug = generateSlug(title);

    const result = await pool.query(
      `INSERT INTO articles (title, excerpt, content, slug, category, tag, img, user_id, created_at, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), true)
       RETURNING id;`,
      [title, excerpt, content, slug, category, tag, img, 1]
    );

    // 返回成功的响应
    return new Response(
      JSON.stringify({ message: "文章已发布", articleId: result.rows[0].id }),
      { status: 200 }
    );
  } catch (error) {
    console.error("发布文章失败:", error);
    return new Response(JSON.stringify({ message: "发布文章失败" }), {
      status: 500,
    });
  }
}
