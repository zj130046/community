import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "未上传文件" }, { status: 400 });
    }

    // 将文件保存到 public/uploads 目录
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `upload-${Date.now()}.${file.name.split(".").pop()}`; // 生成唯一文件名
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;
    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error("文件上传出错:", error);
    return NextResponse.json({ message: "文件上传失败" }, { status: 500 });
  }
}
