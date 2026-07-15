import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "노동노트 | 노동 이슈와 5분 스터디";
  const description = "노동 관련 법령, 중요 판례와 실무형 5분 스터디를 공식 출처와 함께 읽는 노동법 브리핑.";

  return {
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ko_KR",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "노동노트 — 오늘의 노동 이슈, 실무의 언어로 읽다." }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
