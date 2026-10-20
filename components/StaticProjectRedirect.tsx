"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/** Keep legacy project URLs functional on hosts without a redirect server. */
export function StaticProjectRedirect({ href }: { href: string }) {
  const router = useRouter();
  useEffect(() => { router.replace(href); }, [href, router]);
  return <Link href={href}>打开项目 ↗</Link>;
}
