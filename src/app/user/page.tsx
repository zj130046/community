"use client";

import Image from "next/image";
import useUserStore from "../store/userStore";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { Blog, Comment } from "../store/message";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Button,
  Card,
  Tabs,
  Tab,
} from "@heroui/react";
import { redirect } from "next/navigation";
import { WiTime8 } from "react-icons/wi";
import DOMPurify from "dompurify";
import { BiLike } from "react-icons/bi";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 10MB

export const EyeSlashFilledIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.6083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
        fill="currentColor"
      />
      <path
        d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
        fill="currentColor"
      />
      <path
        d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
        fill="currentColor"
      />
      <path
        d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
        fill="currentColor"
      />
      <path
        d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const EyeFilledIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
        fill="currentColor"
      />
      <path
        d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default function About() {
  const { user, token } = useUserStore();
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRePasswordVisible, setIsRePasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selected, setSelected] = useState("评论");
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleRePasswordVisibility = () => {
    setIsRePasswordVisible(!isRePasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleAvatarChange = async () => {
    if (!newAvatar) return;
    if (newAvatar.size > MAX_FILE_SIZE) {
      console.error("文件大小超过限制，最大允许10MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", newAvatar);

    if (!token) {
      console.error("未找到用户令牌");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/avator", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "请求失败");
      }

      const data = await response.json();
      alert("头像更新成功");

      // 更新头像 URL
      if (data.avatarUrl) {
        useUserStore.setState({ user: { ...user, avatarUrl: data.avatarUrl } });
      }
    } catch (error: any) {
      console.error("更新头像时出错:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setNewAvatar(file);
    } else {
      console.error("请选择有效的图片文件");
    }
  };

  const handleRePassword = async () => {
    if (newPassword !== confirmPassword) {
      console.error("密码不一致");
      return;
    }
    if (!token) {
      return;
    }
    try {
      const response = await fetch("/api/user/repassword", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!response.ok) {
        throw new Error("error");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!token) {
      redirect("/");
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const commentResponse = await fetch(`/api/comments/${user?.userId}`);
        if (!commentResponse.ok) {
          throw new Error("获取评论失败");
        }
        const commentData = await commentResponse.json();
        setComments(commentData.comments);

        const blogResponse = await fetch(`/api/blog/${user?.userId}`);
        if (!blogResponse.ok) {
          throw new Error("获取帖子失败");
        }
        const blogData = await blogResponse.json();
        setBlogs(blogData.blogs);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="flex max-w-[1150px] m-auto justify-between flex-col">
      <Card className="w-full shadow-lg flex mb-[20px] h-[400px] dark:bg-gray-600 opacity-98">
        <div className="w-full h-[300px] gradient-bg relative"></div>
        <Image
          src={user?.avatarUrl || "/assets/20.jpg"}
          alt="用户头像"
          width={120}
          height={120}
          className="w-[120px] h-[120px] rounded-full cursor-pointer absolute left-10 bottom-20"
        />
        <div className="flex justify-around pt-[20px] pb-[10px]">
          <div className="text-[20px] text-[#4E5358] flex justify-center flex-col">
            <p>账号:{user?.username}</p>
            <p>ID:{user?.userId}</p>
          </div>
          <div className="text-[20px] text-[#4E5358] flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-2"
            />
            <Button
              size="sm"
              color="primary"
              onClick={handleAvatarChange}
              disabled={isLoading}
            >
              {isLoading ? "更新中..." : "更换头像"}
            </Button>
            <Button size="sm" color="success" onPress={onOpen}>
              重置密码
            </Button>
            <Modal
              isOpen={isOpen}
              placement="top-center"
              onOpenChange={onOpenChange}
            >
              <ModalContent className="w-[350px] pt-[20px]">
                {(onClose) => (
                  <form onSubmit={handleRePassword}>
                    <ModalBody>
                      <Input
                        name="password"
                        label="旧密码"
                        type={isPasswordVisible ? "text" : "password"}
                        variant="underlined"
                        onChange={(e) => setOldPassword(e.target.value)}
                        endContent={
                          <button
                            aria-label="toggle password visibility"
                            className="focus:outline-none"
                            type="button"
                            onClick={togglePasswordVisibility}
                          >
                            {isPasswordVisible ? (
                              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                      />
                      <Input
                        name="repassword"
                        label="新密码"
                        type={isRePasswordVisible ? "text" : "password"}
                        onChange={(e) => setNewPassword(e.target.value)}
                        variant="underlined"
                        endContent={
                          <button
                            aria-label="toggle re-password visibility"
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleRePasswordVisibility}
                          >
                            {isRePasswordVisible ? (
                              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                      />
                      <Input
                        name="confirmpassword"
                        label="确认新密码"
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        variant="underlined"
                        endContent={
                          <button
                            aria-label="toggle re-password visibility"
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {isConfirmPasswordVisible ? (
                              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="flat" onPress={onClose}>
                        取消
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => handleRePassword()}
                      >
                        确认
                      </Button>
                    </ModalFooter>
                  </form>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>
      </Card>
      <Card className="w-full min-h-[450px] shadow-lg flex items-center dark:bg-gray-600 opacity-98 pt-[15px] mb-[15px]">
        <Tabs
          aria-label="Tabs colors"
          selectedKey={selected}
          color="danger"
          radius="full"
          onSelectionChange={(e) => setSelected(e as string)}
        >
          <Tab key="评论" title="评论">
            <div>
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="min-h-[70px] flex mb-[10px] min-w-[300px] hover:shadow-lg p-[10px] hover:translate-x-[-4px] transition-all duration-[1000ms]"
                >
                  <div className="w-[60px] h-[60px] mr-[20px]">
                    <Image
                      src={user?.avatarUrl || "/assets/20.jpg"}
                      alt="示例图片"
                      width={60}
                      height={60}
                      className="w-[60px] h-[60px] rounded-full"
                    />
                  </div>

                  <div className="flex flex-col items-start justify-center mr-[60px]">
                    <div className="text-[#4E5358] text-[14px] hover:text-pink-500">
                      <div>{comment.content}</div>
                    </div>
                    <div className="text-[#B1B1B1] text-[12px] flex">
                      <WiTime8 className="h-[18px] mr-[2px]" />
                      <p>{dayjs(comment.created_at).format("YYYY-MM-DD")}</p>
                    </div>
                  </div>
                  <div className="flex justify-around items-center">
                    <BiLike className="text-[22px] text-[#999999] mr-2" />
                    <p className="text-[#999999]">{comment.like_count}</p>
                  </div>
                </div>
              ))}
            </div>
          </Tab>
          <Tab key="帖子" title="帖子">
            {blogs.map((blog, index) => (
              <Link
                href={`/blog/${blog.slug}`}
                key={index}
                className=" flex justify-between mb-[10px] min-w-[300px] max-w-[800px] hover:shadow-lg p-[10px] hover:translate-x-[-4px] transition-all duration-[1000ms]"
              >
                <div className="w-[60px] h-[60px] mr-[20px]">
                  <Image
                    src={user?.avatarUrl || "/assets/20.jpg"}
                    alt="示例图片"
                    width={60}
                    height={60}
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div className="flex flex-col items-start justify-center mr-[60px]">
                  <div className="text-[#4E5358] text-[14px] hover:text-pink-500">
                    <div
                      className="text-[#4E5358] text-[14px] hover:text-pink-500 max-w-[500px]"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          blog.content.length > 400
                            ? blog.content.slice(0, 400)
                            : blog.content
                        ),
                      }}
                    ></div>
                  </div>
                  <div className="text-[#B1B1B1] text-[12px] flex">
                    <WiTime8 className="h-[18px] mr-[2px]" />
                    <p>{dayjs(blog.created_at).format("YYYY-MM-DD")}</p>
                  </div>
                </div>
                <div className="flex justify-around items-center">
                  <BiLike className="text-[22px] text-[#999999] mr-2" />
                  <p className="text-[#999999]">{blog.like_count}</p>
                </div>
              </Link>
            ))}
          </Tab>
          <Tab key="文章" title="文章"></Tab>
        </Tabs>
      </Card>
    </div>
  );
}
