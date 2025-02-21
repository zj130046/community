"use client";

import { Tooltip, Card, Button } from "@heroui/react";
import { useState, useEffect } from "react";
import { Image } from "@heroui/react";
import { RiArticleLine } from "react-icons/ri";
import { FaRegComments } from "react-icons/fa";
import { LiaCommentsSolid } from "react-icons/lia";
import { useRouter } from "next/navigation";

export default function About() {
  const [articleTotal, setArticleTotal] = useState(0);
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [tagTotal, setTagTotal] = useState(0);
  const router = useRouter();
  const [isRotatingForward, setIsRotatingForward] = useState(false);
  const handleMouseEnter = () => setIsRotatingForward(true);
  const handleMouseLeave = () => setIsRotatingForward(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await fetch("/api/articles/all");
        if (!response.ok) {
          throw new Error("error");
        }
        const data = await response.json();
        setArticleTotal(data.total);
        setCategoryTotal(data.categoryTotal);
        setTagTotal(data.tagTotal);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAll();
  }, []);
  return (
    <div className="flex w-[1170px] m-auto items-start justify-between">
      <Card className="w-[840px] shadow-lg flex items-center flex-col h-[2000px] mb-[22px] dark:bg-gray-900 opacity-98"></Card>

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

        <Card className="w-[280px] shadow-lg h-[300px] mb-[20px] dark:bg-gray-900 opacity-98 p-[22px]">
          <div className="flex flex-col items-center">
            <div className="w-[80px] h-[80px] relative m-auto mb-[20px]">
              <Image
                src="/assets/2.jpg"
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
            <p className="mb-[20px]">军~</p>
            <div className="flex gap-2">
              <Tooltip content={`共${articleTotal}篇文章`} color="danger">
                <div className="flex justify-center rounded-[5px] text-[12px] w-[31.6px] h-[22.2px]  text-[#2997F7] bg-[#2997F71A]">
                  <RiArticleLine className="h-[22.2px] leading-[22.2px]" />
                  <p className="h-[22.2px] leading-[22.2px]">{articleTotal}</p>
                </div>
              </Tooltip>
              <Tooltip content={`共${categoryTotal}条评论`} color="danger">
                <div className="flex justify-center rounded-[5px] text-[12px] w-[31.6px] h-[22.2px] text-[#18A52A] bg-[#12B9281A]">
                  <FaRegComments className="h-[22.2px] leading-[22.2px]" />
                  <p className="h-[22.2px] leading-[22.2px]">{categoryTotal}</p>
                </div>
              </Tooltip>
              <Tooltip content={`共${tagTotal}篇帖子`} color="danger">
                <div className="flex justify-center rounded-[5px] text-[12px] w-[31.6px] h-[22.2px] text-[#5C7CFF] bg-[#4D82F91A]">
                  <LiaCommentsSolid className="h-[22.2px] leading-[22.2px]" />
                  <p className="h-[22.2px] leading-[22.2px]">{tagTotal}</p>
                </div>
              </Tooltip>
            </div>
            <div className="gradient-bg  w-[280px] h-[90px] mt-[25px]"></div>
          </div>
        </Card>
        <Card className="w-[280px] shadow-lg h-[300px] mb-[20px] dark:bg-gray-900 opacity-98 p-[22px]">
          <p></p>
        </Card>
      </div>
    </div>
  );
}
