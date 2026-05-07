import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

import { client } from "@/sanity/lib/client";
import { contactQuery } from "@/sanity/lib/queries";
import WhatsAppButton from "@/components/WhatsAppButton";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "La Montagne Guide | Nicolas Draperi",
  description: "Guide de Haute Montagne Nicolas Draperi. Alpinisme, ski de randonnée, escalade et voyages.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contactData = await client.fetch(contactQuery);
  const phoneNumber = contactData?.phone;

  return (
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth" className={`${outfit.variable} antialiased scroll-smooth`}>
      <body className="bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <Navbar />
            {children}
            <Footer contactData={contactData} />
            <WhatsAppButton phoneNumber={phoneNumber} />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
