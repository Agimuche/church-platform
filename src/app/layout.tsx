import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Brook Church | An Unfolding Story of God's Grace",
  description:
    "Welcome to The Brook Church, Calabar. Watch live services (Phronesis & Doxa), explore the sermon archive, access ELDAD daily devotionals and the TBC store, request prayer or counseling, and give online.",
  keywords: [
    "The Brook Church",
    "Pastor Ose Imiemohon",
    "Pastor Naomi Imiemohon",
    "The Brook Church Calabar",
    "Phronesis",
    "Doxa",
    "Pneumatology",
    "ELDAD Devotional",
    "TBC Store",
    "Calabar Church",
  ],
  icons: {
    icon: [
      { url: "/logo.jpg", sizes: "any" },
    ],
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "The Brook Church | An Unfolding Story of God's Grace",
    description: "Welcome to The Brook Church, Calabar — on purpose manifesting zoe.",
    images: [{ url: "/logo.jpg", width: 1024, height: 1024 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "The Brook Church",
    description: "...on purpose manifesting zoe",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink selection:bg-accent/20 selection:text-accent">
        <ThemeProvider>
          <AuthProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
