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
  title: "Yan Zhang — Portfolio",
  icons: {
    icon: [
      { url: "/portfolio/icons/favicon-16.png?v=flower-transparent-2", sizes: "16x16", type: "image/png" },
      { url: "/portfolio/icons/favicon-32.png?v=flower-transparent-2", sizes: "32x32", type: "image/png" },
      { url: "/portfolio/icons/favicon-48.png?v=flower-transparent-2", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/portfolio/favicon.ico?v=flower-transparent-2",
  },
  description: "广告学背景，关注内容策划、品牌表达与 AI 辅助创作。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${archivo.variable} ${instrument.variable}`}>{children}</body>
    </html>
  );
}
