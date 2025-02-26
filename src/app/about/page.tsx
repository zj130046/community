"use client";

import { Card } from "@heroui/react";
import ReactMarkdown from "react-markdown";
import { markdownContent } from "../store/message";

export default function About() {
  return (
    <div className="flex w-[1150px] m-auto items-start justify-between">
      <div>
        <Card className="p-8 w-[840px] shadow-lg flex items-center flex-col h-[1400px] mb-[22px] dark:bg-gray-900 opacity-98">
          <ReactMarkdown className="prose prose-lg dark:prose-invert prose-h2:mt-2 prose-h3:mt-5 prose-hr:my-2 mb-[100px] max-w-[840px] w-full">
            {markdownContent}
          </ReactMarkdown>
          <div></div>
        </Card>
      </div>
      <Card className="w-[280px] shadow-lg h-[330px] mb-[20px] dark:bg-gray-900 opacity-98"></Card>
    </div>
  );
}
