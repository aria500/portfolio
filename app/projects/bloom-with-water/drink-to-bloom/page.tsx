import type { Metadata } from "next";
import { DrinkToBloom } from "@/components/DrinkToBloom";

export const metadata: Metadata = {
  description: "把每日饮水转化为花朵生长。一个由人做判断、与 AI 协作实现的轻量互动体验。",
};

export default function DrinkToBloomPage() {
  return <DrinkToBloom />;
}
