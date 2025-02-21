"use client";

import { useDisclosure, Button, Card } from "@heroui/react";
import LoginModal from "../../components/LoginModal";
import RegisterModal from "../../components/RegisterModal";
import useUserStore from "../../app/store/userStore";
import Image from "next/image";
import { MdLogin } from "react-icons/md";
import { PiUserCirclePlus } from "react-icons/pi";
import CommentEditor from "../../components/commentEditor";
import { useEffect, useState } from "react";
import { IoMdPaperPlane } from "react-icons/io";
import { MdOutlineDataSaverOff } from "react-icons/md";
import { IoPricetagOutline } from "react-icons/io5";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { Select, SelectItem } from "@heroui/react";

export const category = [
  { key: "recommend", label: "推荐" },
  { key: "front", label: "前端" },
  { key: "backend", label: "后端" },
  { key: "ai", label: "AI" },
  { key: "note", label: "笔记" },
  { key: "android", label: "Android" },
  { key: "ios", label: "IOS" },
  { key: "database", label: "数据库" },
  { key: "data", label: "数据解构" },
  { key: "python", label: "python" },
  { key: "sentiment", label: "感悟" },
  { key: "daily", label: "日常" },
];

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

  const { user, login } = useUserStore();
  const [comments, setComment] = useState([]);

  const fetchComment = async () => {
    try {
      const response = await fetch("/api/comments");
      if (!response.ok) {
        throw new Error("error");
      }
      const data = await response.json();
      console.log(data);
      setComment(data.comments);
    } catch (error) {
      console.error(error);
    }
  };

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
        console.error("登录失败:", data.message);
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

  const loginCard = (
    <Card className="h-[500px] shadow-lg w-[870px] mb-[20px] dark:bg-gray-900 p-[22px] ">
      <div className="flex flex-col items-center m-auto">
        <p className="mt-[20px] mb-[20px] text-[16.8px] text-[#B1B1B1] text-center">
          你好,请先登录！
        </p>
        <div className="flex gap-2 mb-[20px] ">
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
    <div className="w-[870px] flex gap-5 shadow-lg mb-[20px] dark:bg-gray-900 p-[22px]">
      <div className="flex flex-col items-center">
        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt="示例图片"
            width={45}
            height={45}
            className="w-[45px] h-[45px] cursor-pointer rounded-full "
          />
        ) : (
          <Image
            src="/assets/20.jpg"
            alt="示例图片"
            width={45}
            height={45}
            className="w-[45px] h-[45px] cursor-pointer rounded-full "
          />
        )}

        <p className="mb-[20px]">{user?.username || "未登录"}</p>
      </div>
      <div className="w-full">
        <CommentEditor onCommentSubmit={fetchComment}></CommentEditor>
      </div>
    </div>
  );

  useEffect(() => {
    fetchComment();
  }, []);

  console.log(comments);

  return (
    <div className="flex max-w-[1170px] m-auto justify-between">
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
            startContent={<HiOutlineDocumentDuplicate />}
            scrollShadowProps={{
              isEnabled: false,
            }}
          >
            {category.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="mb-[14px]">
          <Select
            className="max-w-xs"
            label="标签"
            placeholder="请选择标签"
            startContent={<IoPricetagOutline />}
            scrollShadowProps={{
              isEnabled: false,
            }}
          >
            {category.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>
        </div>
        <Button color="success" className="text-[#fff] mb-[14px]">
          <MdOutlineDataSaverOff />
          保存草稿
        </Button>
        <Button color="primary">
          <IoMdPaperPlane />
          提交发布
        </Button>
      </Card>
    </div>
  );
}
