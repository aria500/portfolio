import type { Metadata } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-sans" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "张炎 / Yan Zhang — 内容策划 · 新媒体运营",
  description: "广告学背景，关注内容策划、品牌表达与 AI 辅助创作。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${archivo.variable} ${instrument.variable}`}>{children}</body>
    </html>
  );
}
