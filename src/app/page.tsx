import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ActivitySection from "@/components/ActivitySection";
import AboutSection from "@/components/AboutSection";
import UpcomingSorties from "@/components/UpcomingSorties";
import AdventureStart from "@/components/AdventureStart";
import ContactHome from "@/components/ContactHome";
import Testimonials from "@/components/Testimonials";
import BlogTeaser from "@/components/BlogTeaser";
import FAQAccordion from "@/components/FAQAccordion";
import Footer from "@/components/Footer";
import PartnersSlider from "@/components/PartnersSlider";

import { client } from "@/sanity/lib/client";
import { homeQuery, sortiesQuery, testimonialsQuery, blogTeaserQuery, activitiesQuery, settingsQuery, faqsQuery } from "@/sanity/lib/queries";
import { getServerTranslations } from '@/i18n/server';
import { sortActivities } from "@/utils/activity";

export default async function Home() {
  const homeData = await client.fetch(homeQuery);
  const { at, translatePortableText, lang } = await getServerTranslations();
  const limit = homeData?.featuredPostsLimit || 3;
  const [sortiesData, testimonialsData, blogTeaserData, activitiesData, settingsData, faqsData] = await Promise.all([
    client.fetch(sortiesQuery),
    client.fetch(testimonialsQuery),
    client.fetch(blogTeaserQuery, { limit }),
    client.fetch(activitiesQuery),
    client.fetch(settingsQuery),
    client.fetch(faqsQuery)
  ]);

  const sortedActivities = sortActivities(activitiesData, settingsData?.activitiesOrder);

  // Filter FAQs by selected categories (if any configured in settings)
  const allowedCategories: string[] | null = settingsData?.homeFaqCategories?.length
    ? settingsData.homeFaqCategories.filter(Boolean)
    : null;
  const filteredFaqs = allowedCategories
    ? faqsData?.filter((faq: any) => allowedCategories.includes(faq.category))
    : faqsData;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": settingsData?.siteName || "La Montagne Guide | Nicolas Draperi",
    "image": settingsData?.seoImage || undefined,
    "telephone": settingsData?.phone || undefined,
    "email": settingsData?.email || undefined,
    "address": settingsData?.address ? {
      "@type": "PostalAddress",
      "streetAddress": settingsData.address
    } : undefined,
    "priceRange": "$$",
    "sameAs": [
      settingsData?.instagram,
      settingsData?.facebook,
      settingsData?.youtube
    ].filter(Boolean)
  };

  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        title={at({ fr: homeData?.heroTitle, en: homeData?.heroTitleEn })}
        subtitle={at({ fr: homeData?.heroSubtitle, en: homeData?.heroSubtitleEn })}
        description={translatePortableText({ fr: homeData?.heroDescription, en: homeData?.heroDescriptionEn })}
        images={homeData?.heroImages}
        textAlign={homeData?.heroTextAlign}
        btnDiscoverText={homeData?.heroBtnDiscoverText}
        btnDiscoverTextEn={homeData?.heroBtnDiscoverTextEn}
        btnDeparturesText={homeData?.heroBtnDeparturesText}
        btnDeparturesTextEn={homeData?.heroBtnDeparturesTextEn}
      />
      <div className="space-y-0">
        <AboutSection
          badge={at({ fr: homeData?.aboutBadge, en: homeData?.aboutBadgeEn })}
          title={at({ fr: homeData?.aboutTitle, en: homeData?.aboutTitleEn })}
          titleAccent={at({ fr: homeData?.aboutTitleAccent, en: homeData?.aboutTitleAccentEn })}
          description={translatePortableText({ fr: homeData?.aboutDescription, en: homeData?.aboutDescriptionEn })}
          image={homeData?.aboutImage}
          experience={homeData?.experienceYears}
          className="bg-background"
        />
        <ActivitySection
          title={at({ fr: homeData?.activitiesTitle, en: homeData?.activitiesTitleEn })}
          titleAccent={at({ fr: homeData?.activitiesTitleAccent, en: homeData?.activitiesTitleAccentEn })}
          description={translatePortableText({ fr: homeData?.activitiesDescription, en: homeData?.activitiesDescriptionEn })}
          data={sortedActivities}
          className="bg-surface"
        />
        {!homeData?.hideSorties && (
          <UpcomingSorties
            data={sortiesData}
            badge={at({ fr: homeData?.sortiesBadge, en: homeData?.sortiesBadgeEn })}
            title={at({ fr: homeData?.sortiesTitle, en: homeData?.sortiesTitleEn })}
            titleAccent={at({ fr: homeData?.sortiesTitleAccent, en: homeData?.sortiesTitleAccentEn })}
            className="bg-background"
          />
        )}
        {!homeData?.hideAdventure && (
          <AdventureStart
            badge={at({ fr: homeData?.adventureBadge, en: homeData?.adventureBadgeEn })}
            title={at({ fr: homeData?.adventureTitle, en: homeData?.adventureTitleEn })}
            titleAccent={at({ fr: homeData?.adventureTitleAccent, en: homeData?.adventureTitleAccentEn })}
            description={translatePortableText({ fr: homeData?.adventureDescription, en: homeData?.adventureDescriptionEn })}
            features={lang === 'en' && homeData?.adventureFeaturesEn?.length ? homeData.adventureFeaturesEn : homeData?.adventureFeatures}
            image={homeData?.adventureImage}
            className="bg-surface"
          />
        )}
        <ContactHome
          badge={at({ fr: homeData?.contactBadge, en: homeData?.contactBadgeEn })}
          title={at({ fr: homeData?.contactTitle, en: homeData?.contactTitleEn })}
          titleAccent={at({ fr: homeData?.contactTitleAccent, en: homeData?.contactTitleAccentEn })}
          description={translatePortableText({ fr: homeData?.contactDescription, en: homeData?.contactDescriptionEn })}
        />
        {!homeData?.hideTestimonials && (
          <Testimonials
            data={testimonialsData}
            badge={at({ fr: homeData?.testimonialsBadge, en: homeData?.testimonialsBadgeEn })}
            title={at({ fr: homeData?.testimonialsTitle, en: homeData?.testimonialsTitleEn })}
            titleAccent={at({ fr: homeData?.testimonialsTitleAccent, en: homeData?.testimonialsTitleAccentEn })}
            className="bg-surface"
          />
        )}
        {!homeData?.hideBlog && (
          <BlogTeaser
            data={blogTeaserData}
            badge={at({ fr: homeData?.blogBadge, en: homeData?.blogBadgeEn })}
            title={at({ fr: homeData?.blogTitle, en: homeData?.blogTitleEn })}
            titleAccent={at({ fr: homeData?.blogTitleAccent, en: homeData?.blogTitleAccentEn })}
            className="bg-background"
          />
        )}
        <FAQAccordion faqs={filteredFaqs} />
        {!settingsData?.hidePartners && (
          <PartnersSlider partners={settingsData?.partners} />
        )}
      </div>
    </main>
  );
}
