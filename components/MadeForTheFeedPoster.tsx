"use client";
import { ProjectFooter } from "./ProjectFooter";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DaisyHome } from "@/components/DaisyHome";
import styles from "./MadeForTheFeedPoster.module.css";

const mediaRoot = "/projects/made-for-the-feed-v4";

const feedPalette=["#ffffff","#ffffff","#fcf9ef","#968978","#7b2214"];

function FeedBackgroundLayer(){
  const layerRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const layer=layerRef.current;
    const page=layer?.parentElement;
    if(!layer||!page)return;
    const anchors=Array.from(page.querySelectorAll<HTMLElement>("[data-feed-palette]"));
    let frame=0;
    const colors=feedPalette.map(hex=>[1,3,5].map(index=>Number.parseInt(hex.slice(index,index+2),16)));
    const update=()=>{
      frame=0;
      const position=window.scrollY+window.innerHeight*.48;
      const points=anchors.map(anchor=>anchor.getBoundingClientRect().top+window.scrollY+Math.min(anchor.offsetHeight*.18,window.innerHeight*.34));
      let index=0;
      while(index<points.length-1&&position>=points[index+1])index+=1;
      const next=Math.min(index+1,points.length-1);
      const distance=Math.max(1,points[next]-points[index]);
      const progress=next===index?0:Math.min(1,Math.max(0,(position-points[index])/distance));
      const rgb=colors[index].map((channel,channelIndex)=>Math.round(channel+(colors[next][channelIndex]-channel)*progress));
      layer.style.backgroundColor=`rgb(${rgb.join(",")})`;
      const gridOpacity=index===0?Math.max(0,(progress-.82)/.18):index===1?(progress<.78?1:(1-progress)/.22):0;
      layer.style.setProperty("--feed-grid-opacity",String(Math.min(1,Math.max(0,gridOpacity))));
    };
    const requestUpdate=()=>{if(!frame)frame=requestAnimationFrame(update)};
    update();
    window.addEventListener("scroll",requestUpdate,{passive:true});
    window.addEventListener("resize",requestUpdate);
    return()=>{
      window.removeEventListener("scroll",requestUpdate);
      window.removeEventListener("resize",requestUpdate);
      if(frame)cancelAnimationFrame(frame);
    };
  },[]);
  return <div ref={layerRef} className={styles.backgroundLayer} aria-hidden="true"/>;
}

function ShibuyaHero(){
  const trackRef=useRef<HTMLElement>(null);

  useEffect(()=>{
    const track=trackRef.current;
    if(!track)return;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame=0;
    const update=()=>{
      frame=0;
      if(reduced.matches){
        track.style.setProperty("--city-reveal-right","0%");
        return;
      }
      const rect=track.getBoundingClientRect();
      const distance=Math.max(1,rect.height-window.innerHeight);
      const progress=Math.min(1,Math.max(0,-rect.top/distance));
      track.style.setProperty("--city-reveal-right",`${(1-progress)*100}%`);
    };
    const requestUpdate=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();
    window.addEventListener("scroll",requestUpdate,{passive:true});
    window.addEventListener("resize",requestUpdate);
    reduced.addEventListener("change",requestUpdate);
    return()=>{
      window.removeEventListener("scroll",requestUpdate);
      window.removeEventListener("resize",requestUpdate);
      reduced.removeEventListener("change",requestUpdate);
      if(frame)cancelAnimationFrame(frame);
    };
  },[]);

  return <section ref={trackRef} data-feed-palette="0" className="feed-city-hero-track" aria-label="Made For The Feed 项目开场">
    <div className="feed-city-hero">
      <div className="feed-city-hero__image">
        <Image src={`${mediaRoot}/shibuya-night.jpg`} alt="涩谷夜景俯拍，城市霓虹、广告屏、人流与街道交织" fill priority sizes="100vw"/>
      </div>
      <div className="feed-city-hero__title">
        <h1>
          <span>从人物、情绪和片段里找到故事入口</span>
          <span>再用标题、节奏与画面把它讲出来</span>
        </h1>
        <div className="feed-city-hero__title-revealed" aria-hidden="true">
          <h1>
            <span>从人物、情绪和片段里找到故事入口</span>
            <span>再用标题、节奏与画面把它讲出来</span>
          </h1>
        </div>
      </div>
    </div>
  </section>;
}

