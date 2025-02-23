"use client"; // 让组件只在客户端渲染

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Image } from "@heroui/react";
import { useEffect, useState } from "react";
import { Article } from "../app/store/message";
import { Card, CardHeader } from "@heroui/react";
import Link from "next/link";

export default function Carousel() {
  const [articlesLatest, setArticlesLatest] = useState<Article[]>([]);
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch("/api/articles/latest");
        if (!response.ok) {
          throw new Error("error");
        }
        const data = await response.json();
        setArticlesLatest(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchArticle();
  }, []);
  return (
    <div className="relative w-full max-w-[1170px] mx-auto mb-[40px]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0} // 图片之间的间距
        slidesPerView={1} // 每次展示 1 张
        navigation // 左右箭头
        pagination={{ clickable: true }} // 下方小圆点
        autoplay={{ delay: 3000, disableOnInteraction: false }} // 自动播放
        loop={true} // 循环播放
        className="w-full h-[400px]"
      >
        {articlesLatest.map((article) => (
          <SwiperSlide key={article.id}>
            <Link href={`/slug/${article.slug}`}>
              <Card className="col-span-12 sm:col-span-4 ">
                <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                  <h4 className="text-white font-medium text-large">
                    {article.title}
                  </h4>
                </CardHeader>
                <Image
                  removeWrapper
                  alt="Slide 1"
                  className="z-0 w-full h-full object-cover"
                  src={article.img}
                />
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
