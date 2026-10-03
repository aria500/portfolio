export type Project = {
  slug: string;
  index: string;
  homeTitle: string;
  title: string;
  year: string;
  category: string;
  client: string;
  summary: string;
  palette: [string, string, string];
  layout: "lead" | "offset" | "paired";
  description: string;
  tags: string[];
  result: string;
  accentColor: string;
  navColor: string;
  image: string | null;
  secondaryImage?: string;
  accentImage?: string;
  video?: string;
  imageAlt: string;
  visualVariant: "botanical" | "night" | "social" | "poster" | "campaign";
};

export const projects: Project[] = [
  {
    slug: "bloom-with-water",
    index: "03",
    homeTitle: "Built With AI",
    title: "Drink to Bloom",
    year: "2026",
    category: "AI 产品实验",
    client: "个人项目",
    summary: "把每日饮水变成花朵成长，用 AI 协作将创意做成可使用的互动体验。",
    palette: ["#c8d7a8", "#5d7546", "#eef1df"],
    layout: "lead",
    description: "把每日饮水变成花朵成长，用 AI 协作将创意做成可使用的互动体验。",
    tags: ["AI-assisted Creation","功能定义","交互迭代"],
    result: "个人 AI 产品实验 / 2026",
    accentColor: "#F5AFD8",
    navColor: "#F5AFD8",
    image: "/images/built-with-ai-macbook-transparent.png",
    secondaryImage: "/images/built-with-ai-iphone.png",
    accentImage: "/images/built-with-ai-peony.png",
    imageAlt: "Bloom With Water MacBook and iPhone interface mockups with a peony flowerpot illustration",
    visualVariant: "botanical",
  },
  {
    slug: "anxiety-fighter",
    index: "01",
    homeTitle: "Made for the Feed",
    title: "Made for the Feed",
    year: "2023–2024",
    category: "内容表达",
    client: "个人内容运营实践",
    summary: "从人物、情绪与片段切入，完成选题、文案、剪辑和平台表达。",
    palette: ["#bcc5dd", "#53618b", "#e7e9f2"],
    layout: "offset",
    description: "从人物、情绪与片段切入，完成选题、文案、剪辑和平台表达。",
    tags: ["内容策划","新媒体运营","视频剪辑"],
    result: "累计播放量 50W+",
    accentColor: "#F1F1F1",
    navColor: "#171717",
    image: "/images/made-for-the-feed-hero.png",
    video: "/videos/made-for-the-feed-preview.mp4",
    imageAlt: "Editorial collage of esports video moments and Chinese lyric captions",
    visualVariant: "night",
  },
  {
    slug: "content-channel",
    index: "04",
    homeTitle: "Visual Notes",
    title: "Visual Notes",
    year: "2025",
    category: "视觉笔记",
    client: "个人创作",
    summary: "关于拼贴、海报、图像处理与日常观察的精选视觉笔记。",
    palette: ["#e4a195", "#bb4b3c", "#f2ded8"],
    layout: "paired",
    description: "关于拼贴、海报、图像处理与日常观察的精选视觉笔记。",
    tags: ["拼贴","海报","图像处理"],
    result: "精选视觉作品",
    accentColor: "#A8DDFA",
    navColor: "#A8DDFA",
    image: "/images/visual-notes-hero.png",
    imageAlt: "Blue-toned still life photograph of a perfume bottle and botanical stem",
    visualVariant: "social",
  },
  {
    slug: "selected-visuals",
    index: "02",
    homeTitle: "Ideas Into Campaigns",
    title: "Ideas Into Campaigns",
    year: "2024",
    category: "品牌策划",
    client: "品牌创意提案",
    summary: "晓平品牌整合营销策划，从品牌问题连接创意、内容与媒介。",
    palette: ["#e9cb5f", "#b99622", "#f4ecd0"],
    layout: "lead",
    description: "晓平品牌整合营销策划，从品牌问题连接创意、内容与媒介。",
    tags: ["传播策略","广告文案","媒介排期"],
    result: "整合营销策划 / 2024",
    accentColor: "#FCD5BD",
    navColor: "#FCD5BD",
    image: "/images/ideas-into-campaigns-hero.png",
    imageAlt: "Warm peach skincare campaign featuring a close-up portrait and Chinese campaign typography",
    visualVariant: "poster",
  },
  {
    slug: "brand-planning",
    index: "05",
    homeTitle: "About",
    title: "About",
    year: "2025",
    category: "关于我",
    client: "张炎 / Yan Zhang",
    summary: "张炎 / Yan Zhang · 内容策划与新媒体运营，广告学背景，关注 AI 辅助创作。",
    palette: ["#94b7d2", "#2e648c", "#dce8ef"],
    layout: "offset",
    description: "张炎 / Yan Zhang · 内容策划与新媒体运营，广告学背景，关注 AI 辅助创作。",
    tags: ["内容策划","新媒体运营","AI-assisted Creation"],
    result: "内容策划 · 新媒体运营",
    accentColor: "#F5AFD8",
    navColor: "#F5AFD8",
    image: "/projects/about/resume.jpeg",
    imageAlt: "张炎 / Yan Zhang",
    visualVariant: "campaign",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
