"use client";

import { assetPath } from "@/lib/assetPath";

import { useEffect, useRef, type CSSProperties } from "react";
import styles from "./BloomFlowerHero.module.css";

const flowers = ["01-green", "02-purple", "03-blue", "04-daisy-purple", "05-tulip", "06-daisy-yellow", "07-pink", "08-crocus"];
// Restore the approved composition; top-edge clearance is handled in CSS only.
const placements = [
  [2,5,165], [17,12,125], [30,4,190], [44,14,140], [58,4,155], [72,11,120], [85,3,175], [99,12,210],
  [0,29,150], [17,30,150], [87,32,130], [100,47,175], [0,56,220], [15,65,115], [88,64,155], [100,76,130],
  [1,96,150], [16,89,140], [29,99,210], [43,84,120], [58,98,160], [70,86,135], [84,100,160], [98,96,175],
];

export function BloomFlowerHero() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current!;
    const observer = new IntersectionObserver(([entry]) => { node.dataset.running = String(entry.isIntersecting); });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <section ref={ref} data-editorial-chapter className={styles.hero} aria-labelledby="bloom-title">
    <div className={styles.field} aria-hidden="true">
      {placements.map(([x,y,size], i) => <div key={i} className={styles.plant} style={{
        "--x":`${x}%`, "--y":`${y}%`, "--size":`${size}px`, "--delay":`${(i * 7 % 24) * 35}ms`,
        "--duration":`${7 + i % 5 * 1.3}s`, "--drift":`${i % 2 ? 4 : -4}px`, "--phase":`${-i * .71}s`,
      } as CSSProperties}><div className={styles.arrival}><div className={styles.drift}><img src={assetPath(`/projects/drink-to-bloom/flowers/${flowers[i % 8]}.png`)} alt="" width="1024" height="1024" decoding="async"/></div></div></div>)}
    </div>
    <div className={styles.copy}>
      <h1 id="bloom-title">DRINK TO BLOOM</h1>
      <p>好好喝水，<br/>让生活开出花来。</p>
      <small>个人 AI 产品实验　·　2026.08–至今　·　产品概念 / 交互逻辑 / 视觉系统 / AI 协作迭代</small>
      <a className={styles.liveLink} href="https://aria500.github.io/waterflower/?v=14days-final" target="_blank" rel="noopener noreferrer">在线体验 ↗</a>
    </div>
  </section>;
}
