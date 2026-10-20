"use client";

import { assetPath } from "@/lib/assetPath";
import Image from "next/image";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { DaisyHome } from "@/components/DaisyHome";

const root = "/projects/made-for-the-feed-v3";
const lyrics = ["或许会有一束光","看见了梦想就会成真","我会在你身后","让我在黑暗的尽头里和你一起脆弱","一起走","黑暗的尽头是你和我","能够永远抱得紧紧的","在宇宙的角落一起走到黑暗的尽头"];

function RevealSection({className,children,label,id}:{className:string;children:React.ReactNode;label:string;id?:string}) {
  const ref=useRef<HTMLElement>(null);
  useEffect(()=>{const node=ref.current;if(!node)return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting)node.dataset.active="true"},{threshold:.22});observer.observe(node);return()=>observer.disconnect()},[]);
  return <section ref={ref} id={id} className={`feed3-section ${className}`} aria-label={label}>{children}</section>;
}

const heroParts = [
  {title:"内容策略",english:"Content Strategy",video:"strategy-01.mp4",target:"content-strategy"},
  {title:"内容制作",english:"Content Production",video:"production-01.mp4",target:"content-production"},
  {title:"内容制作",english:"Content Production",image:"production-02.png",target:"content-production"},
  {title:"内容制作",english:"Content Production",image:"production-03.png",target:"content-production"},
  {title:"内容制作",english:"Content Production",image:"production-04.png",target:"content-production"},
  {title:"平台适配",english:"Platform Adaptation",image:"platform-01.jpg",target:"platform-expression"},
  {title:"平台适配",english:"Platform Adaptation",image:"platform-02.jpg",target:"platform-expression"},
  {title:"内容策略",english:"Content Strategy",video:"review-01.mp4",target:"content-strategy"},
  {title:"内容策略",english:"Content Strategy",image:"review-02.jpg",target:"content-strategy"},
  {title:"文案表达",english:"Copywriting",image:"copywriting.png",target:"copywriting"},
  {title:"选题策划",english:"Topic Planning",video:"planning.mp4",target:"content-planning"},
];

export function OrbitHero(){
  const [active,setActive]=useState(0);
  const [hovered,setHovered]=useState<number|null>(null);
  const heroRef=useRef<HTMLDivElement>(null);
  const cardsRef=useRef<(HTMLButtonElement|null)[]>([]);
  const phaseRef=useRef(0);
  const boostRef=useRef(0);
  const shown=hovered??active;
  const orbitStep=360/heroParts.length;

  useEffect(()=>{
    const node=heroRef.current;
    if(!node)return;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame=0;
    let previous=performance.now();
    const render=(now:number)=>{
      const dt=Math.min(40,now-previous);
      previous=now;
      if(!reduced){
        phaseRef.current=(phaseRef.current+(.006+boostRef.current)*dt)%360;
        boostRef.current*=Math.pow(.9,dt/16.67);
      }
      let focusIndex=0;
      let focusDistance=Infinity;
      cardsRef.current.forEach((card,index)=>{
        if(!card)return;
        const angle=(90+index*orbitStep+phaseRef.current)%360;
        const rad=angle*Math.PI/180;
        const distance=Math.abs(((angle-90+540)%360)-180);
        const depth=(Math.cos(distance*Math.PI/180)+1)/2;
        card.style.setProperty("--orbit-x",`${50+30*Math.cos(rad)}%`);
        card.style.setProperty("--orbit-y",`${49+30*Math.sin(rad)}%`);
        card.style.setProperty("--orbit-scale",String(.72+.38*depth));
        card.style.setProperty("--orbit-opacity",String(.38+.62*depth));
        card.style.setProperty("--orbit-z",String(Math.round(2+depth*7)));
        if(distance<focusDistance){focusDistance=distance;focusIndex=index;}
      });
      setActive(current=>current===focusIndex?current:focusIndex);
      frame=requestAnimationFrame(render);
    };
    const onWheel=(event:WheelEvent)=>{
      if(reduced)return;
      boostRef.current=Math.min(.035,boostRef.current+Math.abs(event.deltaY)*.000045);
    };
    node.addEventListener("wheel",onWheel,{passive:true});
    frame=requestAnimationFrame(render);
    return()=>{node.removeEventListener("wheel",onWheel);cancelAnimationFrame(frame);};
  },[orbitStep]);

  const go=(target:string)=>document.getElementById(target)?.scrollIntoView({behavior:"smooth",block:"start"});
  return <section className="feed4-hero-track" aria-label="Made For The Feed 能力导航"><div ref={heroRef} className="feed4-hero">
    <div className="feed4-center" aria-live="polite">
      <p key={`${shown}-${heroParts[shown].title}`}>{heroParts[shown].title}</p>
      <small key={`${shown}-${heroParts[shown].english}`}>{heroParts[shown].english}</small>
    </div>
    <div className="feed4-orbit">
      {heroParts.map((part,index)=>{
        const angle=index*orbitStep+90;
        const rad=angle*Math.PI/180;
        const style={"--orbit-x":`${50+30*Math.cos(rad)}%`,"--orbit-y":`${49+30*Math.sin(rad)}%`,"--orbit-scale":shown===index?1.08:.8,"--orbit-opacity":shown===index?1:.46,"--orbit-z":shown===index?12:2} as CSSProperties;
        return <button ref={node=>{cardsRef.current[index]=node}} key={`${part.title}-${index}`} type="button" style={style} className={`feed4-orbit-item${shown===index?" is-active":""}`} onMouseEnter={()=>setHovered(index)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(index)} onBlur={()=>setHovered(null)} onClick={()=>go(part.target)} aria-label={`查看 ${part.title}`}>
          {part.video?<video src={assetPath(`/projects/made-for-the-feed-v4/${part.video}`)} muted loop autoPlay playsInline/>:<Image src={assetPath(`/projects/made-for-the-feed-v4/${part.image}`)} alt="" fill priority={index===0} sizes="24vw"/>}
        </button>;
      })}
    </div>
  </div></section>;
}

