"use client";

import { useState, useRef, useEffect } from "react";
import { FcAlarmClock, FcPieChart } from "react-icons/fc";
import Link from "next/link";
import { IoPricetagOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { FcBarChart } from "react-icons/fc";
import { WiTime8 } from "react-icons/wi";
import { tags, Article } from "../app/store/message";
import { Image } from "@heroui/react";
import { useDisclosure, Button, Tooltip, Card } from "@heroui/react";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import { RiArticleLine } from "react-icons/ri";
import { FaRegComments, FaComments } from "react-icons/fa";
import { LiaCommentsSolid } from "react-icons/lia";
import { MdLogin } from "react-icons/md";
import { PiUserCirclePlus } from "react-icons/pi";
import useUserStore from "./../app/store/userStore";

const RADIUS = 100;
const FALL_LENGTH = 500;
const ROTATION_SPEED = 0.005;

export default function RightCard() {
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
  const [isRotatingForward, setIsRotatingForward] = useState(false);
  const handleMouseEnter = () => setIsRotatingForward(true);
  const handleMouseLeave = () => setIsRotatingForward(false);

  const tagSphereRef = useRef<HTMLDivElement>(null);
  const angleXRef = useRef(ROTATION_SPEED);
  const angleYRef = useRef(ROTATION_SPEED);
  const [tagPositions, setTagPositions] = useState<
    { x: number; y: number; z: number; color: string }[]
  >([]);

  const text = "你好,欢迎来到悠哉社区!";
  const [visibleText, setVisibleText] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const [index, setIndex] = useState(0);

  const [articlesLatest, setArticlesLatest] = useState<Article[]>([]);
  const [commentsList, setCommentsList] = useState([]);
  const { user, login } = useUserStore();
  // const [articleTotal, setArticleTotal] = useState(0);
  // const [categoryTotal, setCategoryTotal] = useState(0);
  // const [tagTotal, setTagTotal] = useState(0);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commentRes, articleRes, totalRes] = await Promise.all([
          fetch("/api/comments/latest").then((res) => res.json()),
          fetch("/api/articles/latest").then((res) => res.json()),
          fetch("/api/articles/all").then((res) => res.json()),
        ]);

        setCommentsList(commentRes);

        setArticlesLatest(articleRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!isRemoving) {
      if (index < text.length) {
        timeout = setTimeout(() => {
          setVisibleText((prev) => prev + text[index]);
          setIndex(index + 1);
        }, 300);
      } else {
        timeout = setTimeout(() => {
          setIsRemoving(true);
        }, 1000);
      }
    } else {
      if (index > 0) {
        timeout = setTimeout(() => {
          setVisibleText((prev) => prev.slice(0, -1));
          setIndex(index - 1);
        }, 200);
      } else {
        setIsRemoving(false);
      }
    }

    return () => clearTimeout(timeout);
  }, [index, isRemoving]);

  useEffect(() => {
    const positions = tags.map((_, index) => {
      const k = (2 * (index + 1) - 1) / tags.length - 1;
      const a = Math.acos(k);
      const b = a * Math.sqrt(tags.length * Math.PI);
      const x = RADIUS * Math.sin(a) * Math.cos(b);
      const y = RADIUS * Math.sin(a) * Math.sin(b);
      const z = RADIUS * Math.cos(a);
      const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
      return { x, y, z, color };
    });
    setTagPositions(positions);
  }, []);

  useEffect(() => {
    const animate = () => {
      setTagPositions((prevPositions) => {
        const cosX = Math.cos(angleXRef.current);
        const sinX = Math.sin(angleXRef.current);
        const cosY = Math.cos(angleYRef.current);
        const sinY = Math.sin(angleYRef.current);

        return prevPositions.map(({ x, y, z, color }) => {
          const y1 = y * cosX - z * sinX;
          const z1 = z * cosX + y * sinX;
          const x2 = x * cosY - z1 * sinY;
          const z2 = z1 * cosY + x * sinY;
          return { x: x2, y: y1, z: z2, color };
        });
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const loginCard = (
    <Card className="w-[280px] shadow-lg h-[300px] mb-[20px] dark:bg-gray-900 opacity-98 p-[22px]">
      <div className="flex flex-col items-center">
        <div className="w-[80px] h-[80px] relative m-auto mb-[20px]">
          <Image
            src="/assets/20.jpg"
            alt="示例图片"
            width={80}
            height={80}
            className={`rounded-full transition-transform duration-500 ${
              isRotatingForward ? "rotate-360" : "rotate-360-reverse"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </div>
        <p className="mb-[20px]">你好！ 请登录</p>
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
        <div className="gradient-bg  w-[280px] h-[90px]"></div>
      </div>
    </Card>
  );

  const loggedInCard = (
    <Card className="w-[280px] shadow-lg h-[300px] mb-[20px] dark:bg-gray-900 opacity-98 p-[22px]">
      <div className="flex flex-col items-center">
        <div className="w-[80px] h-[80px] relative m-auto mb-[20px]">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt="示例图片"
              width={80}
              height={80}
              className={`rounded-full transition-transform duration-500 ${
                isRotatingForward ? "rotate-360" : "rotate-360-reverse"
              }`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          ) : (
            <Image
              src="/assets/20.jpg"
              alt="示例图片"
              width={80}
              height={80}
              className={`rounded-full transition-transform duration-500 ${
                isRotatingForward ? "rotate-360" : "rotate-360-reverse"
              }`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          )}
        </div>
        <p className="mb-[20px]">{user?.username || "未登录"}</p>
        <div className="flex gap-2">
          <Tooltip content={`共${0}篇文章`} color="danger">
            <div className="flex justify-center rounded-[5px] text-[12px] w-[31.6px] h-[22.2px]  text-[#2997F7] bg-[#2997F71A]">
              <RiArticleLine className="h-[22.2px] leading-[22.2px]" />
              <p className="h-[22.2px] leading-[22.2px]">{0}</p>
            </div>
          </Tooltip>
          <Tooltip content={`共${0}条评论`} color="danger">
            <div className="flex justify-center rounded-[5px] text-[12px] w-[31.6px] h-[22.2px] text-[#18A52A] bg-[#12B9281A]">
              <FaRegComments className="h-[22.2px] leading-[22.2px]" />
              <p className="h-[22.2px] leading-[22.2px]">{0}</p>
            </div>
          </Tooltip>
          <Tooltip content={`共${0}篇帖子`} color="danger">
            <div className="flex justify-center rounded-[5px] text-[12px] w-[31.6px] h-[22.2px] text-[#5C7CFF] bg-[#4D82F91A]">
              <LiaCommentsSolid className="h-[22.2px] leading-[22.2px]" />
              <p className="h-[22.2px] leading-[22.2px]">{0}</p>
            </div>
          </Tooltip>
        </div>
        <div className="gradient-bg  w-[280px] h-[90px] mt-[25px]"></div>
      </div>
    </Card>
  );

  return (
    <div>
      {user?.username ? loggedInCard : loginCard}

      <Card className="w-[280px] shadow-lg h-[130px] mb-[20px] dark:bg-gray-900 opacity-98">
        <div className="flex justify-center items-end flex-row mt-[25px] mb-[15px]">
          <FcAlarmClock className="h-[25.5px]" />
          <p className="text-[#333333] text-[17px] h-[25.5px] leading-[25.5px]">
            公告
          </p>
        </div>
        <div className="text-center text-[15px]">{visibleText}</div>
        <div className="flex justify-center items-center"></div>
      </Card>

      <Card className="w-[280px] shadow-lg h-[300px] mb-[20px] pr-[50px] relative dark:bg-gray-900 opacity-98">
        <div className="flex justify-center items-end flex-row ml-[50px] pt-[5px]">
          <IoPricetagOutline className="h-[25.5px]" />
          <p className="text-[#333333] text-[17px] h-[25.5px] leading-[25.5px]">
            标签云
          </p>
        </div>
        <div
          className="tag-sphere-container relative w-full h-[230px]"
          ref={tagSphereRef}
        >
          <div className="tag-sphere">
            {tagPositions.map(({ x, y, z, color }, index) => {
              const scale = FALL_LENGTH / (FALL_LENGTH - z || 1);
              const alpha = (z + RADIUS) / (2 * RADIUS);
              return (
                <span
                  key={index}
                  className="tag"
                  style={{
                    transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                    fontSize: `${15 * scale}px`,
                    opacity: alpha + 0.5,
                    zIndex: `${Math.round(scale * 100)}`,
                    position: "absolute",
                    color,
                  }}
                >
                  {tags[index]}
                </span>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="w-[280px] shadow-lg h-[440px] mb-[20px] dark:bg-gray-900 opacity-98 p-[10px]">
        <div className="mb-[15px] flex justify-center border-b border-solid pb-[5px]">
          <FcBarChart className="h-[24px] leading-[24px] text-2xl mr-2" />

          <p className="text-[#333333] text-[17px]">最新文章</p>
        </div>
        <div>
          {" "}
          {articlesLatest.map((article, index) => (
            <div key={index} className="flex justify-between mb-[10px]">
              <Link
                className="w-[90px] h-[65px] relative overflow-hidden group"
                href={`/${article.slug}`}
              >
                <Image
                  src={article.img}
                  alt="示例图片"
                  width={90}
                  isZoomed
                  height={65}
                  className=" w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
              </Link>
              <div className="w-[160px] flex flex-col min-h-[65px] justify-between">
                <div className="text-[#4E5358] text-[14px] hover:text-pink-500">
                  <Link href={`/${article.slug}`}>{article.title}</Link>
                </div>
                <div className="text-[#B1B1B1] text-[12px] flex">
                  <WiTime8 className="h-[18px] mr-[2px]" />
                  <p>{dayjs(article.created_at).format("YYYY-MM-DD")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="w-[280px] shadow-lg dark:bg-gray-900 opacity-98 p-[12px]">
        <div className="flex justify-between pb-[10px] pt-[10px] items-center">
          <div className="flex justify-center">
            <FaComments className="h-[24px] leading-[24px] text-2xl mr-[8px]" />
            <p className="text-[#333333] text-[17px]">最新留言</p>
          </div>

          <div className="flex h-[12px] gap-2">
            <div className="w-[12px] h-[12px] rounded-full bg-[red]"></div>
            <div className="w-[12px] h-[12px] rounded-full bg-[blue]"></div>
            <div className="w-[12px] h-[12px] rounded-full bg-[orange]"></div>
          </div>
        </div>
        <div>
          {commentsList.map((comment, index) => (
            <div key={index} className="flex flex-col pb-[8px] border-t-1 pt-3">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center mb-[5px]">
                    {comment.avatar_url ? (
                      <Image
                        src={comment.avatar_url}
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

                    <p className="ml-[5px] text-[14px] text-[#262626] mr-[4px]">
                      {comment.username}
                    </p>
                    <p className="text-[10px] bg-[red] text-[#FFFFFF] rounded-[2px] pr-[1px] pl-[1px]">
                      {user?.is_author ? "作者" : "游客"}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-[#888888] flex items-center">
                  {dayjs(comment.created_at).format("YYYY-MM-DD")}
                </div>
              </div>
              <div className="bg-[#F7F7F7] rounded-[3px]">
                <p className="text-[12px] text-[#333333] p-[5px]">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
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
    </div>
  );
}
