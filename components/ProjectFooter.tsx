import Link from "next/link";
import styles from "./VisualArchive.module.css";

export function ProjectFooter({ href, title, background, color }: { href: string; title: string; background?: string; color?: string }) {
  return <footer className={styles.footer} style={{ background, color }}>
    <Link href="/">返回作品集</Link>
    <Link href={href}>Next project · {title}</Link>
  </footer>;
}
