import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../_metronic/assets/sass/style.scss";
import "../_metronic/assets/fonticon/fonticon.css";
import "../_metronic/assets/keenicons/duotone/style.css";
import "../_metronic/assets/keenicons/outline/style.css";
import "../styles/global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Truck",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
