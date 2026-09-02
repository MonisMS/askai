import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "AskAI — meet with an AI agent",
  description:
    "Create an AI agent, meet it on video, and get a transcript and summary when the call ends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <Toaster/>
        {children}
      </body>
    </html>
    </TRPCReactProvider>
  );
}
