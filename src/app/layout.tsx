import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cookies } from 'next/headers';

import { client } from "@/sanity/lib/client";
import { contactQuery, activitiesQuery, settingsQuery } from "@/sanity/lib/queries";
import WhatsAppButton from "@/components/WhatsAppButton";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [settingsData, cookieStore] = await Promise.all([
      client.fetch(settingsQuery),
      cookies(),
    ]);
    const lang = cookieStore.get('language')?.value || 'fr';
    
    const title = lang === 'en' && settingsData?.seoTitleEn 
      ? settingsData.seoTitleEn 
      : (settingsData?.seoTitle || "La Montagne Guide | Nicolas Draperi");
      
    const description = lang === 'en' && settingsData?.seoDescriptionEn 
      ? settingsData.seoDescriptionEn 
      : (settingsData?.seoDescription || "Guide de Haute Montagne Nicolas Draperi. Alpinisme, ski de randonnée, escalade et voyages.");

    return {
      title,
      description,
      openGraph: settingsData?.seoImage ? {
        images: [{ url: settingsData.seoImage }],
      } : undefined,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "La Montagne Guide | Nicolas Draperi",
      description: "Guide de Haute Montagne Nicolas Draperi. Alpinisme, ski de randonnée, escalade et voyages.",
    };
  }
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import AnnouncementBanner from "@/components/AnnouncementBanner";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [contactData, activitiesData, settingsData] = await Promise.all([
    client.fetch(contactQuery),
    client.fetch(activitiesQuery),
    client.fetch(settingsQuery)
  ]);
  const phoneNumber = contactData?.phone;
  const whatsappNumber = settingsData?.whatsappNumber;
  const whatsappText = settingsData?.whatsappText;

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
            <AnnouncementBanner settings={settingsData} />
            <Navbar sanityActivities={activitiesData} />
            {children}
            <Footer contactData={contactData} settingsData={settingsData} />
            <WhatsAppButton 
              phoneNumber={phoneNumber} 
              whatsappNumber={whatsappNumber} 
              whatsappText={whatsappText} 
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
