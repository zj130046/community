import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 获取 JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET 环境变量未设置");
}

// 处理重置密码的 POST 请求
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "未提供授权令牌" }, { status: 401 });
    }

    // 验证 JWT 令牌
    const decoded = jwt.verify(token, JWT_SECRET!);
    const userId = (decoded as { userId: string }).userId;

    // 获取请求体中的旧密码和新密码
    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "请提供旧密码和新密码" },
        { status: 400 }
      );
    }

    // 从数据库中获取用户的当前密码
    const { rows } = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "用户未找到" }, { status: 404 });
    }

    const currentPassword = rows[0].password;

    // 验证旧密码是否正确
    const isPasswordValid = await bcrypt.compare(oldPassword, currentPassword);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "旧密码不正确" }, { status: 401 });
    }

    // 对新密码进行哈希处理
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新数据库中的密码
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      userId,
    ]);

    return NextResponse.json({ message: "密码重置成功" }, { status: 200 });
  } catch (error) {
    console.error("密码重置错误:", error);
    return NextResponse.json({ message: "服务器错误" }, { status: 500 });
  }
}
