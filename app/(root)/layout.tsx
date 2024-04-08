import { ClerkProvider } from "@clerk/nextjs"

import { Inter } from "next/font/google";

import "../globals.css";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Bottombar from "@/components/shared/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Threads',
  description: 'A next.js Meta Threads Application'
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body className={inter.className}>
          <Topbar />
          <main className="flex flex-row">
            <LeftSidebar />

              <section className="main-container">
                <div className="w-full max-w-4xl">
                  {children}
                </div>
              </section>

            <RightSidebar />
          </main>

          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
