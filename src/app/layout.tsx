import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TaskFlow — Project Management SaaS",
    template: "%s | TaskFlow",
  },
  description:
    "TaskFlow is a powerful project management platform for teams. Organize tasks, collaborate with members, and ship faster.",
  keywords: ["project management", "task tracker", "team collaboration", "saas"],
  openGraph: {
    title: "TaskFlow — Project Management SaaS",
    description:
      "TaskFlow is a powerful project management platform for teams.",
    type: "website",
    locale: "en_US",
    siteName: "TaskFlow",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}
