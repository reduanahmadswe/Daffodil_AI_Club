'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Image as ImageIcon, 
  Search, 
  Trash2,
  Upload,
  Calendar,
  Eye,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { adminApi } from '@/lib/api';

interface GalleryImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  category?: string;
  views?: number;
  uploadedAt?: string;
  createdAt: string;
}

const categories = ['All', 'Events', 'Workshops', 'Hackathons', 'Team', 'Awards'];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.getGalleryImages({ search, category: category !== 'All' ? category : undefined });
      const data = response.data;
      const list = data.data || data.images || data;
      if (Array.isArray(list)) {
        setImages(list);
      }
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchImages(), 300);
    return () => clearTimeout(debounce);
  }, [fetchImages]);

  const stats = {
    total: images.length,
    totalViews: images.reduce((sum, img) => sum + (img.views || 0), 0),
  };

  const toggleSelect = (id: string) => {
    setSelectedImages(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map(img => img.id));
    }
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await Promise.allSettled(selectedImages.map(id => adminApi.deleteGalleryImage(id)));
      setImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
      setSelectedImages([]);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete images:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-nexus-text flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-primary-500" />
            Gallery Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload and manage gallery images
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchImages()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-nexus-text">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Images</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{new Set(images.map(i => i.category).filter(Boolean)).size}</p>
            <p className="text-sm text-gray-500">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.totalViews.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{selectedImages.length}</p>
            <p className="text-sm text-gray-500">Selected</p>
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
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete ({selectedImages.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Select All */}
      {images.length > 0 && (
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedImages.length === images.length && images.length > 0}
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
      )}

      {/* Images Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : images.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-nexus-text mb-2">No images found</h3>
            <p className="text-gray-500">{search ? 'Try a different search term' : 'Upload your first image'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
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
                {image.url ? (
                  <img src={image.url} alt={image.title || 'Gallery image'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
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
                {image.category && (
                  <Badge color="blue" size="sm" className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm">
                    {image.category}
                  </Badge>
                )}
              </div>

              {/* Image Info */}
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900 dark:text-nexus-text truncate">{image.title || 'Untitled'}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Eye className="w-3 h-3" />
                  <span>{image.views || 0}</span>
                  <span>•</span>
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(image.uploadedAt || image.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} size="lg">
        <ModalHeader>Upload Images</ModalHeader>
        <ModalBody>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-nexus-text mb-2">
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
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalBody>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete {selectedImages.length} image(s)? 
            This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleBulkDelete} isLoading={isDeleting}>Delete</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
