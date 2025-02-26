"use client";

import { Button, Card, Select, SelectItem, Input } from "@heroui/react";

import { useDisclosure } from "@heroui/react";

import useUserStore from "../../app/store/userStore";
import { PiUserCirclePlus } from "react-icons/pi";
import { IoMdPaperPlane } from "react-icons/io";
import { MdOutlineDataSaverOff, MdLogin } from "react-icons/md";
import { IoPricetagOutline } from "react-icons/io5";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import MyEditor from "@/components/editor";
import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { categories } from "../store/message";

const LoginModal = dynamic(() => import("../../components/LoginModal"), {
  ssr: false,
});

const RegisterModal = dynamic(() => import("../../components/RegisterModal"), {
  ssr: false,
});

export default function About() {
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onOpenChange: onLoginOpenChange,
  } = useDisclosure();
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onOpenChange: onRegisterOpenChange,
  } = useDisclosure();
  const [isSubmitted, setIsSubmitted] = useState(false); // 标记文章是否已提交
  const { user, login, token } = useUserStore();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [img, setImg] = useState("");
  const [file, setFile] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObj),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("登录成功:", data);
        login(data);
        onLoginOpenChange(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("登录请求出错:", error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });

    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObj),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("注册成功:", data);
        onRegisterOpenChange(false);
      } else {
        console.error("注册失败:", data.message);
      }
    } catch (error) {
      console.error("注册请求出错:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setImg(URL.createObjectURL(file)); // 预览图片
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert("请先选择文件");
      return null;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        return result.url; // 返回文件 URL
      } else {
        console.error("文件上传失败:", result.message);
        return null;
      }
    } catch (error) {
      console.error("文件上传出错:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    let imageUrl = img;
    // 如果用户上传了新文件，则上传文件并获取新的 URL
    if (file) {
      imageUrl = await uploadFile();
      if (!imageUrl) return;
    }
    // 如果既没有新文件，也没有已有图片 URL，提示用户选择文件
    if (!imageUrl) {
      alert("请选择图片");
      return;
    }
    if (!token) {
      console.error("未找到 JWT，请重新登录");
      return;
    }
    // 提交数据
    const data = { title, excerpt, content, category, tag, img: imageUrl };
    const response = await fetch("/api/articles/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      alert("文章提交成功");
      await deleteDraft();
      setIsSubmitted(true);
    } else {
      console.error("文章提交失败:", result.message);
    }
  };

  const deleteDraft = async () => {
    if (!token) {
      console.error("未找到 JWT，请重新登录");
      return;
    }
    try {
      const response = await fetch("/api/articles/draft", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        console.log("草稿删除成功:", result);
        setTitle("");
        setExcerpt("");
        setContent("");
        setCategory("");
        setTag("");
        setImg("");
      } else {
        console.error("草稿删除失败:", result.message);
      }
    } catch (error) {
      console.error("草稿删除出错:", error);
    }
  };

  const handleDraft = async () => {
    let imageUrl = img; // 使用当前图片 URL
    if (file) {
      imageUrl = await uploadFile();
      if (!imageUrl) return; // 如果上传失败，直接返回
    }

    if (!token) {
      console.error("未找到 JWT，请重新登录");
      return;
    }
    // 如果既没有新文件，也没有已有图片 URL，提示用户选择文件
    if (!imageUrl) {
      alert("请选择文件");
      return;
    }

    const data = { title, excerpt, content, category, tag, img: imageUrl };
    const response = await fetch("/api/articles/draft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      alert("草稿保存成功");
    } else {
      console.error("草稿保存失败:", result.message);
    }
  };

  const loginCard = (
    <Card className="h-[500px] shadow-lg w-[840px] mb-[20px] dark:bg-gray-900 p-[22px]">
      <div className="flex flex-col items-center m-auto">
        <p className="mt-[20px] mb-[20px] text-[16.8px] text-[#B1B1B1] text-center">
          你好,请先登录！
        </p>
        <div className="flex gap-2 mb-[20px]">
          <li className="flex justify-center items-center">
            <Button
              radius="full"
              size="sm"
              color="primary"
              onPress={onLoginOpen}
            >
              <MdLogin className="mr-[-4px]" />
              <p>登录</p>
            </Button>
          </li>
          <li className="flex justify-center items-center">
            <Button
              radius="full"
              size="sm"
              color="success"
              onPress={onRegisterOpen}
            >
              <PiUserCirclePlus className="mr-[-4px]" />
              <p>注册</p>
            </Button>
          </li>
        </div>
      </div>
    </Card>
  );

  const loggedInCard = (
    <Card className="min-h-[500px] w-[840px] flex gap-5 shadow-lg mb-[20px] dark:bg-gray-900 p-[22px]">
      <Input
        name="title"
        label="标题"
        value={title}
        variant="underlined"
        autoComplete="off"
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        name="excerpt"
        label="摘要"
        value={excerpt}
        variant="underlined"
        autoComplete="off"
        onChange={(e) => setExcerpt(e.target.value)}
      />
      <MyEditor
        defaultContent={content}
        onChange={(html) => setContent(html)}
      />
      <label
        htmlFor="coverUpload"
        className="relative flex justify-center items-center h-32 w-full border-2 border-dashed border-gray-300 rounded-md cursor-pointer"
      >
        <input
          type="file"
          id="coverUpload"
          className="absolute opacity-0 w-full h-full cursor-pointer"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
        />
        {img ? (
          <Image
            src={img}
            alt="封面预览"
            fill
            className="h-full w-full object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-500">添加文章封面</span>
        )}
      </label>
    </Card>
  );

  const fetchDraft = async () => {
    try {
      if (!token) {
        console.error("未找到 JWT，请重新登录");
        return;
      }
      const response = await fetch("/api/articles/draft", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setTitle(result.title);
        setExcerpt(result.excerpt);
        setContent(result.content);
        setCategory(result.category);
        setTag(result.tag);
        setImg(result.img);
      }
    } catch (error) {
      console.error("获取草稿出错:", error);
    }
  };

  useEffect(() => {
    if (user?.username && !isSubmitted) {
      // 如果文章未提交，才获取草稿
      fetchDraft();
    }
  }, [user?.username, isSubmitted]);

  return (
    <div className="flex max-w-[1150px] m-auto justify-between">
      {user?.username ? loggedInCard : loginCard}
      <LoginModal
        isOpen={isLoginOpen}
        onOpenChange={onLoginOpenChange}
        onRegisterOpen={onRegisterOpen}
        onSubmit={handleLoginSubmit}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onOpenChange={onRegisterOpenChange}
        onLoginOpen={onLoginOpen}
        onSubmit={handleRegisterSubmit}
      />
      <Card className="w-[280px] text-[14px] h-[290px] p-[20px]">
        <div className="mb-[14px]">
          <Select
            className="max-w-xs"
            label="分类"
            placeholder="请选择分类"
            selectedKeys={[category]}
            onSelectionChange={(keys) => setCategory(Array.from(keys)[0])}
            startContent={<HiOutlineDocumentDuplicate />}
            scrollShadowProps={{
              isEnabled: false,
            }}
          >
            {categories.map((cat) => (
              <SelectItem key={cat.key}>{cat.label}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="mb-[14px]">
          <Input
            name="tag"
            label="标签"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            startContent={<IoPricetagOutline className="h-[20px]" />}
            autoComplete="off"
            placeholder="请输入标签"
          />
        </div>
        <Button
          color="success"
          className="text-[#fff] mb-[14px]"
          onClick={handleDraft}
        >
          <MdOutlineDataSaverOff />
          保存草稿
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          <IoMdPaperPlane />
          提交发布
        </Button>
      </Card>
    </div>
  );
}
