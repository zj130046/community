"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Article } from "../../store/message";
import RightCard from "../../../components/rightcard";
import { CircularProgress, Card } from "@heroui/react";

const ArticleDetails = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const response = await fetch(`/api/articles/all/${slug}`);
      const data = await response.json();
      setArticle(data as Article);
    };
    fetchArticle();
  }, [slug]);

  if (!article) {
    return <CircularProgress aria-label="Loading..." />;
  }

  const cleanContent = DOMPurify.sanitize(article.content);

  return (
    <div className="flex w-[1150px] m-auto items-start justify-between">
      <div>
        <Card className="p-[20px] w-[840px] shadow-lg flex justify-center flex-col mb-[22px] dark:bg-gray-900 opacity-98">
          <div className="prose prose-lg dark:prose-invert max-w-[840px] w-full">
            {/* 很重要 */}
            <p className="text-[#00DDDD] text-[25px] m-auto text-center">
              {article.title}
            </p>
            <div dangerouslySetInnerHTML={{ __html: cleanContent }}></div>
          </div>
        </Card>
      </div>
      <RightCard></RightCard>
    </div>
  );
};

export default ArticleDetails;
