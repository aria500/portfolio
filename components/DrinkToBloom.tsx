"use client";
import { ProjectFooter } from "./ProjectFooter";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ProjectFacts } from "./ProjectFacts";
import { Header } from "./Header";
import bloom from "./DrinkToBloom.module.css";
import journey from "./BloomJourney.module.css";
import study from "./BloomCaseStudy.module.css";
import { BloomFlowerHero } from "./BloomFlowerHero";
import { editorialPageClass } from "./EditorialScroll";

const root = "/projects/drink-to-bloom";
const stageNames = ["萌芽", "舒叶", "含苞", "初开", "渐盛", "今天的花开啦"];

function Film({ file, title, crop = "", poster }: { file: string; title: string; crop?: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const manualPause = useRef(false);
  useEffect(() => {
    const video = ref.current;
    const frame = frameRef.current;
    if (!video || !frame) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !manualPause.current) void video.play().catch(() => setPlaying(false));
      else video.pause();
    }, { threshold: .05 });
    observer.observe(frame);
    return () => { observer.disconnect(); video.pause(); };
  }, []);
  return <div ref={frameRef} className={`${journey.film} ${crop}`}>
    <video ref={ref} src={`${root}/${file}`} poster={poster} autoPlay muted loop playsInline preload="auto"
      aria-label={title} onError={() => setFailed(true)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
    {failed ? <a className={journey.mediaControl} href={`${root}/${file}`}>打开原始视频 ↗</a> :
      <button className={journey.mediaControl} type="button" aria-label={`${playing ? "暂停" : "播放"}${title}`} onClick={() => {
        if (!ref.current) return;
        manualPause.current = playing;
        if (playing) ref.current.pause(); else void ref.current.play().catch(() => setPlaying(false));
      }}>{playing ? "暂停 II" : "播放 ▷"}</button>}
  </div>;
}

function FlowerCompare() {
  const [split, setSplit] = useState(50);
  return <div className={study.mainCompare} style={{ "--split": `${split}%` } as CSSProperties}>
    <div className={study.compareLabels}><span>BEFORE</span><span>AFTER</span></div>
    <div className={study.compareCanvas}>
      <img className={study.finalTulip} src={`${root}/flowers/05-tulip.png`} alt="Current：最终郁金香盛开素材" loading="lazy"/>
      <div className={study.beforeLayer}><img src={`${root}/v1-tulip.png`} alt="V1：旧版郁金香素材" loading="lazy"/></div>
      <div className={study.compareDivider} aria-hidden="true"><span>‹ ›</span></div>
      <input type="range" min="0" max="100" value={split} onChange={event=>setSplit(Number(event.target.value))} aria-label="拖动比较 V1 与 Current 花朵" aria-valuetext={`V1 显示 ${split}%，Current 显示 ${100-split}%`}/>
    </div>
    <div className={study.compareHint}><span>郁金香 · 初稿与最终版</span><span>拖动对比 · 支持方向键</span></div>
  </div>;
}

