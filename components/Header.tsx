import Link from "next/link";
import { DaisyHome } from "./DaisyHome";

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="identity">张炎 / Yan Zhang <span>内容策划 · 新媒体运营</span></Link>
      <DaisyHome />
    </header>
  );
}
