"use client";

import { useDisclosure, Button, Card } from "@heroui/react";
import useUserStore from "../../app/store/userStore";
import Image from "next/image";
import { MdLogin } from "react-icons/md";
import { PiUserCirclePlus } from "react-icons/pi";
import CommentEditor from "../../components/commentEditor";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { Comment } from "../store/message";

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

  const { user, login } = useUserStore();
  const [comments, setComment] = useState<Comment[]>([]);

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
    <Card className="w-full shadow-lg h-[180px] mb-[20px] bg-[#74747414] dark:bg-gray-900 p-[22px]">
      <div className="flex flex-col items-center">
        <p className="mt-[20px] mb-[20px] text-[16.8px] text-[#B1B1B1]">
          请登陆后发表评论
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
    <div className="w-full flex gap-5 shadow-lg mb-[20px] dark:bg-gray-900 p-[22px]">
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

  return (
    <div className="flex max-w-[1150px] m-auto items-start justify-between">
      <Card className="w-full shadow-lg p-[15px] flex items-center flex-col h-[2000px] dark:bg-gray-900 opacity-98">
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
        <div className="p-[10px] w-full">
          <p className="text-[18px] text-[#1A1A1A] mb-[5px]">评论列表</p>
          {comments.map((comment, index) => (
            <div
              className="flex w-full justify-between border-b-1 pt-4 pb-4"
              key={comment.userId || index}
            >
              <div className="flex justify-center items-center">
                {comment.avatarurl ? (
                  <Image
                    src={comment.avatarurl}
                    alt="评论用户头像"
                    width={45}
                    height={45}
                    className="w-[45px] h-[45px] cursor-pointer rounded-full mr-[18px]"
                  />
                ) : (
                  <Image
                    src="/assets/20.jpg"
                    alt="默认头像"
                    width={45}
                    height={45}
                    className="w-[45px] h-[45px] cursor-pointer rounded-full mr-[18px]"
                  />
                )}
              </div>
              <div className="flex flex-col w-full items-start ">
                <p className="text-[15px] mb-[3px]">{comment.username}</p>
                <p className="text-[14px] mb-[8px] text-[#4E5358]">
                  {comment.content}
                </p>
                <p className="text-[14px] text-[#999999]">
                  {dayjs(comment.created_at).format("YYYY-MM-DD")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
