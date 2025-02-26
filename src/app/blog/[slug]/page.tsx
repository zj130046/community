"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import RightCard from "../../../components/rightcard";
import { CircularProgress, Card } from "@heroui/react";
import { Image } from "@heroui/react";
import dayjs from "dayjs";
import { Blog } from "@/app/store/message";
import { BiMessageDetail, BiLike } from "react-icons/bi";

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);

  const handleLike = async (id) => {
    try {
      const response = await fetch(`/api/blog/like/${id}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("点赞失败");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      const response = await fetch(`/api/blog/all/${slug}`);
      const data = await response.json();
      setBlog(data);
    };
    fetchBlog();
  }, [slug]);

  if (!blog) {
    return <CircularProgress aria-label="Loading..." />;
  }

  return (
    <div className="flex w-[1150px] m-auto items-start justify-between">
      <div>
        <Card className="p-[20px] w-[840px] shadow-lg flex justify-center flex-col mb-[22px] dark:bg-gray-900 opacity-98">
          <div className="pt-6 pb-6 border-b-1">
            <div className="flex justify-center flex-col">
              <div className="flex">
                <div>
                  <Image
                    src={blog.avatar_url || "/assets/20.jpg"}
                    alt="示例图片"
                    width={45}
                    height={45}
                    className="rounded-full"
                  />
                </div>
                <div className="flex flex-col ml-4">
                  <p className="text-[14px]">{blog.username}</p>
                  <p className="text-[#999AAA] text-[12px]">
                    {dayjs(blog.created_at).format("YYYY-MM-DD")}
                  </p>
                </div>
              </div>
              <div
                className="pl-14 pr-14 pb-2"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blog.content),
                }}
              ></div>
              <div className="w-full max-h-[180px] mb-[10px] pr-14 pl-14">
                {blog.img ? (
                  <Image
                    src={blog.img}
                    alt="示例图片"
                    width={900}
                    height={180}
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="flex justify-around">
                <div className="flex justify-around">
                  <BiLike
                    className="text-[22px] text-[#999999] mr-2"
                    onClick={() => handleLike(blog.id)}
                  />
                  <p className="text-[#999999]">{blog.like_count}</p>
                </div>
                <div className="flex justify-around items-center">
                  <BiMessageDetail className="text-[22px] text-[#999999] mr-2" />
                  <p className="text-[#999999]">{blog.like_count}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <RightCard></RightCard>
    </div>
  );
};

export default BlogDetails;
