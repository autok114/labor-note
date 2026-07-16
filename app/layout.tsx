import type { Metadata } from "next";
import "./globals.css";

export function generateMetadata(): Metadata {
  const title = "노동노트 | 노동 이슈와 5분 스터디";
  const description = "노동 관련 법령, 중요 판례와 실무형 5분 스터디를 공식 출처와 함께 읽는 노동법 브리핑.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ko_KR",
    },
    twitter: { card: "summary", title, description },
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
