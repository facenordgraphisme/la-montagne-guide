import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogPage() {
  return (
    <main className="relative pt-32 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12">BLOG</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Placeholder for blog posts from Sanity */}
          <div className="glass p-8 rounded-3xl h-64 flex flex-col justify-end">
            <div className="text-accent text-sm font-bold mb-2">PROCHAINEMENT</div>
            <h3 className="text-2xl font-bold">Articles en cours de rédaction...</h3>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
