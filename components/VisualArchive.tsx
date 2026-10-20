"use client";

import { assetPath } from "@/lib/assetPath";
import {useEffect,useRef,useState, type CSSProperties} from "react";
import {visualGalleryImages} from "./visualGalleryData";
import {visualSelection} from "./visualSelection";
import Image from "next/image";
import Link from "next/link";
import { Header } from "./Header";
import styles from "./VisualArchive.module.css";

export function VisualArchive({nextSlug,nextTitle}:{nextSlug:string;nextTitle:string}) {
 const images=visualGalleryImages;
 const gallery=useRef<HTMLDivElement>(null);
 useEffect(()=>{const frames=gallery.current?.querySelectorAll<HTMLElement>("figure"); if(!frames)return; const media=matchMedia("(prefers-reduced-motion: reduce)");if(media.matches)return; const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.setAttribute("data-visible","true");observer.unobserve(entry.target)}})},{threshold:0.06});frames.forEach(frame=>{if(frame.getBoundingClientRect().top>=innerHeight){frame.setAttribute("data-pending","true");observer.observe(frame)}});return()=>observer.disconnect()},[]);
 const [active,setActive]=useState<number|null>(null);
 const dialog=useRef<HTMLDialogElement>(null), touch=useRef<{x:number;y:number}|null>(null);
 const open=active!==null;
 const change=(step:number)=>setActive(v=>v===null?null:(v+step+images.length)%images.length);
 useEffect(()=>{if(!open)return;const el=dialog.current,overflow=document.body.style.overflow;el?.showModal();document.body.style.overflow="hidden";return()=>{el?.close();document.body.style.overflow=overflow}},[open]);
 let mobileTop=24,desktopBottom=0;
 const placements=visualSelection.map((item,index)=>{
 const photo=images[item.asset],mw=item.w<21?48:70,mt=mobileTop;
 mobileTop+=mw*photo.height/photo.width+28;
 desktopBottom=Math.max(desktopBottom,item.y+item.w*photo.height/photo.width);
 return {"--x":item.x+"%","--y":item.y+"vw","--w":item.w+"%","--mx":(index%2?95-mw:5)+"%","--my":mt+"vw","--mw":mw+"%"} as CSSProperties;
 });
 const gallerySize={"--desktop-height":(desktopBottom+30)+"vw","--mobile-height":mobileTop+"vw"} as CSSProperties;
 return <main className={styles.page}><Header/>
 <section className={styles.archive} aria-labelledby="visual-title">
 <div className={styles.opening}><div className={styles.backdrop}>
 <h1 id="visual-title" className={styles.openingTitle}>VISUAL NOTES</h1>
 </div></div>
 <div ref={gallery} className={styles.gallery} style={gallerySize}>{visualSelection.map((item,index)=>{
 const photo=images[item.asset];
 return <figure key={photo.src} style={placements[index]} className={styles.frame}>
 <button className={styles.photoButton} onClick={()=>setActive(item.asset)} aria-label={"查看大图："+photo.alt}>
 {photo.type==='video'?<video src={assetPath(photo.src)} poster={assetPath(photo.poster)} muted autoPlay loop playsInline preload="metadata" aria-label={photo.alt} width={photo.width} height={photo.height} onLoadedData={event=>event.currentTarget.closest("figure")?.setAttribute("data-loaded","true")} className={styles.image}/>:<Image src={assetPath(photo.src)} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width:767px) 70vw,43vw" priority={index<2} onLoad={event=>event.currentTarget.closest("figure")?.setAttribute("data-loaded","true")} className={styles.image}/>}
 <span aria-hidden="true" className={styles.hoverNote} data-tone={item.tone} data-align={item.align}><span className={styles.noteNumber}>{String(index+1).padStart(2,'0')}</span><span className={styles.noteEnglish}>{item.english}</span><span className={styles.noteChinese}>{item.label}</span></span>
 </button>{item.folio&&<figcaption className={styles.edgeCaption}><span>{item.folio}</span><span>{item.english}</span></figcaption>}</figure>})}</div></section>
 <footer className={styles.footer}><Link href="/">返回作品集</Link><Link href="/projects/brand-planning">Next project · About</Link></footer>
 <dialog ref={dialog} className={styles.viewer} aria-label="Visual 图片浏览器" onCancel={()=>setActive(null)}
 onKeyDown={e=>{if(e.key==="ArrowLeft"){e.preventDefault();change(-1)}if(e.key==="ArrowRight"){e.preventDefault();change(1)}}}
 onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}}}
 onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))change(dx<0?1:-1);touch.current=null}}>
 {active!==null&&<><button className={styles.close} aria-label="关闭大图" onClick={()=>setActive(null)} autoFocus>×</button>
 <button className={styles.previous} aria-label="上一张" onClick={()=>change(-1)}>‹</button>
 {images[active].type==='video'?<video key={images[active].src} src={assetPath(images[active].src)} poster={assetPath(images[active].poster)} muted autoPlay loop playsInline controls aria-label={images[active].alt} className={styles.fullImage}/>:<Image key={images[active].src} src={assetPath(images[active].src)} alt={images[active].alt} width={images[active].width} height={images[active].height} sizes="90vw" loading="eager" className={styles.fullImage}/>}
 <button className={styles.next} aria-label="下一张" onClick={()=>change(1)}>›</button>
 <span className={styles.counter} aria-live="polite">{String(active+1).padStart(2,"0")} / {images.length}</span></>}
 </dialog></main>;
}
