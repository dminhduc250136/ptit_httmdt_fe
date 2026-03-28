import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/layout/AppChrome";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LaptopVerse — Laptop High-end Chính Hãng",
  description:
    "LaptopVerse - Chuyên cung cấp Laptop Gaming, Laptop Văn phòng và MacBook cao cấp. Bảo hành chính hãng, giao hàng toàn quốc.",
  keywords: [
    "laptop gaming",
    "macbook",
    "laptop văn phòng",
    "laptop cao cấp",
    "laptop chính hãng",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <CartProvider>
          <AppChrome>{children}</AppChrome>
        </CartProvider>
      </body>
    </html>
  );
}
