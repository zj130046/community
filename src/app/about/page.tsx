"use client";

import { Card } from "@heroui/react";
import ReactMarkdown from "react-markdown";
import RightCard from "../../components/rightcard";
import { markdownContent } from "../store/message";

export default function About() {
  return (
    <div className="flex w-[1170px] m-auto items-start justify-between">
      <div>
        <Card className="w-[840px] shadow-lg flex items-center flex-col h-[2000px] mb-[22px] dark:bg-gray-900 opacity-98">
          <ReactMarkdown className="prose prose-lg dark:prose-invert prose-h2:mt-2 prose-h3:mt-5 prose-hr:my-2 mb-[100px] max-w-[840px] w-full">
            {markdownContent}
          </ReactMarkdown>
          <div></div>
        </Card>
      </div>
      <RightCard></RightCard>
    </div>
  );
}
