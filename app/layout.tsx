import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/StoreProvider";
import ConditionalNav from "@/components/ConditionalNav";
import CartInitializer from "@/components/CartInitializer";
import AuthChecker from "@/components/AuthChecker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market",
  description: "Online marketplace",
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <AuthChecker />
          <CartInitializer />
          <ConditionalNav>
            {children}
          </ConditionalNav>
        </StoreProvider>
      </body>
    </html>
  );
}