type Asset = {
  src: string;
  kind: "image" | "video";
  className: string;
  alt: string;
};

type PosterSectionProps = {
  id: string;
  index: string;
  title: string;
  english: string;
  variant: string;
  assets: Asset[];
};

function PosterAsset({asset,index}:{asset:Asset;index:number}){
  return <figure className={`feed-poster__asset ${asset.className}`} style={{"--asset-order":index} as React.CSSProperties}>
    {asset.kind==="video"
      ? <video src={`${mediaRoot}/${asset.src}`} muted loop autoPlay playsInline controls aria-label={asset.alt}/>
      : <Image src={`${mediaRoot}/${asset.src}`} alt={asset.alt} fill sizes="(max-width:760px) 74vw,46vw"/>}
  </figure>;
}

function PosterSection({id,index,title,english,variant,assets}:PosterSectionProps){
  const ref=useRef<HTMLElement>(null);

  useEffect(()=>{
    const node=ref.current;
    if(!node)return;
    const observer=new IntersectionObserver(([entry])=>{
      node.dataset.active=entry.isIntersecting?"true":"false";
    },{threshold:.28});
    observer.observe(node);
    return()=>observer.disconnect();
  },[]);

  return <section ref={ref} id={id} className={`feed-poster feed-poster--${variant}`} aria-label={`${title} / ${english}`}>
    <p className="feed-poster__index">{index}</p>
    <div className="feed-poster__title">
      <h2>{title}</h2>
      <p>{english}</p>
    </div>
    <div className="feed-poster__media">{assets.map((asset,assetIndex)=><PosterAsset key={asset.src} asset={asset} index={assetIndex}/>)}</div>
  </section>;
}

const strategyRoot=`${mediaRoot}/content-strategy`;
const fixedStoryRoot=`${mediaRoot}/fixed-story`;
const strategyAdditionRoot=`${mediaRoot}/content-strategy-additions`;
const graphicEditorialRoot=`${mediaRoot}/graphic-editorial`;

type StoryAsset={src:string;kind:"image"|"video";className:string;layout:string;alt:string;root?:string;clickToPlay?:boolean;poster?:string;pageTitle?:string;pageBody?:string;pageKeywords?:string[]};
type StoryStage={id:string;title:string;english:string;summary:string;keywords:string[];color:string;titleColor:string;assets:StoryAsset[]};

const storyStages:StoryStage[]=[
  {
    id:"content-strategy",title:"内容策略",english:"Content Strategy",
    summary:"从素材切入内容判断，让选题、表达与观看兴趣建立连接。",
    keywords:["人物关系","情绪节点","传播切口"],
    color:"transparent",
    titleColor:"#000000",
    assets:[],
  },
  {
    id:"content-production",title:"内容制作",english:"Content Production",
    summary:"把素材组织成清晰节奏，让信息在画面与声音之间自然推进。",
    keywords:["剪辑节奏","视觉包装","成片输出"],
    color:"transparent",
    titleColor:"#454add",
    assets:[
      {src:"production-video.mp4",kind:"video",className:"story-main story-main--production-video",layout:"production-video",alt:"翔松人物情绪向剪辑成片",clickToPlay:true,poster:"xiang-song-video-cover.jpg",pageTitle:"把人物情绪剪成可停留的内容",pageBody:"从人物关系、情绪氛围与片段张力中提炼核心看点，用节奏、字幕、标题与封面完成内容包装。",pageKeywords:["人物情绪向剪辑","氛围感内容包装","标题与封面设计"]},
      {src:"production-04.png",kind:"image",className:"story-detail story-detail--production-process",layout:"production-process",alt:"内容制作剪辑时间线与制作过程",pageTitle:"从素材筛选到节奏组织",pageBody:"筛选并重组素材，根据情绪安排节奏起伏，完成字幕、标题、结构设计与统一风格的成片输出。",pageKeywords:["素材筛选","情绪节奏控制","字幕与标题包装","封面与成片输出"]},
    ],
  },
  {
    id:"content-planning-platform",title:"内容策划与平台适配",english:"Content Planning & Platform Fit",
    summary:"不是先决定发什么平台，而是先判断什么内容值得做，再选择最合适的表达方式。",
    keywords:["内容判断","平台语境","表达选择"],
    color:"transparent",
    titleColor:"#fff36e",
    assets:[],
  },
];

