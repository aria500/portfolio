
import { assetPath } from "@/lib/assetPath";
import Link from "next/link";
import { ProjectFooter } from "@/components/ProjectFooter";
import { AutoDragCarousel, AutoFadeImages, ScrollHorizontalImage, SequentialReveal } from "@/components/CampaignImageInteractions";
import { DaisyHome } from "@/components/DaisyHome";

const root = "/images/xiaoping-slides";

function Slide({ name, alt }: { name: string; alt: string }) {
  return <section className="xp-slide"><img src={assetPath(`${root}/${name}`)} alt={alt} /></section>;
}

export default function XiaopingPage() {
  return <main className="xp-slides-page">
    <DaisyHome />
    <Slide name="cover.png" alt="晓平品牌 Campaign 封面" />
    <Slide name="brand-problem.png" alt="晓平品牌问题" />
    <SequentialReveal src={assetPath(`${root}/product-truth.png`)} alt="晓平产品支点" delay={135} regions={[
      {left:7.3,top:61,width:7.1,height:15},{left:14.4,top:61,width:7.1,height:15},{left:21.5,top:61,width:7.1,height:15},{left:28.6,top:61,width:7.1,height:15},
      {left:54.8,top:61,width:7.5,height:15},{left:62.3,top:61,width:7.5,height:15},{left:69.8,top:61,width:7.5,height:15},
    ]} />
    <Slide name="strategy.png" alt="晓平 Campaign 策略" />
    <Slide name="project-goal.png" alt="晓平项目目标" />
    <Slide name="challenge-28-days.png" alt="晓平二十八天打卡计划" />

    <section className="xp-interaction-section">
      <AutoFadeImages label="文案与海报" images={[
        { src: `${root}/copy-poster-01.png`, alt: "晓平文案与海报方案一" },
        { src: `${root}/copy-poster-02.png`, alt: "晓平文案与海报方案二" },
      ]} />
    </section>

    <Slide name="popup-concept.png" alt="晓平快闪活动概念" />
    <section className="xp-interaction-section">
      <AutoDragCarousel label="快闪现场" images={[
        { src: `${root}/popup-scene-01.png`, alt: "晓平快闪现场一" },
        { src: `${root}/popup-scene-02.png`, alt: "晓平快闪现场二" },
      ]} />
    </section>

    <ScrollHorizontalImage images={[
      { src: `${root}/media-journey-01.png`, alt: "晓平媒介行程第一阶段" },
      { src: `${root}/media-journey-02.png`, alt: "晓平媒介行程第二阶段" },
    ]} />

    <section className="xp-interaction-section">
      <AutoDragCarousel label="媒介场景" images={[
        { src: `${root}/mall-screen.png`, alt: "晓平商场大屏" },
        { src: `${root}/subway-screen.png`, alt: "晓平户外地铁大屏" },
        { src: `${root}/campus-offline.png`, alt: "晓平校园线下活动" },
        { src: `${root}/campus-offline-02.png`, alt: "晓平校园线下活动第二场景" },
        { src: `${root}/campus-offline-03.png`, alt: "晓平校园线下活动第三场景" },
      ]} />
    </section>

    <Slide name="social-good.png" alt="晓平公益活动" />
    <SequentialReveal src={assetPath(`${root}/documentary-script.png`)} alt="晓平纪录片脚本" delay={190} replayOnHover regions={[
      {left:.6,top:43,width:19.2,height:33},{left:20.7,top:43,width:19.2,height:33},{left:40.8,top:43,width:19.2,height:33},{left:60.8,top:43,width:19.2,height:33},{left:80.8,top:43,width:19.2,height:33},
    ]} />
    <section className="xp-ending-slide"><img src={assetPath(`${root}/ending.png`)} alt="晓平 Campaign 结尾" /></section>
    <ProjectFooter href="/projects/bloom-with-water/drink-to-bloom" title="Drink to Bloom" background="#f3eadf" color="#292720"/>
  </main>;
}
