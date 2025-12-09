import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "History - 역사 공부, 이제는 재미있게",
  description: "학습지를 게임으로 바꿔주는 AI 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`antialiased`}
      >
        <Header />
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#F9F8F6',
              color: '#2D2A26',
              border: '1px solid #EFE9E3',
            },
          }}
        />
      </body>
    </html>
  );
}