function ClickToPlayStoryVideo({asset,root}:{asset:StoryAsset;root:string}){
  const videoRef=useRef<HTMLVideoElement>(null);
  const [playing,setPlaying]=useState(false);
  useEffect(()=>{
    const video=videoRef.current;if(!video)return;
    const observer=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting)video.pause();
    },{threshold:.1});
    observer.observe(video);return()=>{observer.disconnect();video.pause()};
  },[]);
  const togglePlayback=()=>{
    const video=videoRef.current;
    if(!video)return;
    if(video.paused){
      void video.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false));
    }else{
      video.pause();
      setPlaying(false);
    }
  };
  return <div className={`feed-story-video${playing?" is-playing":""}`}>
    <video ref={videoRef} src={`${root}/${asset.src}`} poster={asset.poster?`${root}/${asset.poster}`:undefined} loop muted playsInline preload="metadata" controls aria-label={asset.alt} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/>
    {!playing?<button type="button" className="feed-story-video__play" onClick={togglePlayback} aria-label={`播放${asset.alt}`}><span aria-hidden="true"/></button>:null}
  </div>;
}

function FixedStoryAsset({asset,index}:{asset:StoryAsset;index:number}){
  const root=asset.root??fixedStoryRoot;
  return <figure className={`feed-fixed-story__asset ${asset.className}`} style={{"--story-order":index} as React.CSSProperties}>
    {asset.kind==="video"
      ? asset.clickToPlay
        ? <ClickToPlayStoryVideo asset={asset} root={root}/>
        : <video src={`${root}/${asset.src}`} muted loop autoPlay playsInline controls aria-label={asset.alt}/>
      : <Image src={`${root}/${asset.src}`} alt={asset.alt} fill sizes="(max-width:760px) 72vw,44vw"/>}
  </figure>;
}

