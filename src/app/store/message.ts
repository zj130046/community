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
  "TS",
  "Redux",
  "MobX",
  "Vue.js",
  "Next.js",
  "Axios",
  "Html",
  "Css",
  "Redux",
  "Pinia",
  "Zustand",
  "Vite",
  "Npm",
  "Token",
  "Store",
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
  slug: string;
  img: string;
  like_count: number;
}

export interface Comment {
  id: number;
  userId: number;
  avatar_url: string;
  content: string;
  username: string;
  created_at: string;
  like_count: number;
}

export interface NewComment {
  avatar_url: string;
  content: string;
  username: string;
  created_at: string;
  is_author: string;
}

interface User {
  id: number;
  username: string;
  avatar_url: string;
}

export interface SearchResults {
  articles: Article[];
  blogs: Blog[];
  users: User[];
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

export const categories = [
  { key: "recommend", label: "推荐" },
  { key: "front", label: "前端" },
  { key: "backend", label: "后端" },
  { key: "ai", label: "AI" },
  { key: "note", label: "笔记" },
  { key: "android", label: "Android" },
  { key: "ios", label: "IOS" },
  { key: "database", label: "数据库" },
  { key: "data", label: "数据结构" },
  { key: "python", label: "Python" },
  { key: "sentiment", label: "感悟" },
  { key: "daily", label: "日常" },
];

export const emojiList = [
  "😀",
  "😂",
  "😍",
  "😭",
  "👍",
  "🔥",
  "❤️",
  "😎",
  "😊",
  "😢",
  "😋",
  "🥰",
  "😄",
  "😆",
  "😉",
  "🤔",
  "🤩",
  "🤪",
  "😝",
  "😏",
  "🤤",
  "😬",
  "😷",
  "🤧",
  "🤒",
  "🥳",
  "😻",
  "💪",
  "👀",
  "🙌",
  "👏",
  "🤗",
  "🥺",
  "🤭",
  "😤",
  "😵",
  "🤠",
  "🥴",
  "😇",
  "😈",
];

export const markdownContent = `
## 关于我

---

### 自我描述

网名 *@*，现居武汉。  

在过去的学习过程中，我系统地掌握了 HTML、CSS 、JavaScript、vue和react 等前端基础技术。通过不断地实践和项目练习，我能够熟练运用这些技术进行网页的结构搭建、样式设计和交互实现。

例如，在完成一个小型个人博客网站的项目中，我运用所学知识，从页面布局的规划到细节样式的调整，再到用户交互功能的实现，每一个环节都进行了精心的设计和优化，最终成功完成了一个具有良好用户体验的网站。

> 保持持续输出，数量与质量之间的平衡我更倾向于数量，因为可以记录更多...  

- 未来，我将继续深入学习前端技术，不断提升自己的专业水平。
- 我希望能够参与到更具挑战性的项目中，为前端技术的发展贡献自己的一份力量。

---

### 相关背景

- 2004，我出生了！  
- 2023 - 至今，就读于某双非一本，专业为软件工程；  
- 目前还没有实习过，希望暑假能找到实习 ！
- …  
- 2101，希望我还活着！  
- 3001，我已经半步元婴！ 

---

### 联系我

- 邮箱：1300468170@qq.com
- 微信：j1300170
- GitHub：github.com/zj130046
`;
