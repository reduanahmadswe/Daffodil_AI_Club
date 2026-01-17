'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image, 
  Search, 
  Plus,
  Trash2,
  Download,
  Edit,
  X,
  Upload,
  Folder,
  Calendar,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';

const mockImages = [
  { id: '1', url: '/gallery/1.jpg', title: 'ML Workshop 2024', category: 'Workshops', uploadedAt: '2024-02-15', views: 125 },
  { id: '2', url: '/gallery/2.jpg', title: 'Hackathon Winners', category: 'Hackathons', uploadedAt: '2024-02-10', views: 890 },
  { id: '3', url: '/gallery/3.jpg', title: 'Annual Meetup', category: 'Events', uploadedAt: '2024-01-28', views: 456 },
  { id: '4', url: '/gallery/4.jpg', title: 'AI Seminar', category: 'Events', uploadedAt: '2024-01-15', views: 320 },
  { id: '5', url: '/gallery/5.jpg', title: 'Team Photo', category: 'Team', uploadedAt: '2024-01-01', views: 1200 },
  { id: '6', url: '/gallery/6.jpg', title: 'Award Ceremony', category: 'Awards', uploadedAt: '2023-12-20', views: 780 },
];

const categories = ['All', 'Events', 'Workshops', 'Hackathons', 'Team', 'Awards'];

export default function AdminGalleryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredImages = mockImages.filter(img => {
    const matchesSearch = img.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || img.category === category;
    return matchesSearch && matchesCategory;
  });

  const toggleSelect = (id: string) => {
    setSelectedImages(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(img => img.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Image className="w-8 h-8 text-primary-500" />
            Gallery Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload and manage gallery images
          </p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Images
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">256</p>
            <p className="text-sm text-gray-500">Total Images</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-500">Albums</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">45.5K</p>
            <p className="text-sm text-gray-500">Total Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">1.2 GB</p>
            <p className="text-sm text-gray-500">Storage Used</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="flex-1 max-w-md">
                <Input
                  type="search"
                  placeholder="Search images..."
                  leftIcon={<Search className="w-5 h-5" />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      category === cat
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {selectedImages.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download ({selectedImages.length})
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete ({selectedImages.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Select All */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
            onChange={selectAll}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {selectedImages.length > 0 
              ? `${selectedImages.length} selected` 
              : 'Select all'
            }
          </span>
        </label>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className="relative group"
          >
            <div 
              className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                selectedImages.includes(image.id) 
                  ? 'border-primary-500 ring-2 ring-primary-500/20' 
                  : 'border-transparent'
              }`}
              onClick={() => toggleSelect(image.id)}
            >
              {/* Placeholder for image */}
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <Image className="w-10 h-10 text-gray-400" />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white text-gray-900 p-2">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white text-gray-900 p-2">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="bg-red-500/90 hover:bg-red-500 text-white p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImages([image.id]);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Checkbox */}
              <div className={`absolute top-2 left-2 transition-opacity ${selectedImages.includes(image.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selectedImages.includes(image.id) 
                    ? 'bg-primary-500 border-primary-500 text-white' 
                    : 'bg-white/80 border-gray-300'
                }`}>
                  {selectedImages.includes(image.id) && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Category Badge */}
              <Badge color="blue" size="sm" className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm">
                {image.category}
              </Badge>
            </div>

            {/* Image Info */}
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{image.title}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Eye className="w-3 h-3" />
                <span>{image.views}</span>
                <span>•</span>
                <Calendar className="w-3 h-3" />
                <span>{new Date(image.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} size="lg">
        <ModalHeader onClose={() => setIsUploadModalOpen(false)}>
          Upload Images
        </ModalHeader>
        <ModalBody>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-gray-500 mb-4">
              PNG, JPG or WEBP up to 10MB each
            </p>
            <Button>Select Files</Button>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {categories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
          <Button>Upload</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="sm">
        <ModalHeader onClose={() => setIsDeleteModalOpen(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete {selectedImages.length} image(s)? 
            This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => {
            setSelectedImages([]);
            setIsDeleteModalOpen(false);
          }}>Delete</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
