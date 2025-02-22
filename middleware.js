// middleware.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// 身份验证中间件
export async function middleware(req) {
  const token = req.cookies.token; // 从 cookies 中获取 token

  if (!token) {
    return NextResponse.json({ message: "未授权访问" }, { status: 401 });
  }

  try {
    // 使用 JWT 进行验证
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 使用你的 JWT 密钥
    req.user = decoded; // 将解码后的用户信息附加到请求对象中
    return NextResponse.next(); // 验证通过，继续处理请求
  } catch (err) {
    return NextResponse.json(
      { message: "无效的或过期的Token" },
      { status: 401 }
    );
  }
}

// 配置需要中间件的路径（如：/api/articles/*）
export const config = {
  matcher: ["/api/articles/*"], // 所有 /api/articles/* 路径都会经过这个中间件
};
