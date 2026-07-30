import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cookies } from 'next/headers';

import { client } from "@/sanity/lib/client";
import { contactQuery, activitiesQuery, settingsQuery } from "@/sanity/lib/queries";
import WhatsAppButton from "@/components/WhatsAppButton";
import CanonicalHeader from "@/components/CanonicalHeader";

import { sortActivities } from "@/utils/activity";

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

    const activeLanguage = cookieStore.get('NEXT_LOCALE')?.value || 'fr';

    return {
      metadataBase: new URL('https://la-montagne.guide'),
      title: activeLanguage === 'en' ? settingsData?.seoTitleEn : settingsData?.seoTitle,
      description: activeLanguage === 'en' ? settingsData?.seoDescriptionEn : settingsData?.seoDescription,
      icons: {
        icon: [
          { url: '/favicon.svg', type: 'image/svg+xml' }
        ]
      },
      openGraph: {
        images: settingsData?.seoImage ? [{ url: settingsData.seoImage }] : [],
      },
    };
  } catch {
    return {
      title: "La Montagne Guide",
      description: "Nicolas Draperi - Guide de Haute Montagne",
      icons: {
        icon: [
          { url: '/favicon.svg', type: 'image/svg+xml' }
        ]
      }
    };
  }
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import ScrollToTop from "@/components/ScrollToTop";

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
  const sortedActivities = sortActivities(activitiesData, settingsData?.activitiesOrder);

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
            {settingsData && (
              <style dangerouslySetInnerHTML={{ __html: `
                :root {
                  ${settingsData.accentColor ? `--accent: ${settingsData.accentColor} !important;` : ''}
                  ${settingsData.highlightColor ? `--highlight: ${settingsData.highlightColor} !important;` : ''}
                  ${settingsData.btnHoverColor ? `--btn-hover: ${settingsData.btnHoverColor} !important;` : ''}
                  ${settingsData.textColorLight ? `--foreground: ${settingsData.textColorLight} !important;` : ''}
                  ${settingsData.titleColorLight ? `--title-color: ${settingsData.titleColorLight} !important;` : ''}
                }
                [data-theme='dark'] {
                  ${settingsData.textColorDark ? `--foreground: ${settingsData.textColorDark} !important;` : ''}
                  ${settingsData.titleColorDark ? `--title-color: ${settingsData.titleColorDark} !important;` : ''}
                }
              ` }} />
            )}
            <CanonicalHeader />
            <AnnouncementBanner settings={settingsData} />
            <Navbar sanityActivities={sortedActivities} settingsData={settingsData} />
            {children}
            <Footer contactData={contactData} settingsData={settingsData} />
            <WhatsAppButton
              phoneNumber={phoneNumber}
              whatsappNumber={whatsappNumber}
              whatsappText={whatsappText}
            />
            <ScrollToTop />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
