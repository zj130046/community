import pool from "../../../../../lib/db";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

interface Params {
  params: {
    articleId: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { articleId } = await params;
  try {
    const result = await pool.query("SELECT * FROM articles WHERE slug = $1", [
      articleId,
    ]);
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: "Article not found" }), {
        status: 404,
      });
    }
    const article = result.rows[0];
    // 解析Markdown内容
    const contentHtml = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(article.content);
    // 更新article对象的content字段为解析后的HTML
    article.content = contentHtml.toString();
    return new Response(JSON.stringify(article), { status: 200 });
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
