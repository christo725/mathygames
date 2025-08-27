import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Number Island Adventure - Math Game for Kids",
  description: "Explore magical islands and solve math challenges in this exciting adventure game for 3rd and 4th graders!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.className} antialiased bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
