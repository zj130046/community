import pool from "@/lib/db"; // 假设你有一个数据库连接池

// 自动生成slug
function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  return `${slug}-${Date.now()}`; // 加上时间戳确保slug唯一
}

export async function POST(req: Request): Promise<Response> {
  try {
    // 读取请求体
    const body = await req.json();
    const { title, excerpt, content, category, tag, img } = body;

    // 检查必要字段
    if (!title || !excerpt || !content || !category || !tag) {
      return new Response(
        JSON.stringify({ message: "缺少必要字段" }),
        { status: 400 } // 使用 `Response` 对象的 `status` 设置响应状态码
      );
    }

    // 获取用户信息
    const user = { id: 1 }; // 这里是示例，实际应该从请求中提取用户信息

    const slug = generateSlug(title);

    // 执行数据库插入操作
    const result = await pool.query(
      `INSERT INTO articles (title, excerpt, content, slug, category, tag, img, user_id, created_at, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), false)
       RETURNING id;`,
      [title, excerpt, content, slug, category, tag, img, user.id]
    );

    // 返回成功响应
    return new Response(
      JSON.stringify({ message: "草稿已保存", articleId: result.rows[0].id }),
      { status: 200 }
    );
  } catch (error) {
    console.error("保存草稿失败:", error);
    return new Response(JSON.stringify({ message: "保存草稿失败" }), {
      status: 500,
    });
  }
}
