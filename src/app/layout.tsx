"use client";

import "../../styles/globals.css";
import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import { HiOutlineHome } from "react-icons/hi2";
import { BiListUl, BiLabel, BiBarChartAlt } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { FaRegMoon } from "react-icons/fa";
import { useState, useEffect } from "react";
import { GoChevronUp, GoChevronDown, GoSun } from "react-icons/go";
import Link from "next/link";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import useUserStore from "./store/userStore";
import CustomDropdown from "../components/customDropdown";
import { Button, useDisclosure } from "@heroui/react";

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

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    const bodyElement = document.body;
    if (darkMode) {
      bodyElement.style.backgroundImage = 'url("/assets/13.jpg")';
    } else {
      bodyElement.style.backgroundImage = 'url("/assets/7.png")';
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

  return (
    <html lang="zh" data-theme={darkMode ? "dark" : "light"}>
      <body className="transition-colors duration-[1000ms] bg-white text-black dark:bg-gray-900 dark:text-white">
        <nav className="bg-white/90 sticky top-0 flex justify-center h-[67px] dark:bg-gray-900 dark:text-white transition-colors duration-[3000ms] z-50">
          <div className="flex justify-around gap-1 items-center mr-[100px]">
            <Image src="/assets/1.png" alt="示例图片" width={50} height={28} />
            <Image
              src="/assets/image.png"
              alt="示例图片"
              width={50}
              height={28}
            />
          </div>
          <ul className="flex cursor-pointer mr-[280px]">
            <li className="flex justify-center items-center gap-1 text-[#4E5358]  hover:text-pink-500 p-4 rounded dark:hover:bg-gray-700 transition-colors duration-[3000ms]">
              <HiOutlineHome />
              <Link href="/">首页</Link>
            </li>
            <li className="flex justify-center items-center gap-1 text-[#4E5358]  hover:text-pink-500 p-4 rounded dark:hover:bg-gray-700 transition-colors duration-[3000ms]">
              <BiListUl />
              <Link href="/community">社区</Link>
            </li>
            <li className="flex justify-center items-center gap-1 text-[#4E5358]  hover:text-pink-500 p-4 rounded dark:hover:bg-gray-700 transition-colors duration-[3000ms]">
              <BiLabel />
              <Link href="/comment">留言板</Link>
            </li>
            <li className="flex justify-center items-center gap-1 text-[#4E5358]  hover:text-pink-500 p-4 rounded dark:hover:bg-gray-700 transition-colors duration-[3000ms]">
              <AiOutlineUser />
              <Link href="/about">关于</Link>
            </li>
            <li className="flex justify-center items-center gap-1 text-[#4E5358]  hover:text-pink-500 p-4 rounded dark:hover:bg-gray-700 transition-colors duration-[3000ms]">
              <IoIosSearch />
              <span>搜索</span>
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
