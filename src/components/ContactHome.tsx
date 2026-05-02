import React from 'react'
import Link from 'next/link'

const ContactHome = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="glass rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          {/* Background effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/20 to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent rounded-full blur-[150px] opacity-10 pointer-events-none" />
          
          <div className="relative z-10">
            <span className="text-accent font-black tracking-[0.3em] uppercase text-xs mb-6 block">Vous avez un projet ?</span>
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter mb-10 leading-none uppercase">
              VIVONS <br /> <span className="text-accent italic">L'EXCEPTIONNEL</span>
            </h2>
            <p className="text-foreground/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Pour toute demande personnalisée, devis ou simple question, n'hésitez pas à me contacter directement. Je reviendrai vers vous rapidement pour organiser votre aventure.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <Link href="/contact" className="btn-primary px-12 py-5 text-lg shadow-2xl hover:scale-105 transition-transform">
                Contactez-moi
              </Link>
              <div className="flex flex-col items-start md:items-start text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Directement par téléphone</p>
                <p className="text-2xl font-black text-foreground">06 75 07 97 08</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactHome
