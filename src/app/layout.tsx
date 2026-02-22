import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InjuryStoreProvider } from "@/lib/store";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScarMap Forensics",
  description: "Secure Forensic Mapping Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased text-neutral-900 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-900 min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <InjuryStoreProvider>
            {children}
          </InjuryStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
