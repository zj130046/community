export const tags = [
  "JS",
  "React",
  "Next.js",
  "Tailwind",
  "Node.js",
  "HTML",
  "ES6",
  "ESLint",
  "Prettier",
  "Git",
  "GitHub",
  "TS",
  "GraphQL",
  "Redux",
  "MobX",
  "Vue.js",
  "Next.js",
  "Axios",
  "Html",
  "Css",
  "Babel",
  "Bash",
  "Redux",
  "Pinia",
  "Zustand",
  "Vite",
  "Npm",
  "Token",
  "Mookie",
  "Store",
  "Get",
  "Post",
  "Fetch",
];

export interface Article {
  id: number;
  category: string;
  tag: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  created_at: string;
  img: string;
  word_count: number;
}

export interface Blog {
  id: number;
  avatar_url: string;
  content: string;
  username: string;
  created_at: string;
  img: string;
  like_count: number;
}

export interface Comment {
  userId: number;
  avatarurl: string;
  content: string;
  username: string;
  created_at: string;
}

export const navItems = [
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

export const markdownContent = `
## 关于我

---

### 自我描述

网名 *Justin3go*，现居重庆。  

坚持深耕技术领域的 T 型前端程序员，关注 AI 与独立开发，喜欢 Vuejs、Nestjs，还会点 Python、搜索引擎、NLP、Web3、后端；  

虽是一名前端工程师，但更是一位计算机爱好者。平常会折腾一些效率工具，尝试各种工具软件和工具网站，喜欢开源、分享、探索、用代码创造价值。  

> 保持持续输出，数量与质量之间的平衡我更倾向于数量，因为可以记录更多...  

- 我也是一名摄影爱好者，目前使用 **Sony A7C2**，喜欢拍风光、生活以及扫街；
- 还是一名羽毛球爱好者，每周运动 8 小时，求羽毛球价格快降一降（大家多吃一点鹅鸭）。  

---

### 相关背景

- 2001，我出生了！  
- 2019 - 2023，就读于某双非一本，专业为计算机科学与技术；  
- 同时 2022.07 - 2022.10，实习于某互联网大厂，担任前端开发工程师；  
- 2023.03 - 至今，就职于某国企，担任前端开发工程师；  
- …  
- 2101，希望我还活着！  
- 3001，千年修为，我还在修炼！  

---

### 联系我

- 邮箱：just@justin3go.com
- 微信：Justin3go
- 推特：x.com/Justin1024go
- GitHub：github.com/Justin3go
- 掘金：juejin.cn
- 公众号：Justin3go
`;