const chapters = [
  ["bloom-why", "项目初衷"], ["bloom-experience", "完整体验"],
  ["bloom-details", "互动细节 & 云同步"], ["bloom-ai", "视觉迭代"], ["bloom-future", "未来畅想"],
];
function JourneyBody() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("bloom-why");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current = chapters[0][0];
        for (const [id] of chapters) {
          const node = document.getElementById(id);
          if (node && node.getBoundingClientRect().top <= innerHeight * .35) current = id;
        }
        setActive(current);
      });
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", update); removeEventListener("resize", update); };
  }, []);
  return <div ref={ref} className={`${journey.body} ${study.layout}`}>
    <aside className={study.sidebar}>
      <Link href="/" className={study.back}>← 返回</Link>
      <nav aria-label="项目章节">{chapters.map(([id, name], i) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined}><span>0{i + 1}</span>{name}</a>)}</nav>
    </aside>
    <div className={study.content}>
      <section id="bloom-why" aria-labelledby="bloom-why-title">
        <header><span className={study.label}>01 / OVERVIEW</span><h2 id="bloom-why-title">让喝水不只是一个数字。</h2>
          <div style={{ marginTop: 24 }}><ProjectFacts type="个人 AI 产品实验" time="2026.08–至今" role="产品概念 / 功能定义 / 交互逻辑 / 视觉系统 / AI 协作迭代 / 前端实现与测试" live/></div>
          <p>喝水提醒很容易被忽略，单纯记录毫升数也很难带来持续动力。</p>
          <p>我想把每天重复的饮水行为，变成一种看得见、会期待、能留下来的成长体验。</p>
        </header>
        <figure className={study.frame}><img src={`${root}/scene-record.png`} alt="日常工作桌面上的饮水记录场景" loading="lazy"/></figure>
        <div className={study.values}>{[
          ["可视化成长", "喝下的水，会变成植物真实可见的成长。"],
          ["随机花朵", "每天种出的花并不完全相同，让完成饮水多一点期待。"],
          ["轻量记录", "不用认真写日记，几个字也可以留下当天的状态。"],
          ["长期花园", "每天的花保存在时空温室里，让坚持变成可以回看的花园。"],
        ].map(([title, copy], i) => <div key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></div>)}</div>
      </section>
      <section id="bloom-experience" aria-labelledby="bloom-daily-title">
        <header><span className={study.label}>02 / CORE EXPERIENCE</span><h2 id="bloom-daily-title">一次喝水，会发生什么？</h2><p>从记录此刻，到花朵成长，每一次饮水都会得到即时反馈。</p></header>
        <figure className={study.frame}><Film file="desktop-flow-model.mp4" title="电脑端完整饮水流程" crop={study.model}/></figure>
        <ol className={study.flow}>{["记录此刻", "快捷饮水", "水量与进度更新", "花朵成长", "保存今天"].map(text => <li key={text}>{text}</li>)}</ol>
        <div id="bloom-growth" className={study.subsection}><h3>六个阶段，让成长看得见。</h3>
          <div className={study.stages}>{stageNames.map((name, i) => <figure key={name}><img src={`${root}/blue-stages/stage-${i + 1}.png`} alt={`蓝色花第${i + 1}阶段：${name}`} loading="lazy"/><figcaption><span>0{i + 1}</span>{name}</figcaption></figure>)}</div>
        </div>
      </section>
      <section id="bloom-details" aria-labelledby="bloom-micro-title">
        <header><span className={study.label}>03 / DETAILS &amp; CLOUD SYNC</span><h2 id="bloom-micro-title">一些小反馈，让花真正“活”起来。</h2></header>
        <figure id="bloom-interaction" className={study.frame}><Film file="desktop-feedback-model.mp4" title="电脑端水杯光标与花朵互动" crop={study.model}/></figure>
        <dl className={study.notes}><div><dt>Hover</dt><dd>水杯光标 / 花朵轻晃</dd></div><div><dt>Click</dt><dd>轻反馈 / 提示语</dd></div><div><dt>Background</dt><dd>随饮水状态变化</dd></div></dl>
        <p className={study.small}>我将“趣味反馈”和“真实饮水记录”拆分，避免点击花朵误触发饮水数据。</p>
        <div id="bloom-cloud-sync" className={study.subsection}><header><span className={study.label}>CURRENT FEATURE / CLOUD SYNC · 已实现</span><h2>让今天的花，在不同设备上继续生长。</h2><p>通过云同步，用户可以在不同设备上延续同一份饮水记录与花园状态。</p></header>
          <div className={study.devices}><figure><Film file="mobile-flow-model.mp4" title="手机端饮水体验" crop={study.mobileModel}/></figure><figure><Film file="desktop-flow-model.mp4" title="电脑端饮水体验" crop={study.model}/></figure></div>
          <div className={study.syncEvidence}><div><h3>同一份配置，同一个花园。</h3><p>云同步已经可以实际使用。在不同设备的设置页中填写相同的 GitHub Token 与 Gist ID，即可继续同一份成长记录。</p><p>同步内容包括饮水记录、今日进度、花朵成长状态，以及花园和历史记录等站内数据。</p></div></div>
        </div>
        <div id="bloom-greenhouse" className={study.subsection}><h3>昨天的花，会留在时空温室里。</h3><p>左右浏览过去的花朵，点开一天，回看当时留下的记录。</p>
          <figure className={study.frame}><Film file="mobile-greenhouse-model.mp4" title="手机端时空温室与每日记录" crop={study.model}/></figure>
        </div>
      </section>
      <section id="bloom-ai" aria-labelledby="bloom-ai-title">
        <div className={study.iterationSpread}>
          <header><span className={study.label}>04 / VISUAL ITERATION</span><h2 id="bloom-ai-title">花朵素材的第二次生长。</h2><p>从初稿到最终版本，我重新统一了花朵的比例、细节和花盆关系，让它从单张素材变成可延展的花朵系统。</p><p className={study.small}>AI 加快了执行，但产品逻辑、交互判断与视觉取舍由我完成。</p></header>
        <div className={study.compareScale}><FlowerCompare/></div>
        </div>
        <ul className={study.upgrades}><li>比例更统一</li><li>细节更完整</li><li>系统更一致</li></ul>
        <div className={study.systemEvidence} aria-label="旧版与最终版花朵系统素材选集">
          <div className={study.evidenceRow}><span>BEFORE</span>{[["v1-tulip","旧版郁金香"],["v1-lily","旧版百合"],["v1-peony","旧版牡丹"]].map(([file,name])=><figure key={file}><img src={`${root}/${file}.png`} alt={name} loading="lazy"/></figure>)}</div>
          <div className={study.evidenceRow}><span>AFTER</span>{[["05-tulip","最终郁金香"],["01-green","最终绿色花盆植物"],["02-purple","最终紫色花簇"]].map(([file,name])=><figure key={file}><img src={`${root}/flowers/${file}.png`} alt={name} loading="lazy"/></figure>)}</div>
          <p className={study.small}>两版系统素材选集，非逐一同花种配对。</p>
        </div>
      </section>
      <section id="bloom-future" className={study.futureNote} aria-labelledby="bloom-future-title"><header><span className={study.label}>FUTURE NOTE</span><h2 id="bloom-future-title">把数字里的花，带到现实里。</h2><p>连续打卡 30 天后，未来可以尝试与合作花店联动，兑换一束真实鲜花。</p></header>
        <figure><img src={`${root}/future-florist-concept.png`} alt="未来花店联动活动概念：用户展示 30 天打卡完成界面，从店员手中领取鲜花" loading="lazy" width="1122" height="1402"/></figure>
      </section>
    </div>
  </div>;
}

export function DrinkToBloom() {
  return <main className={`${editorialPageClass} ${bloom.page} ${journey.whitePage}`} lang="zh-CN">
    <div className={bloom.content}>
      <Header/>
      <BloomFlowerHero/>
      <JourneyBody/>
      <div className={`${bloom.ending} ${journey.ending}`}><div><span>小小的坚持，也会开出花。</span></div></div>
      <ProjectFooter href="/projects/content-channel" title="Visual Notes" background="#fff" color="#34372f"/>
    </div>
  </main>;
}
