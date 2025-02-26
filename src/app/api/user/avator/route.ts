import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// 获取 JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET 环境变量未设置");
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 处理头像上传的 POST 请求
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "未提供授权令牌" }, { status: 401 });
    }

    // 验证 JWT 令牌
    const decoded = jwt.verify(token, JWT_SECRET!);
    const userId = (decoded as { userId: string }).userId;

    // 获取上传的文件
    const formData = await request.formData();
    const avatar = formData.get("avatar");

    if (!avatar || !(avatar instanceof Blob)) {
      return NextResponse.json(
        { message: "请上传有效的图片文件" },
        { status: 400 }
      );
    }

    // 创建新的文件名，并保存文件到服务器
    const newFileName = uuidv4() + path.extname(avatar.name);
    const filePath = path.join(UPLOAD_DIR, newFileName);

    // 将文件内容保存到服务器
    const buffer = Buffer.from(await avatar.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // 更新数据库中的头像 URL
    const avatarUrl = `/uploads/${newFileName}`;

    // 更新用户表中的头像
    await pool.query("UPDATE users SET avatar_url = $1 WHERE id = $2", [
      avatarUrl,
      userId,
    ]);

    // 更新评论表中的头像（仅更新头像 URL，保持评论时间不变）
    await pool.query("UPDATE comments SET avatar_url = $1 WHERE user_id = $2", [
      avatarUrl,
      userId,
    ]);

    await pool.query("UPDATE blogs SET avatar_url = $1 WHERE user_id = $2", [
      avatarUrl,
      userId,
    ]);

    return NextResponse.json(
      { message: "头像更新成功", avatarUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("头像上传错误:", error);
    return NextResponse.json({ message: "服务器错误" }, { status: 500 });
  }
}
