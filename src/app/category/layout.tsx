"use client";

import Link from "next/link";
import { Card } from "@heroui/react";
import RightCard from "../../components/rightcard";
const navItems = [
  { label: "全部", href: "/category" },
  { label: "推荐", href: "/category/recommend" },
  { label: "前端", href: "/category/front" },
  { label: "后端", href: "/category/backend" },
  { label: "AI", href: "/category/ai" },
  { label: "笔记", href: "/category/note" },
  { label: "Android", href: "/category/android" },
  { label: "IOS", href: "/category/ios" },
  { label: "数据库", href: "/category/database" },
  { label: "数据结构", href: "/category/data" },
  { label: "python", href: "/category/python" },
  { label: "感悟", href: "/category/sentiment" },
  { label: "日常", href: "/category/daily" },
];
import { usePathname } from "next/navigation";
import Carousel from "../../components/carousel";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <div className="w-[1170px] m-auto">
      <Carousel></Carousel>
      <div className="w-full flex justify-between">
        <div className="flex flex-col max-w-[840px]">
          <Card className="shadow-lg dark:bg-gray-900 opacity-98 mb-[20px]">
            <ul className="h-[40px] p-[4px] flex justify-between items-center bg-[#F4F4F5]">
              {navItems.map((item, index) =>
                pathname === item.href ? (
                  <li
                    key={index}
                    className="text-[#fff] text-[14px] bg-[#F31260] pt-[4px] pb-[4px] pl-[12px] pr-[12px] rounded-xl"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ) : (
                  <li
                    key={index}
                    className="text-[#71717A] text-[14px] pt-[4px] pb-[4px] pl-[12px] pr-[12px]"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                )
              )}
            </ul>
          </Card>

          <div>{children}</div>
        </div>
        <RightCard></RightCard>
      </div>
    </div>
  );
};

export default DashboardLayout;
