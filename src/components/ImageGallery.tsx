'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, Download } from 'lucide-react';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  downloadUrl?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  unoptimized?: boolean;
}

export default function ImageGallery({ images, unoptimized = false }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const showNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  };
  const showPrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex]);

  if (!images || images.length === 0) return null;

  return (
    <div className="my-12">
      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border group hover:border-accent/40 transition-all duration-300">
              <button
                onClick={() => openLightbox(idx)}
                className="absolute inset-0 w-full h-full cursor-pointer"
                aria-label={`Zoom sur ${img.alt || img.caption || 'image'}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt || img.caption || 'Image galerie'}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={unoptimized}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 px-4 py-2 rounded-full backdrop-blur-xs flex items-center gap-1.5 shadow-lg border border-white/10">
                    <ZoomIn size={14} />
                    Zoom
                  </span>
                </div>
              </button>
              {img.downloadUrl && (
                <a
                  href={img.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Télécharger l'image"
                  className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-accent/80 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={13} />
                </a>
              )}
            </div>
            {img.caption && (
              <p className="text-center text-xs text-foreground/60 italic font-medium px-2">
                {img.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-6 transition-all duration-300"
          onClick={closeLightbox}
        >
          {/* Header */}
          <div className="flex justify-between items-center w-full z-10">
            <span className="text-white/70 font-mono text-sm">
              {selectedIndex + 1} / {images.length}
            </span>
            <div className="flex items-center gap-2">
              {images[selectedIndex].downloadUrl && (
                <a
                  href={images[selectedIndex].downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Télécharger l'image"
                  className="p-2.5 rounded-full bg-white/10 text-white hover:bg-accent/60 transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={18} />
                </a>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer shadow-lg"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div
            className="relative flex-1 flex items-center justify-center w-full my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {images.length > 1 && (
              <button
                onClick={showPrev}
                className="absolute left-2 md:left-4 z-20 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer shadow-lg select-none"
                aria-label="Image précédente"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div className="relative w-full h-full max-w-5xl max-h-[75vh] flex items-center justify-center">
              <Image
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt || 'Image zoomée'}
                fill
                sizes="100vw"
                className="object-contain select-none"
                priority
                unoptimized={unoptimized}
              />
            </div>

            {images.length > 1 && (
              <button
                onClick={showNext}
                className="absolute right-2 md:right-4 z-20 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer shadow-lg select-none"
                aria-label="Image suivante"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Caption / Footer */}
          {(images[selectedIndex].caption || images[selectedIndex].alt) && (
            <div className="text-center text-white/80 max-w-2xl mx-auto z-10 pb-2">
              <p className="text-sm md:text-base bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
                {images[selectedIndex].caption || images[selectedIndex].alt}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
