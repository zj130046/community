"use client";

import "../../styles/globals.css";
import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import { HiOutlineHome } from "react-icons/hi2";
import { BiListUl, BiLabel } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { FaRegMoon } from "react-icons/fa";
import { useState, useEffect } from "react";
import { GoChevronUp, GoChevronDown, GoSun } from "react-icons/go";
import Link from "next/link";
import useSearchStore from "./store/searchStore";
import useUserStore from "./store/userStore";
import { Button, useDisclosure, Input } from "@heroui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const LoginModal = dynamic(() => import("../components/LoginModal"), {
  ssr: false,
});

const RegisterModal = dynamic(() => import("../components/RegisterModal"), {
  ssr: false,
});

const CustomDropdown = dynamic(() => import("../components/customDropdown"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
  const [darkMode, setDarkMode] = useState(false);
  const { token, login } = useUserStore();
  const { fetchResults } = useSearchStore();
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleSearch = async () => {
    if (keyword.length === 0) {
      return;
    }
    router.push(`/search/${keyword}`);
    await fetchResults(keyword);
    setKeyword("");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute(
        "data-theme",
        darkMode ? "dark" : "light"
      );
      const bodyElement = document.body;
      if (darkMode) {
        bodyElement.style.backgroundImage = 'url("/assets/29.png")';
      } else {
        bodyElement.style.backgroundImage = 'url("/assets/7.png")';
      }
    }
  }, [darkMode]);

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
        alert("登录成功");
        login(data);
        onLoginOpenChange(false);
      } else {
        alert("登录失败:", data.message);
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
        alert("注册成功");
        onRegisterOpenChange(false);
      } else {
        console.error("注册失败:", data.message);
      }
    } catch (error) {
      console.error("注册请求出错:", error);
    }
  };

  return (
    <html lang="zh" data-theme={darkMode ? "dark" : "light"}>
      <body className="transition-colors duration-[1000ms] bg-white text-black dark:bg-gray-900 dark:text-white">
        <nav className="bg-[white] sticky top-0 flex justify-center h-[67px] dark:bg-gray-900 dark:text-white z-50">
          <div className="flex justify-center items-center mr-[100px]">
            <Image
              src="/assets/image.png"
              alt="示例图片"
              width={85}
              height={40}
              className="w-[85px] h-[40px]"
            />
          </div>
          <ul className="flex cursor-pointer mr-[260px]">
            <li className="flex justify-center items-center gap-1 text-[#4E5358]  hover:text-pink-500 p-4 rounded transition-colors duration-[3000ms]">
              <HiOutlineHome />
              <Link href="/">首页</Link>
            </li>
            <li className="flex justify-center items-center gap-1 text-[#4E5358]  hover:text-pink-500 p-4 rounded transition-colors duration-[3000ms]">
              <BiListUl />
              <Link href="/community">社区</Link>
            </li>
            <li className="flex justify-center items-center gap-1 text-[#4E5358]  hover:text-pink-500 p-4 rounded transition-colors duration-[3000ms]">
              <BiLabel />
              <Link href="/comment">留言板</Link>
            </li>
            <li className="flex justify-center items-center gap-1 text-[#4E5358]  hover:text-pink-500 p-4 rounded transition-colors duration-[3000ms] mr-[60px]">
              <AiOutlineUser />
              <Link href="/about">关于</Link>
            </li>
            <li className="flex justify-center items-center gap-1 text-[#4E5358]  hover:text-pink-500 p-4 rounded transition-colors duration-[3000ms]">
              <Input
                autoComplete="off"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                endContent={
                  <IoIosSearch
                    className="cursor-pointer  text-2xl text-default-400 flex-shrink-0"
                    onClick={handleSearch}
                  />
                }
              />
            </li>
          </ul>
          <ul className="flex gap-2">
            {token ? (
              <CustomDropdown></CustomDropdown>
            ) : (
              <>
                <li className="flex justify-center items-center">
                  <Button
                    className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                    radius="full"
                    size="sm"
                    onPress={onLoginOpen}
                  >
                    登录
                  </Button>
                </li>
                <li className="flex justify-center items-center">
                  <Button
                    className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                    radius="full"
                    size="sm"
                    onPress={onRegisterOpen}
                  >
                    注册
                  </Button>
                </li>
              </>
            )}
            <li className="flex justify-center items-center cursor-pointer text-[#4E5358] hover:text-pink-500 p-4 roundedcursor-pointer transition-colors duration-[3000ms]">
              {darkMode ? (
                <FaRegMoon className="text-2xl" onClick={toggleDarkMode} />
              ) : (
                <GoSun className="text-2xl" onClick={toggleDarkMode} />
              )}
            </li>
          </ul>
        </nav>
        <main className=" mt-[50px]">{children}</main>
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
        <div
          className="fixed bottom-[20%] right-[2%] bg-[#C8C8C866] dark:bg-gray-900 w-[40px] h-[40px] flex justify-center items-center rounded-[8px] cursor-pointer hover:text-pink-500"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <GoChevronUp className="text-2xl" />
        </div>
        <div className="fixed bottom-[15%] right-[2%] bg-[#C8C8C866] dark:bg-gray-900 w-[40px] h-[40px] flex justify-center items-center rounded-[8px] cursor-pointer hover:text-pink-500">
          {darkMode ? (
            <FaRegMoon className="text-2xl" onClick={toggleDarkMode} />
          ) : (
            <GoSun className="text-2xl" onClick={toggleDarkMode} />
          )}
        </div>
        <div
          className="fixed bottom-[10%] right-[2%] bg-[#C8C8C866] dark:bg-gray-900 w-[40px] h-[40px] flex justify-center items-center rounded-[8px] cursor-pointer hover:text-pink-500"
          onClick={() =>
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "smooth",
            })
          }
        >
          <GoChevronDown className="text-2xl" />
        </div>
        <div className="bg-[#FFF] h-[280px]"></div>
      </body>
    </html>
  );
}