function StrategyBoards(){
  const strategyCards=[
    {number:"01",title:"账号定位",body:"围绕人物、情绪与片段，提炼更适合社媒传播的内容。"},
    {number:"02",title:"内容支柱",body:"将内容拆分为人物互动、情绪剪辑、城市 Vlog、图文表达等方向，保持输出的一致性。"},
    {number:"03",title:"选题来源",body:"从直播片段、旅行素材、平台热点与日常观察中寻找可被放大的内容切口。"},
    {number:"04",title:"内容目标",body:"通过标题、节奏、画面与平台选择，提高内容的停留感、共鸣感与表达完整度。"},
  ];
  const commentLanes=[
    ["comment-01.png","comment-02.png"],
    ["comment-03.png","comment-04.png"],
    ["comment-05.png","comment-06.png"],
  ];
  return <div data-feed-palette="1" className="feed-strategy-boards" aria-label="内容策略方法">
    <div className="feed-strategy-cards">
      {strategyCards.map((card,index)=><section key={card.number} data-story-stage="0" className={`feed-strategy-card-step feed-strategy-card-step--${index+1}`} aria-label={`${card.number} ${card.title}`}>
        <article className="feed-strategy-card">
          <span>{card.number}</span>
          <div><h3>{card.title}</h3><p>{card.body}</p></div>
        </article>
      </section>)}
    </div>
    <section data-story-stage="0" className="feed-strategy-execution" aria-label="内容执行与成片证据">
      <div className="feed-strategy-execution__copy">
        <p>CONTENT EXECUTION</p>
        <h3>从判断到成片</h3>
        <strong>从人物日常片段中提炼反差感与情绪连接，并通过标题、节奏和剪辑完成视频表达。</strong>
        <ul aria-label="内容执行能力">
          <li>内容切口</li><li>标题包装</li><li>节奏剪辑</li>
        </ul>
      </div>
      <div className="feed-strategy-execution__video">
        <div className="feed-strategy-execution__video-label"><span>VIDEO PROOF</span><p>B站人物内容 · 成片证据</p></div>
        <div className="feed-strategy-execution__video-frame">
          <ClickToPlayStoryVideo asset={{src:"strategy-video.mp4",kind:"video",className:"",layout:"",alt:"B站人物内容执行成片",clickToPlay:true,poster:"strategy-video-cover.png"}} root={strategyRoot}/>
        </div>
      </div>
    </section>
    <section data-story-stage="0" className="feed-strategy-feedback" aria-label="用户反馈与内容复盘">
      <header>
        <p>FEEDBACK LOOP</p>
        <h3>用户反馈</h3>
        <strong>通过评论反馈观察用户对标题、剪辑节奏和情绪表达的反应，并将高共鸣内容沉淀为后续选题参考。</strong>
      </header>
      <div className="feed-strategy-comments" aria-label="真实用户评论流">
          {commentLanes.map((comments,laneIndex)=><div key={laneIndex} className={`feed-strategy-comment-lane feed-strategy-comment-lane--${laneIndex+1}`}>
            <div className="feed-strategy-comment-track">
              {[0,1].map(copyIndex=><div key={copyIndex} className="feed-strategy-comment-group" aria-hidden={copyIndex===1}>
                {comments.map((comment,commentIndex)=><figure key={comment} className={`feed-strategy-marquee-comment feed-strategy-marquee-comment--${laneIndex*2+commentIndex+1}`}>
                  <Image src={`${strategyAdditionRoot}/${comment}`} alt={copyIndex===0?`真实用户评论 ${laneIndex*2+commentIndex+1}`:""} fill sizes="(max-width:760px) 58vw,32vw"/>
                </figure>)}
              </div>)}
            </div>
          </div>)}
      </div>
    </section>
  </div>;
}

const platformJudgements=[
  {
    platform:"B站",position:"人物叙事",image:`${strategyRoot}/strategy-card.png`,
    alt:"电竞选手与宠物互动内容局部",title:"电竞选手与宠物互动",body:"从竞技形象与柔软日常的反差中提炼停留点。",
    keywords:["人物近景","轻松标题","情绪铺垫"],
  },
  {
    platform:"小红书",position:"氛围停留",image:`${fixedStoryRoot}/platform-tokyo.jpg`,
    alt:"Tokyo Vlog 旅行画面局部",title:"Tokyo Vlog / 旅行内容",body:"用城市画面、生活细节和旅行氛围制造停留感。",
    keywords:["氛围封面","城市细节","生活方式"],
  },
  {
    platform:"小红书",position:"审美内容账号",image:"/images/xiaohongshu-aesthetic-evidence.png",
    alt:"单篇内容数据：1.5万浏览、3876赞、819收藏、9评论",
    title:"小红书 / 审美内容账号",
    subtitle:"从 0 起号，用高频更新验证“轻量审美内容”的平台反馈。",
    body:"围绕外网可爱图片与视觉灵感做内容筛选，负责选图、标题、标签与发布节奏；根据互动表现持续调整内容方向与更新频率。",
    metrics:"截至 2026.09.14 · 132 粉丝 · 1.1W 获赞与收藏 · 单篇最高 1.5W 浏览 · 3876 赞 · 819 收藏",
    fields:[
      ["内容判断","高识别度、情绪轻、保存欲强的视觉内容更适合连续发布与收藏传播。"],
      ["平台语境","小红书用户更容易对“审美积累 / 可爱图片 / 视觉灵感”产生点赞与收藏行为。"],
      ["表达选择","保持轻标题、统一标签与高频更新，弱化复杂叙事，让图片本身成为主角。"],
    ],
    keywords:[],
  },
  {
    platform:"抖音",position:"节奏抓取",image:`${mediaRoot}/shibuya-night.jpg`,
    alt:"Shibuya 夜景卡点画面局部",title:"Shibuya 卡点剪辑",body:"用夜景、人流和音乐节点形成快速进入的短视频节奏。",
    keywords:["强首帧","音乐卡点","快速剪辑"],
  },
  {
    platform:"公众号",position:"信息沉淀",image:`${graphicEditorialRoot}/diamond-mixed-layout.png`,
    alt:"钻石科普图文排版局部",title:"钻石科普长图",body:"将复杂资料拆成标题层级、图文模块和清晰阅读顺序。",
    keywords:["信息层级","图文排版","阅读节奏"],
  },
];

