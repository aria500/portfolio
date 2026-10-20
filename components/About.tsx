import Link from "next/link";
import Image from "next/image";
import { ProjectFooter } from "./ProjectFooter";
import { Header } from "./Header";

export function About({ resumeAvailable }: { resumeAvailable: boolean }) {
  return <main className="about-recruit"><Header/><section>
    <p className="about-eyebrow">关于我 / ABOUT</p>
    <h1>张炎 <span>/ Yan Zhang</span></h1>
    <h2>内容策划 · 新媒体运营 · 创意表达</h2>
    <figure className="about-film-portrait"><Image src="/images/about/yan-film-portrait.png" alt="张炎在树林与草地之间，手持应援物和小玩偶的胶片照片" width={3318} height={2279} sizes="(max-width:760px) 86vw,780px" priority/></figure>
    <p>广告学背景，关注内容策划、品牌表达与 AI 辅助创作。</p>
    <p>有自媒体运营、品牌策划与跨境电商相关项目经验，习惯从选题、文案、视觉和复盘几个维度推进内容。</p>
    <p>最近也在尝试使用 AI，把内容与产品想法快速做成可交互的作品。</p>
    <div className="about-contact"><a href="mailto:ian2280395276@gmail.com">Email ↗</a>{resumeAvailable && <a href="/downloads/aria-zhang-resume.pdf" download>Download Resume ↓</a>}<a href="https://aria500.github.io/waterflower/?v=14days-final" target="_blank" rel="noopener noreferrer">Drink to Bloom · Live Project ↗</a></div>
  </section><ProjectFooter href="/work/made-for-the-feed" title="Made for the Feed"/></main>;
}