function LyricNarrative(){
  const [active,setActive]=useState(0);const steps=useRef<(HTMLDivElement|null)[]>([]);
  useEffect(()=>{const observers=steps.current.map((node,index)=>{if(!node)return null;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting)setActive(index)},{rootMargin:"-42% 0px -42% 0px"});observer.observe(node);return observer});return()=>observers.forEach(observer=>observer?.disconnect())},[]);
  return <section className="feed3-lyrics" aria-label="歌词与图片叙事"><div className="feed3-lyrics-stage"><div className="feed3-lyrics-copy"><p className="feed3-kicker">VISUAL NARRATIVE / 8 SCENES</p><div className="feed3-lyric-list">{lyrics.map((lyric,index)=><p key={lyric} className={active===index?"is-active":""}><span>{String(index+1).padStart(2,"0")}</span>{lyric}</p>)}</div></div><div className="feed3-lyrics-image">{lyrics.map((lyric,index)=><Image key={lyric} src={assetPath(`${root}/lyric-${String(index+1).padStart(2,"0")}.png`)} alt={`歌词画面：${lyric}`} fill sizes="(max-width:760px) 100vw,54vw" className={active===index?"is-active":""}/>)}</div><p className="feed3-scene-count">{String(active+1).padStart(2,"0")} / 08</p></div><div className="feed3-lyric-steps" aria-hidden="true">{lyrics.map((lyric,index)=><div key={lyric} ref={node=>{steps.current[index]=node}}/>)}</div></section>;
}

