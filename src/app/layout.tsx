import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import CartSidebar from "@/components/cart/CartSidebar";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frazer BMT - Premium Industrial & Building Materials",
  description: "Leading supplier of HVAC, valves, electrical, plumbing and industrial materials in UAE",
  icons: {
    icon: [
      { url: '/frazer-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/frazer-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
            {children}
          </div>
          <CartSidebar />
        </Providers>
      </body>
    </html>
  );
}
