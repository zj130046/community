"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { LuToyBrick } from "react-icons/lu";
import { PiNoteThin, PiTag } from "react-icons/pi";
import { TbChevronRight, TbChevronsRight, TbChevronLeft } from "react-icons/tb";
import { Image, Card } from "@heroui/react";
import { useParams } from "next/navigation";
import { Article } from "@/app/store/message";

export default function Category() {
  const [currentPage, setCurrentPage] = useState(1);
  const [catelist, setCateList] = useState<Article[]>([]);
  const pageSize = 5;
  const { category } = useParams();

  useEffect(() => {
    const fetchCateGory = async () => {
      try {
        const response = await fetch(`/api/articles/${category}`);
        if (!response.ok) {
          throw new Error("error");
        }
        const data = await response.json();
        setCateList(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCateGory();
  }, [category]);

  const indexLast = currentPage * pageSize;
  const indexFirst = indexLast - pageSize;
  const currentList = catelist.slice(indexFirst, indexLast);
  const totalPage = Math.ceil(catelist.length / pageSize);
  return (
    <div>
      <div className="flex w-[1170px] m-auto items-start justify-between">
        <div>
          {currentList.map((article, index) => (
            <Card
              key={index}
              className="w-[840px] shadow-lg flex justify-center flex-col mb-[26px] dark:bg-gray-900 opacity-98"
            >
              <div className="flex justify-center flex-col">
                <div className="w-full h-[180px] mb-[10px] overflow-hidden group">
                  <Image
                    isZoomed
                    src={article.img}
                    alt="示例图片"
                    width={900}
                    height={180}
                    className="top-rounded-image w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                </div>

                <div className="pl-[25px] pr-[25px]">
                  <p className="text-center text-[25px] text-[#00DDDD]">
                    <Link href={`/article/${article.slug}`}>{article.title}</Link>
                  </p>
                  <div className="text-[12px] flex justify-center mb-[15px]">
                    <div className="flex justify-center mr-2 text-[#00A7E0] ">
                      <LuToyBrick className="h-[18px] mr-[5px]" />
                      <div className="flex">
                        <p className="mr-[8px]">
                          发表于
                          {dayjs(article.created_at).format("YYYY-MM-DD")}
                        </p>
                        <p>•</p>
                      </div>
                    </div>
                    <div className="flex justify-center mr-2">
                      <PiNoteThin className="h-[18px] mr-[5px]" />
                      <div className="flex">
                        <p className="mr-[8px]">
                          字数统计 {article.word_count}
                        </p>
                        <p>•</p>
                      </div>
                    </div>
                    <div className="flex justify-center text-[#FF3F1A]">
                      <PiTag className="h-[18px] mr-[5px]" />
                      <p>标签 {article.tag}</p>
                    </div>
                  </div>
                  <div className="flex justify-center mb-[20px] text-[#525F7F] text-[16px]">
                    <p>{article.excerpt}</p>
                  </div>

                  <p className="text-center hover:bg-red-400 text-[13px] bg-[#97DFFD] w-[100px] mb-[25px] m-auto h-[28px] leading-[28px] rounded-[5px]">
                    <Link href={`/article/${article.slug}`}>了解更多</Link>
                  </p>
                </div>
              </div>
            </Card>
          ))}

          <div className="mb-[50px]">
            <ul className="flex gap-[5px] justify-center cursor-pointer">
              <li
                className={`w-[36px] h-[36px] flex justify-center items-center bg-[#FFFFFF] rounded-[50%] ${
                  currentPage === 1 ? "opacity-50 cursor-default" : ""
                }`}
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
              >
                <TbChevronLeft />
              </li>
              {Array.from({ length: totalPage }).map((item, index) => (
                <li
                  key={index}
                  className={`w-[36px] h-[36px] bg-[#FFFFFF] rounded-[50%] text-center leading-[36px] ${
                    index + 1 === currentPage ? "bg-[#f87]" : ""
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </li>
              ))}

              <li
                className={`w-[36px] h-[36px] flex justify-center items-center bg-[#FFFFFF] rounded-[50%] ${
                  currentPage === totalPage ? "opacity-50 cursor-default" : ""
                }`}
                onClick={() =>
                  currentPage < totalPage && setCurrentPage(currentPage + 1)
                }
              >
                <TbChevronRight />
              </li>
              <li
                className="w-[36px] h-[36px] flex justify-center items-center bg-[#FFFFFF] rounded-[50%]"
                onClick={() => setCurrentPage(totalPage)}
              >
                <TbChevronsRight />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
