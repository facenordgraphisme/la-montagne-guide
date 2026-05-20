import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ActivitySection from "@/components/ActivitySection";
import AboutSection from "@/components/AboutSection";
import UpcomingSorties from "@/components/UpcomingSorties";
import AdventureStart from "@/components/AdventureStart";
import ContactHome from "@/components/ContactHome";
import Testimonials from "@/components/Testimonials";
import BlogTeaser from "@/components/BlogTeaser";
import Footer from "@/components/Footer";
import PartnersSlider from "@/components/PartnersSlider";

import { client } from "@/sanity/lib/client";
import { homeQuery, sortiesQuery, testimonialsQuery, blogTeaserQuery, activitiesQuery, settingsQuery } from "@/sanity/lib/queries";

export default async function Home() {
  const homeData = await client.fetch(homeQuery);
  const limit = homeData?.featuredPostsLimit || 3;
  const [sortiesData, testimonialsData, blogTeaserData, activitiesData, settingsData] = await Promise.all([
    client.fetch(sortiesQuery),
    client.fetch(testimonialsQuery),
    client.fetch(blogTeaserQuery, { limit }),
    client.fetch(activitiesQuery),
    client.fetch(settingsQuery)
  ]);

  return (
    <main className="relative">
      <Hero 
        title={homeData?.heroTitle}
        subtitle={homeData?.heroSubtitle}
        description={homeData?.heroDescription}
        images={homeData?.heroImages}
      />
      <div className="space-y-0">
        <AboutSection 
          badge={homeData?.aboutBadge}
          title={homeData?.aboutTitle}
          titleAccent={homeData?.aboutTitleAccent}
          description={homeData?.aboutDescription}
          image={homeData?.aboutImage}
          experience={homeData?.experienceYears}
          className="bg-background"
        />
        <ActivitySection 
          title={homeData?.activitiesTitle}
          titleAccent={homeData?.activitiesTitleAccent}
          description={homeData?.activitiesDescription}
          data={activitiesData}
          className="bg-surface"
        />
        <UpcomingSorties 
          data={sortiesData} 
          badge={homeData?.sortiesBadge}
          title={homeData?.sortiesTitle}
          titleAccent={homeData?.sortiesTitleAccent}
          className="bg-background"
        />
        <AdventureStart 
          badge={homeData?.adventureBadge}
          title={homeData?.adventureTitle}
          titleAccent={homeData?.adventureTitleAccent}
          description={homeData?.adventureDescription}
          features={homeData?.adventureFeatures}
          image={homeData?.adventureImage}
          className="bg-surface"
        />
        <ContactHome 
          badge={homeData?.contactBadge}
          title={homeData?.contactTitle}
          titleAccent={homeData?.contactTitleAccent}
          description={homeData?.contactDescription}
        />
        {!homeData?.hideTestimonials && (
          <Testimonials 
            data={testimonialsData} 
            badge={homeData?.testimonialsBadge}
            title={homeData?.testimonialsTitle}
            titleAccent={homeData?.testimonialsTitleAccent}
            className="bg-surface"
          />
        )}
        {!homeData?.hideBlog && (
          <BlogTeaser 
            data={blogTeaserData} 
            badge={homeData?.blogBadge}
            title={homeData?.blogTitle}
            titleAccent={homeData?.blogTitleAccent}
            className="bg-background"
          />
        )}
        {!settingsData?.hidePartners && (
          <PartnersSlider partners={settingsData?.partners} />
        )}
      </div>
    </main>
  );
}
