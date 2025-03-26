import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import styles from "./layout.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Agent Admin Panel",
  description: "Admin panel for managing AI agents, customer profiles, and payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <div className={styles.container}>
          <div className={styles.sidebarContainer}>
            <Sidebar />
          </div>
          <div className={styles.mainContainer}>
            <Header />
            <main className={styles.contentArea}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