function PlanningPlatformSequence(){
  return <div data-feed-palette="3" className="feed-planning-platform" aria-label="内容策划与平台适配案例">
    <section data-story-stage="2" className="feed-planning-platform__opening" aria-label="内容策划与平台适配章节开场"/>
    {platformJudgements.map((item,index)=><section key={item.title} data-story-stage="2" className={`feed-planning-platform__step feed-planning-platform__step--${index>2?index:index+1}${item.fields?" feed-platform-aesthetic":""}`} aria-label={`${item.platform}：${item.title}`}>
      <article className="feed-planning-platform__card">
        <div className="feed-planning-platform__meta">
          <span>{item.fields?"02B":String(index>2?index:index+1).padStart(2,"0")}</span>
          <p>{item.platform}<small>{item.position}</small></p>
        </div>
        <div className="feed-planning-platform__content">
          <div>
            <h3>{item.title}</h3>
            {item.subtitle && <p>{item.subtitle}</p>}
            {!item.fields && <p>{item.body}</p>}
            {item.fields && <dl className="feed-platform-aesthetic__fields">{item.fields.map(([label,text])=><div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>}
            {item.metrics && <p className="feed-platform-aesthetic__metrics">{item.metrics.split(" · 单篇最高 ")[0]}<br/>单篇最高 {item.metrics.split(" · 单篇最高 ")[1]}</p>}
            {item.keywords.length>0 && <ul aria-label={`${item.platform}表达方式`}>
              {item.keywords.map(keyword=><li key={keyword}>{keyword}</li>)}
            </ul>}
          </div>
          <figure>
            <Image src={item.image} alt={item.alt} fill sizes="(max-width:760px) 82vw,25vw"/>
          </figure>
        </div>
      </article>
    </section>)}
  </div>;
}

function LongImagePreview({src,alt,className,defaultPreviewSrc}:{src:string;alt:string;className:string;defaultPreviewSrc?:string}){
  const [focus,setFocus]=useState({x:50,y:12,active:false});
  const updateFocus=(event:React.PointerEvent<HTMLElement>,active=true)=>{
    const rect=event.currentTarget.getBoundingClientRect();
    const x=Math.min(100,Math.max(0,((event.clientX-rect.left)/Math.max(1,rect.width))*100));
    const y=Math.min(100,Math.max(0,((event.clientY-rect.top)/Math.max(1,rect.height))*100));
    setFocus({x,y,active});
  };
  const previewStyle={
    backgroundImage:`url("${focus.active?src:(defaultPreviewSrc??src)}")`,
    backgroundPosition:focus.active?`${focus.x}% ${focus.y}%`:"center",
  } as React.CSSProperties;
  const focusStyle={left:`${focus.x}%`,top:`${focus.y}%`} as React.CSSProperties;
  return <figure
    className={`${className} feed-long-image-preview${focus.active?" is-inspecting":""}`}
    onPointerLeave={()=>setFocus(current=>({...current,active:false}))}
  >
    <div
      className="feed-long-image-preview__source"
      onPointerEnter={event=>updateFocus(event)}
      onPointerMove={event=>updateFocus(event)}
      onPointerDown={event=>updateFocus(event)}
    >
      <Image src={src} alt={alt} fill sizes="18vw"/>
      <span className="feed-long-image-preview__focus" style={focusStyle} aria-hidden="true"/>
    </div>
    <div className="feed-long-image-preview__detail" style={previewStyle} aria-live="polite">
      {!focus.active?<span>Hover to inspect details</span>:null}
    </div>
  </figure>;
}

function GraphicEditorialCases(){
  const sectionRef=useRef<HTMLDivElement>(null);
  const [activeCase,setActiveCase]=useState(0);
  useEffect(()=>{
    const section=sectionRef.current;
    if(!section)return;
    let frame=0;
    const update=()=>{
      frame=0;
      const rect=section.getBoundingClientRect();
      const distance=Math.max(1,rect.height-window.innerHeight);
      const progress=Math.min(1,Math.max(0,-rect.top/distance));
      setActiveCase(progress<.5?0:1);
    };
    const requestUpdate=()=>{if(!frame)frame=requestAnimationFrame(update)};
    update();
    window.addEventListener("scroll",requestUpdate,{passive:true});
    window.addEventListener("resize",requestUpdate);
    return()=>{
      window.removeEventListener("scroll",requestUpdate);
      window.removeEventListener("resize",requestUpdate);
      if(frame)cancelAnimationFrame(frame);
    };
  },[]);
  const mainImage=`${graphicEditorialRoot}/diamond-science-long.jpg`;
  const diamondDetails=[
    {src:"diamond-mixed-layout.png",alt:"黄色钻石与戒指的图文混排区",label:"图文混排区"},
    {src:"diamond-sections.png",alt:"钻石科普 PART.1、PART.2、PART.3 分节结构",label:"信息层级与章节设计"},
  ];
  return <div ref={sectionRef} data-story-stage="1" data-current={activeCase} className="feed-graphic-editorial-scroll" aria-label="Graphic Editorial 图文长图制作案例">
    <div className="feed-graphic-editorial">
    <section data-active={activeCase===0?"true":"false"} aria-hidden={activeCase!==0} className="feed-graphic-editorial__case feed-graphic-editorial__case--main" aria-label="钻石科普长图制作案例">
      <div className="feed-graphic-editorial__copy">
        <p className="feed-graphic-editorial__label">GRAPHIC EDITORIAL / 01</p>
        <h3>把零散素材<br/>整理成内容资产</h3>
        <p className="feed-graphic-editorial__body">围绕科普类主题，将资料、图片和文字重新整理为可观看、可阅读、可发布的移动端长图内容。通过标题层级、图文混排和留白控制阅读节奏，让复杂信息更容易被理解。</p>
        <dl className="feed-graphic-editorial__modules">
          <div><dt>VIDEO EDITING</dt><dd>素材筛选 / 节奏控制 / 标题封面 / 成片包装</dd></div>
          <div><dt>GRAPHIC EDITORIAL</dt><dd>长图排版 / 信息层级 / 图文节奏 / 阅读体验</dd></div>
          <div><dt>TOOLS</dt><dd>PR / 剪映 / PS / 秀米 / Canva / AI 辅助整理</dd></div>
        </dl>
      </div>
      <div className="feed-graphic-editorial__details" aria-label="长图局部细节">
        {diamondDetails.map((detail,index)=><figure key={detail.src} className={`feed-graphic-editorial__detail feed-graphic-editorial__detail--${index+1}`}>
          <Image src={`${graphicEditorialRoot}/${detail.src}`} alt={detail.alt} fill sizes="22vw"/>
          <figcaption>{detail.label}</figcaption>
        </figure>)}
      </div>
      <LongImagePreview className="feed-graphic-editorial__overview" src={mainImage} defaultPreviewSrc={`${graphicEditorialRoot}/diamond-cover.png`} alt="《钻石科普》完整长图全貌"/>
    </section>
    <section data-active={activeCase===1?"true":"false"} aria-hidden={activeCase!==1} className="feed-graphic-editorial__case feed-graphic-editorial__case--support" aria-label="玛瑙的大家庭辅助案例">
      <div className="feed-graphic-editorial__support-copy">
        <p>GRAPHIC EDITORIAL / 02</p>
        <h3>《玛瑙的大家庭》</h3>
        <span>以统一的信息层级和连续阅读节奏，整理另一组移动端科普内容。</span>
      </div>
      <LongImagePreview className="feed-graphic-editorial__support-image" src={`${graphicEditorialRoot}/agate-family.jpg`} alt="《玛瑙的大家庭》完整长图辅助案例"/>
    </section>
    </div>
  </div>;
}

function ProductionSequence({stage}:{stage:StoryStage}){
  return <div data-feed-palette="2" className="feed-production-sequence">
    <div className="feed-production-sequence__backdrop" aria-hidden="true">
      <span>Content Production</span>
    </div>
    <div className="feed-production-sequence__foreground">
      <section id="content-production" data-story-stage="1" className="feed-production-sequence__intro" aria-label="内容制作 / Content Production">
        <div>
          <p className="feed-chapter-part">PART 2</p>
          <h2>内容制作</h2>
          <span>Content Production</span>
          <strong>{stage.summary}</strong>
          <ul>{stage.keywords.map(keyword=><li key={keyword}>{keyword}</li>)}</ul>
        </div>
      </section>
      {stage.assets.map((asset,assetIndex)=><section key={asset.src} data-story-stage="1" className={`feed-fixed-story__stage feed-fixed-story__stage--1 feed-fixed-story__stage--${asset.layout}`} aria-label={`内容制作前景内容 ${assetIndex+1}`}>
        {asset.pageTitle?<div className="feed-production-page__copy">
          <p>PART 2 / CONTENT PRODUCTION</p>
          <h3>{asset.pageTitle}</h3>
          {asset.pageBody?<span>{asset.pageBody}</span>:null}
          {asset.pageKeywords?<ul>{asset.pageKeywords.map(keyword=><li key={keyword}>{keyword}</li>)}</ul>:null}
        </div>:null}
        <div className="feed-fixed-story__media"><FixedStoryAsset asset={asset} index={0}/></div>
      </section>)}
      <GraphicEditorialCases/>
    </div>
  </div>;
}

function FixedStory(){
  const rootRef=useRef<HTMLDivElement>(null);
  const [current,setCurrent]=useState(0);

  useEffect(()=>{
    const root=rootRef.current;
    if(!root)return;
    const slides=Array.from(root.querySelectorAll<HTMLElement>("[data-story-stage]"));
    const boards=Array.from(root.querySelectorAll<HTMLElement>(".feed-strategy-board"));
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const node=entry.target as HTMLElement;
        node.dataset.active=entry.isIntersecting?"true":"false";
        if(entry.isIntersecting)setCurrent(Number(node.dataset.storyStage));
      });
    },{threshold:.52});
    slides.forEach(slide=>observer.observe(slide));
    const boardObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const board=entry.target as HTMLElement;
          board.dataset.active="true";
          boardObserver.unobserve(board);
        }
      });
    },{threshold:.34});
    boards.forEach(board=>boardObserver.observe(board));
    return()=>{observer.disconnect();boardObserver.disconnect();};
  },[]);

  const stage=storyStages[current];
  return <div ref={rootRef} className="feed-fixed-story" data-current={current} style={{"--story-bg":stage.color,"--story-title":stage.titleColor} as React.CSSProperties}>
    <div className="feed-fixed-story__sticky" aria-live="polite">
      <div key={`copy-${current}`} className="feed-fixed-story__copy">
        <div className="feed-fixed-story__heading">
          <span className="feed-chapter-part">PART {current+1}</span>
          <h2>{stage.title}</h2>
          {current!==1?<p lang="en">{stage.english}</p>:null}
        </div>
        <p className="feed-fixed-story__summary">{stage.summary}</p>
        <ul className="feed-fixed-story__keywords" aria-label={`${stage.title}关键词`}>
          {stage.keywords.map(keyword=><li key={keyword}>{keyword}</li>)}
        </ul>
      </div>
    </div>
    <div className="feed-fixed-story__foreground">
      {storyStages.map((item,index)=><div key={item.id} id={index!==1?item.id:undefined} className={`feed-story-part feed-story-part--${index}`}>
        {index===1?<ProductionSequence stage={item}/>:index===2?<PlanningPlatformSequence/>:<>
          {index===0?<StrategyBoards/>:null}
          {item.assets.map((asset,assetIndex)=><section key={asset.src} data-story-stage={index} className={`feed-fixed-story__stage feed-fixed-story__stage--${index} feed-fixed-story__stage--${asset.layout}`} aria-label={`${item.title} / ${item.english} ${index===0?assetIndex+3:assetIndex+1}`}>
            <div className="feed-fixed-story__media"><FixedStoryAsset asset={asset} index={0}/></div>
          </section>)}
        </>}
      </div>)}
    </div>
  </div>;
}

