import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sorties = [
  {
    title: 'Escalade à Taghia',
    location: 'Atlas, Maroc',
    date: 'Automne 2024',
    duration: '8 jours',
    price: '1400€',
    description: 'Venez grimper sur le plus beau calcaire du monde dans un cadre berbère authentique.',
    image: '/photos/P1050811.JPG'
  },
  {
    title: 'Voies Bédouines',
    location: 'Wadi-Rum, Jordanie',
    date: 'Printemps 2025',
    duration: '9 jours',
    price: '1950€',
    description: 'Une immersion totale dans le désert rouge, entre escalade traditionnelle et culture locale.',
    image: '/photos/P1070196.JPG'
  }
]

export default function SortiesPage() {
  return (
    <main className="relative pt-32 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-gradient">PROCHAINS DÉPARTS</h1>
        <p className="text-foreground/60 text-lg mb-16 max-w-2xl">
          Rejoignez-moi pour ces aventures d'exception aux quatre coins du monde.
        </p>
        
        <div className="space-y-12">
          {sorties.map((s, index) => (
            <div key={s.title} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center glass p-8 md:p-12 rounded-[60px]`}>
              <div className="w-full lg:w-1/2 aspect-video rounded-[40px] overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${s.image}')` }}
                />
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1 bg-highlight/20 text-highlight rounded-full text-sm font-bold uppercase tracking-wider">{s.date}</span>
                  <span className="text-foreground/40 font-bold uppercase tracking-wider text-xs">{s.location}</span>
                </div>
                <h3 className="text-4xl font-bold">{s.title}</h3>
                <p className="text-foreground/60 text-lg leading-relaxed">{s.description}</p>
                
                <div className="grid grid-cols-2 gap-8 py-6 border-y border-foreground/5">
                  <div>
                    <p className="text-sm text-foreground/40 uppercase tracking-widest font-bold">Durée</p>
                    <p className="text-2xl font-bold">{s.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/40 uppercase tracking-widest font-bold">Budget est.</p>
                    <p className="text-2xl font-bold">{s.price}</p>
                  </div>
                </div>
                
                <button className="btn-primary w-full md:w-auto">Demander le programme détaillé</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
