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

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <div className="space-y-0">
        <AboutSection />
        <ActivitySection />
        <UpcomingSorties />
        <AdventureStart />
        <ContactHome />
        <Testimonials />
        <BlogTeaser />
      </div>
      <Footer />
    </main>
  );
}