function CopyExpression(){
  const ref=useRef<HTMLElement>(null);
  useEffect(()=>{
    const node=ref.current;
    if(!node)return;
    const observer=new IntersectionObserver(([entry])=>{node.dataset.active=entry.isIntersecting?"true":"false";},{threshold:.32});
    observer.observe(node);
    return()=>observer.disconnect();
  },[]);
  return <section ref={ref} data-feed-palette="4" id="copywriting" className="feed-copy-evidence" aria-label="文案表达作品证据">
    <p className="feed-copy-evidence__background" aria-hidden="true">文案表达</p>
    <div className="feed-copy-evidence__layout">
      <article className="feed-copy-evidence__intro">
        <p>COPY EXPRESSION</p>
        <h2>把情绪变成<br/>可传播的文字</h2>
        <strong>围绕人物、场景与情绪片段，提炼适合社媒传播的标题、短句和正文表达。通过语气、节奏和记忆点设计，让内容更容易被理解、停留和转发。</strong>
        <ul aria-label="文案表达能力"><li>标题钩子</li><li>情绪表达</li><li>语气控制</li></ul>
      </article>
      <article className="feed-copy-evidence__proof">
        <div className="feed-copy-evidence__proof-label"><span>WRITING PROOF</span><p>豆瓣日历文案 · 真实作品</p></div>
        <div className="feed-copy-evidence__writing-sheet">
          <div className="feed-copy-evidence__lead">
            <p>你问我：电影对我来说是什么？</p>
            <span>我说：</span>
            <blockquote style={{"--quote-order":0} as React.CSSProperties}>“我的灵魂留在电影里了。”</blockquote>
          </div>
          <div className="feed-copy-evidence__quotes">
            <blockquote style={{"--quote-order":1} as React.CSSProperties}>“吸引我的不只是电影，<br/>还有看电影的自己。”</blockquote>
            <blockquote style={{"--quote-order":2} as React.CSSProperties}>“我过不够这一生，<br/>所以钻进别人的生活里。”</blockquote>
            <blockquote className="feed-copy-evidence__closing" style={{"--quote-order":3} as React.CSSProperties}>电影带我回到那个清凉轻摇，<br/>四周落霞，胶片卷轴转过的童年。</blockquote>
          </div>
          <footer>
            <p>用短句建立情绪入口，把产品从“日历”转化为观影记忆与自我投射。</p>
            <ul aria-label="文案样张能力"><li>标题进入感</li><li>画面短句</li><li>情绪记忆点</li></ul>
          </footer>
        </div>
      </article>
    </div>
  </section>;
}

export function MadeForTheFeedPoster(){
  return <main className={`feed-poster-page ${styles.page}`}>
    <FeedBackgroundLayer/>
    <div className={styles.content}>
      <DaisyHome/>
      <ShibuyaHero/>
      <FixedStory/>
      <CopyExpression/>
      <ProjectFooter href="/work/xiaoping" title="Ideas Into Campaigns" background="#7b2214" color="#fff"/>
    </div>
  </main>;
}
