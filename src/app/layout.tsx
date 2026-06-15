import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LifeCheck",
  description: "Pénzügyi nyomkövető – Bende Mátyás",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className={`${geist.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <div className="max-w-2xl mx-auto pb-24 min-h-screen">
          {children}
        </div>
        <Navigation />
      </body>
    </html>
  );
}
