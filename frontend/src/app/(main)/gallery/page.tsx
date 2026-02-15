'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Calendar, Filter, ZoomIn } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { galleryApi } from '@/lib/api';

interface GalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  eventName?: string;
  date: string;
}

const categories = ['All', 'Events', 'Workshops', 'Hackathons', 'Meetups', 'Awards'];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await galleryApi.getAll({ category: category !== 'All' ? category : undefined });
        setImages(response.data.images || mockImages);
      } catch (error) {
        setImages(mockImages);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [category]);

  const filteredImages = category === 'All'
    ? images
    : images.filter(img => img.category === category);

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(prev => prev === 0 ? filteredImages.length - 1 : (prev as number) - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(prev => prev === filteredImages.length - 1 ? 0 : (prev as number) + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex(prev => prev === 0 ? filteredImages.length - 1 : (prev as number) - 1);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex(prev => prev === filteredImages.length - 1 ? 0 : (prev as number) + 1);
      } else if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, filteredImages.length]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-nexus-bg">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-pink w-96 h-96 top-1/4 left-1/4" />
          <div className="orb orb-blue w-96 h-96 bottom-1/4 right-1/4" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-30" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge color="pink" className="mb-6">Gallery</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-nexus-text">
              Our <span className="gradient-text">Memories</span>
            </h1>
            <p className="text-xl text-nexus-text-secondary">
              Capturing the best moments from our events, workshops, and community gatherings
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-nexus-bg relative overflow-hidden border-b border-nexus-border">
        <div className="container-custom relative z-10">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${category === cat
                  ? 'bg-gradient-to-r from-[#FF4FD8] to-[#7B61FF] text-nexus-text shadow-glow-pink'
                  : 'bg-nexus-glass text-nexus-text-secondary hover:bg-nexus-glass hover:text-nexus-text border border-nexus-border'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-nexus-bg relative min-h-screen">
        {/* Background Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-cyan w-full h-96 bottom-0 left-0 opacity-10" />
        </div>

        <div className="container-custom relative z-10 w-full">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-nexus-glass">
                  <Skeleton className="w-full h-full bg-nexus-glass" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              <AnimatePresence mode='popLayout'>
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="group relative cursor-pointer break-inside-avoid"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <div className="aspect-square relative rounded-2xl overflow-hidden glass border border-nexus-border">
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <Badge color="pink" size="sm" className="mb-2 self-start">{image.category}</Badge>
                        <h3 className="text-nexus-text font-bold text-lg leading-tight mb-1">{image.title}</h3>
                        {image.eventName && <p className="text-nexus-text/70 text-sm mb-2">{image.eventName}</p>}
                        <div className="flex items-center gap-2 text-white/50 text-xs mt-auto">
                          <Calendar className="w-3 h-3" />
                          <span>{image.date}</span>
                        </div>
                      </div>

                      {/* Zoom Icon */}
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <ZoomIn className="w-5 h-5 text-nexus-text" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 p-2 rounded-full bg-nexus-glass hover:bg-white/20 text-nexus-text z-50 transition-colors"
              onClick={() => setSelectedImageIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-nexus-glass hover:bg-white/20 text-nexus-text z-50 transition-colors hidden md:block"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-nexus-glass hover:bg-white/20 text-nexus-text z-50 transition-colors hidden md:block"
              onClick={handleNext}
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image Container */}
            <motion.div
              layoutId={`image-${filteredImages[selectedImageIndex].id}`}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[selectedImageIndex].imageUrl}
                alt={filteredImages[selectedImageIndex].title}
                className="w-auto h-auto max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
              />

              <div className="mt-6 text-center text-nexus-text">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Badge color="pink">{filteredImages[selectedImageIndex].category}</Badge>
                  <span className="text-white/50 text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {filteredImages[selectedImageIndex].date}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-1">{filteredImages[selectedImageIndex].title}</h2>
                {filteredImages[selectedImageIndex].eventName && (
                  <p className="text-lg text-nexus-text/70">{filteredImages[selectedImageIndex].eventName}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Mock data with real Unsplash images
const mockImages: GalleryImage[] = [
  // Workshops (Tech/Coding/Classroom)
  {
    id: '1',
    title: 'AI Workshop Participants',
    category: 'Workshops',
    eventName: 'ML Workshop 2024',
    date: 'March 15, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=800&fit=crop'
  },
  {
    id: '2',
    title: 'Hands-on Coding Session',
    category: 'Workshops',
    eventName: 'Python Bootcamp',
    date: 'March 14, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop'
  },

  // Hackathons (Coding/Teamwork/Night)
  {
    id: '3',
    title: 'Hackathon Winners',
    category: 'Hackathons',
    eventName: 'AI Hackathon 2024',
    date: 'Feb 28, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=800&fit=crop'
  },
  {
    id: '4',
    title: 'Brainstorming Session',
    category: 'Hackathons',
    eventName: 'Code Rush 2024',
    date: 'Feb 27, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=800&fit=crop'
  },

  // Events (Auditorium/Microphone/Stage)
  {
    id: '5',
    title: 'Tech Talk Speaker',
    category: 'Events',
    eventName: 'Future of AI Summit',
    date: 'Feb 20, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&h=800&fit=crop'
  },
  {
    id: '6',
    title: 'Audience Q&A',
    category: 'Events',
    eventName: 'Tech Seminar',
    date: 'Feb 19, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=800&fit=crop'
  },

  // Awards (Trophy/Certificate/Celebration)
  {
    id: '7',
    title: 'Best Project Award',
    category: 'Awards',
    eventName: 'Project Showcase',
    date: 'Jan 28, 2024',
    imageUrl: 'https://marathon.in/wp-content/uploads/2023/08/untitled-1.jpg'
  },
  {
    id: '8',
    title: 'Certificate Distribution',
    category: 'Awards',
    eventName: 'Annual Ceremony',
    date: 'Jan 28, 2024',
    imageUrl: 'https://www.shutterstock.com/image-vector/receiving-award-icon-vector-260nw-9409138.jpg'
  },

  // Meetups (Casual/Coffee/Networking)
  {
    id: '9',
    title: 'Community Meetup',
    category: 'Meetups',
    eventName: 'Monthly Gathering',
    date: 'Jan 15, 2024',
    imageUrl: 'https://www.meetup.com/blog/wp-content/uploads/2022/01/pexels-matheus-bertelli-3856033-945x630.jpg'
  },
  {
    id: '10',
    title: 'Networking Session',
    category: 'Meetups',
    eventName: 'Dev Meetup',
    date: 'Jan 15, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=800&fit=crop'
  },

  // More Images
  {
    id: '11',
    title: 'Closing Ceremony',
    category: 'Events',
    eventName: 'Tech Fest',
    date: 'Dec 20, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=800&fit=crop'
  },
  {
    id: '12',
    title: 'Code Review',
    category: 'Workshops',
    eventName: 'Peer Learning',
    date: 'Dec 10, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=800&fit=crop'
  },
];