export function MadeForTheFeed(){return <main className="feed3-page"><DaisyHome/>
  <OrbitHero/>
  <LyricNarrative/>
  <RevealSection id="content-strategy" className="feed3-strategy" label="Content Strategy"><header><p className="feed3-kicker">01 / CONTENT STRATEGY</p><h2>先明确和谁说话，<br/>再决定说什么、怎么说。</h2></header><figure className="feed3-strategy-main"><Image src={assetPath(`${root}/qingqing-cover.png`)} alt="电竞人物内容封面" fill sizes="44vw"/></figure><figure className="feed3-strategy-vlog"><Image src={assetPath(`${root}/tokyo-vlog.jpg`)} alt="Tokyo vlog 内容封面" fill sizes="24vw"/></figure><div className="feed3-strategy-notes"><article><b>POSITION</b><p>以电竞人物与赛事为主要方向，从互动、生活瞬间与情绪节点寻找内容切口。</p></article><article><b>AUDIENCE</b><p>关注电竞选手、人物故事与年轻文化内容的用户。</p></article><article><b>CONTENT PILLARS</b><p>人物互动 · 赛事与选手 · Vlog · Mood</p></article></div><p className="feed3-workflow">POSITION <i/> TOPIC <i/> CREATE <i/> PUBLISH <i/> REVIEW</p></RevealSection>
  <RevealSection id="content-planning" className="feed3-planning" label="Content Planning"><header><p className="feed3-kicker">02 / CONTENT PLANNING</p><h2>从人物、情绪与事件里，<br/>找到值得被讲出来的内容入口。</h2></header><article className="feed3-case feed3-case-a"><Image src={assetPath(`${root}/qingqing-cover.png`)} alt="清清抱娃内容" fill sizes="40vw"/><div><b>CASE 01 / BILIBILI</b><h3>人物身份与场景反差</h3><p>普通直播片段因为人物关系而拥有明确的传播点。</p></div></article><article className="feed3-case feed3-case-b"><Image src={assetPath(`${root}/tokyo-vlog.jpg`)} alt="Tokyo Vlog" fill sizes="25vw"/><div><b>CASE 02 / XIAOHONGSHU</b><h3>城市氛围与生活碎片</h3><p>旅行体验本身构成吸引力，不依赖单一事件。</p></div></article><article className="feed3-case feed3-case-c"><Image src={assetPath(`${root}/shibuya-frame.jpg`)} alt="Shibuya 卡点内容" fill sizes="22vw"/><div><b>CASE 03 / DOUYIN</b><h3>节奏决定第一吸引力</h3><p>音乐节点和首帧视觉共同完成快速进入。</p></div></article></RevealSection>
  <RevealSection id="content-production" className="feed3-production" label="Content Production"><header><p className="feed3-kicker">03 / CONTENT PRODUCTION</p><h2>把零散素材，<br/>重新组织成有节奏、有重点的内容。</h2></header><figure className="feed3-timeline"><Image src={assetPath(`${root}/premiere-timeline.png`)} alt="Premiere Pro 剪辑时间线" fill sizes="70vw"/></figure><div className="feed3-production-flow">{[["SOURCE","寻找可用片段"],["SELECT","保留关系与情绪"],["STRUCTURE","重排事件重点"],["EDIT","控制音乐与镜头"],["PACKAGE","完成标题与首帧"]].map(([title,text])=><article key={title}><b>{title}</b><p>{text}</p></article>)}</div><aside><b>TOOLS</b><p>Premiere Pro · CapCut · Photoshop · Canva</p><b>AI ASSISTED</b><p>选题发散 · 信息整理 · 文案方向 · 效率提升</p><small>AI 用于辅助整理与提效，最终内容判断与制作由我完成。</small></aside></RevealSection>
  <RevealSection id="platform-expression" className="feed3-platform" label="Platform Expression"><header><p className="feed3-kicker">04 / PLATFORM EXPRESSION</p><h2>Same skill.<br/>Different platform language.</h2><p>不同平台，不只是尺寸不同，而是观看方式、节奏和信息密度都不同。</p></header><figure className="feed3-platform-bili"><Image src={assetPath(`${root}/qingqing-cover.png`)} alt="Bilibili 人物叙事内容" fill sizes="38vw"/><figcaption><b>BILIBILI</b> 人物关系 · 完整叙事 · 节奏组织</figcaption></figure><figure className="feed3-platform-red"><Image src={assetPath(`${root}/tokyo-vlog.jpg`)} alt="小红书旅行内容" fill sizes="20vw"/><figcaption><b>XIAOHONGSHU</b> 旅行氛围 · 生活碎片</figcaption></figure><figure className="feed3-platform-douyin"><Image src={assetPath(`${root}/shibuya-frame.jpg`)} alt="抖音节奏内容" fill sizes="18vw"/><figcaption><b>DOUYIN</b> 音乐节点 · 强首帧</figcaption></figure><figure className="feed3-platform-wechat"><Image src={assetPath(`${root}/wechat-long.jpg`)} alt="微信公众号长图排版" fill sizes="16vw"/><figcaption><b>WECHAT</b> 图文层级 · 阅读节奏</figcaption></figure></RevealSection>
  <RevealSection id="copywriting" className="feed3-copy" label="Copywriting"><p className="feed3-kicker">05 / COPYWRITING</p><p className="feed3-copy-tag">DOUBAN CALENDAR / COPY SERIES</p><h2>用更少的文字，<br/>留下更长的情绪。</h2><blockquote className="feed3-quote-a">“所有离开，都是为了更好的回来。”</blockquote><blockquote className="feed3-quote-b">“黄昏把今天写成了一封没有地址的信。”</blockquote><blockquote className="feed3-quote-c">“我们在重复的日子里，等待一次偶然。”</blockquote><blockquote className="feed3-quote-d">“风经过的时候，也带走了一点迟疑。”</blockquote><p className="feed3-copy-principle"><b>COPY PRINCIPLE</b><br/>短 · 具体 · 有画面</p></RevealSection>
  <RevealSection id="what-i-can-solve" className="feed3-solve" label="What I Can Solve"><p className="feed3-kicker">06 / WHAT I CAN SOLVE</p><h2>把零散的信息，<br/>转译成适合被看见的内容。</h2><div><article><b>POSITION</b><p>明确受众与内容方向</p></article><article><b>ENTRANCE</b><p>找到人物、情绪与事件切口</p></article><article><b>STRUCTURE</b><p>组织素材与观看节奏</p></article><article><b>EXPRESSION</b><p>匹配不同平台语言</p></article></div></RevealSection>
  </main>}
