'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Calendar, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

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

  const handlePrevious = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    setSelectedImage(filteredImages[prevIndex]);
  };

  const handleNext = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(filteredImages[nextIndex]);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pattern-grid opacity-10" />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <Badge color="white" className="bg-white/20 text-white mb-6">Gallery</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Photo Gallery
            </h1>
            <p className="text-xl text-white/80">
              Memories from our events, workshops, and moments of celebration
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 lg:top-20 z-30">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : filteredImages.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group ${
                    index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white/30" />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end">
                    <div className="p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 w-full">
                      <p className="text-white font-medium line-clamp-1">{image.title}</p>
                      <p className="text-white/70 text-sm">{image.eventName}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No images found
              </h3>
              <p className="text-gray-500">
                Check back later for new photos
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
              className="absolute left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[80vh] relative"
            >
              <div className="aspect-video bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-24 h-24 text-white/30" />
              </div>
              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
                <p className="text-white/70 mt-1">
                  {selectedImage.eventName} • {selectedImage.date}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Mock data
const mockImages: GalleryImage[] = [
  { id: '1', title: 'AI Workshop Participants', category: 'Workshops', eventName: 'ML Workshop 2024', date: 'March 15, 2024', imageUrl: '' },
  { id: '2', title: 'Hackathon Winners', category: 'Hackathons', eventName: 'AI Hackathon 2024', date: 'March 10, 2024', imageUrl: '' },
  { id: '3', title: 'Monthly Meetup', category: 'Meetups', eventName: 'AI Club Meetup', date: 'March 5, 2024', imageUrl: '' },
  { id: '4', title: 'Guest Speaker Session', category: 'Events', eventName: 'Industry Talk', date: 'March 1, 2024', imageUrl: '' },
  { id: '5', title: 'Club Award Ceremony', category: 'Awards', eventName: 'Annual Awards 2024', date: 'Feb 28, 2024', imageUrl: '' },
  { id: '6', title: 'Deep Learning Workshop', category: 'Workshops', eventName: 'DL Workshop', date: 'Feb 25, 2024', imageUrl: '' },
  { id: '7', title: 'Team Building Activity', category: 'Events', eventName: 'Team Event', date: 'Feb 20, 2024', imageUrl: '' },
  { id: '8', title: 'Project Showcase', category: 'Events', eventName: 'Demo Day', date: 'Feb 15, 2024', imageUrl: '' },
  { id: '9', title: 'NLP Workshop', category: 'Workshops', eventName: 'NLP Basics', date: 'Feb 10, 2024', imageUrl: '' },
  { id: '10', title: 'Coding Competition', category: 'Hackathons', eventName: 'Code Sprint', date: 'Feb 5, 2024', imageUrl: '' },
  { id: '11', title: 'Member Orientation', category: 'Meetups', eventName: 'New Member Day', date: 'Feb 1, 2024', imageUrl: '' },
  { id: '12', title: 'Best Project Award', category: 'Awards', eventName: 'Project Awards', date: 'Jan 28, 2024', imageUrl: '' },
];
