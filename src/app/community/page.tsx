"use client";

import { useEffect, useState } from "react";
import { Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import { IoMdPaperPlane } from "react-icons/io";
import dynamic from "next/dynamic";
import { useDisclosure, Button, Card } from "@heroui/react";
import useUserStore from "../../app/store/userStore";
import { MdLogin } from "react-icons/md";
import { PiUserCirclePlus } from "react-icons/pi";
import dayjs from "dayjs";
import { BiLike } from "react-icons/bi";
import DOMPurify from "dompurify";
import { LuMessageSquare } from "react-icons/lu";
import { Badge } from "@heroui/react";
import { Blog } from "../store/message";
const MyEditor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

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

  const router = useRouter();
  const { user, login } = useUserStore();
  const [content, setContent] = useState("");
  const [img, setImg] = useState("");
  const [file, setFile] = useState(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);

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
      setImg(URL.createObjectURL(file));
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

    if (file) {
      imageUrl = await uploadFile();
      if (!imageUrl) return;
    }

    if (!imageUrl) {
      alert("请选择文件");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("未找到 JWT，请重新登录");
      return;
    }
    const data = {
      content,
      img: imageUrl,
      avatarUrl: user?.avatarUrl,
      username: user?.username,
    };
    const response = await fetch("/api/blog/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    setContent("");
    setImg("");
    const result = await response.json();
    if (response.ok) {
      alert("文章提交成功");
      fetchBlogs();
    } else {
      console.error("文章提交失败:", result.message);
    }
  };

  const handleLike = async (id) => {
    console.log(id);
    try {
      const response = await fetch(`/api/like/${id}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("点赞失败");
      }
      fetchBlogs();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blog/all");
      if (!response.ok) {
        throw new Error("error");
      }
      const data = await response.json();
      setBlogs(data.blogs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const loginCard = (
    <Card className="h-[500px] shadow-lg w-full mb-[20px] dark:bg-gray-900 p-[22px]">
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
    <Card className="p-[16px] w-full shadow-lg flex items-center flex-col min-h-[200px] mb-[22px] dark:bg-gray-900 opacity-98">
      <MyEditor
        defaultContent={content}
        onChange={(html) => setContent(html)}
      />
      <label
        htmlFor="coverUpload"
        className="relative flex mb-[10px] justify-center items-center h-20 w-full border-2 border-dashed border-gray-300 rounded-md cursor-pointer"
      >
        <input
          type="file"
          id="coverUpload"
          className="absolute opacity-0 w-full h-full cursor-pointer"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
        />
        {img ? (
          <div className="w-full h-[76px]">
            <Image
              src={img}
              alt="封面预览"
              width={1000}
              height={76}
              className="h-full w-full object-cover rounded-md"
            />
          </div>
        ) : (
          <span className="text-gray-500">添加帖子封面</span>
        )}
      </label>
      <Button color="primary" onClick={handleSubmit}>
        <IoMdPaperPlane />
        发布帖子
      </Button>
    </Card>
  );

  return (
    <div className="flex max-w-[1150px] m-auto items-start justify-between">
      <Card className=" w-[100px] h-[300px] shadow-lg  dark:bg-gray-900 opacity-98 flex flex-col justify-center items-center"></Card>
      <div className="w-[730px]">
        {user?.username ? loggedInCard : loginCard}
        {blogs.map((blog, index) => (
          <Card
            key={index}
            className="cursor-pointer p-[24px] w-[730px] shadow-lg flex mb-[26px] dark:bg-gray-900 opacity-98"
          >
            <div className="flex justify-center flex-col">
              <div className="flex">
                <div>
                  <Image
                    src={blog.avatar_url}
                    alt="示例图片"
                    width={45}
                    height={45}
                    className="rounded-full"
                  />
                </div>
                <div className="flex flex-col ml-4">
                  <p className="text-[14px]">{blog.username}</p>
                  <p className="text-[#999AAA] text-[12px]">
                    {dayjs(blog.created_at).format("YYYY-MM-DD")}
                  </p>
                </div>
              </div>
              <div
                className="flex ml-14 mb-5 text-[16px]"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blog.content),
                }}
              ></div>

              <div className="w-full h-[180px] mb-[10px] pr-14 pl-14">
                <Image src={blog.img} alt="示例图片" width={900} height={180} />
              </div>
              <div className="flex justify-around">
                <Badge color="danger" content={blog.like_count} size="sm">
                  <BiLike
                    className="text-[22px]"
                    onClick={() => handleLike(blog.id)}
                  />
                </Badge>

                <Badge color="danger" content="5" size="sm">
                  <LuMessageSquare className="text-[22px]" />
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

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

      <div className="flex flex-col ">
        <Card className="w-[280px] shadow-lg h-[300px] mb-[20px] dark:bg-gray-900 opacity-98 p-[22px]">
          <div className="flex flex-col items-center">
            <div className="w-[100px] h-[100px] relative m-auto mb-[20px]">
              <Image
                src="/assets/22.jpg"
                alt="示例图片"
                width={100}
                height={100}
                className="w-[100px] h-[100px]"
              />
            </div>
            <p className="mb-[10px] text-[16px] ">博客投稿</p>
            <p className="mb-[20px] text-[12.6px] text-[#999999]">
              这里投稿您的文章,将会展示在博客首页
            </p>
            <Button color="success" onClick={() => router.push("/blog")}>
              发布文章
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
