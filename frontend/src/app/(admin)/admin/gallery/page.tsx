'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Image as ImageIcon,
  Search,
  Trash2,
  Upload,
  Calendar,
  Eye,
  Loader2,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  FileImage
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { adminApi, mediaApi, galleryApi } from '@/lib/api';
import { resolveImageUrl } from '@/lib/utils';

interface GalleryImage {
  id: string;
  image: string;
  title?: string;
  category?: string;
  eventName?: string;
  year?: number;
  order?: number;
  createdAt: string;
}

interface PendingFile {
  file: File;
  preview: string;
  title: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

const categories = ['All', 'Events', 'Hackathons', 'Team', 'Awards', 'Meetups'];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Upload state
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [uploadCategory, setUploadCategory] = useState('Events');
  const [uploadEventName, setUploadEventName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    categories: new Set(images.map(i => i.category).filter(Boolean)).size,
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

  // ---- Upload Handlers ----

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const newFiles: PendingFile[] = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(file => ({
        file,
        preview: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        status: 'pending' as const,
      }));
    setPendingFiles(prev => [...prev, ...newFiles]);
  };

  const removePendingFile = (index: number) => {
    setPendingFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const updatePendingTitle = (index: number, title: string) => {
    setPendingFiles(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], title };
      return updated;
    });
  };

  const handleUploadAll = async () => {
    if (pendingFiles.length === 0) return;
    setIsUploading(true);
    setUploadProgress({ done: 0, total: pendingFiles.length });

    const results: PendingFile[] = [...pendingFiles];

    for (let i = 0; i < results.length; i++) {
      const pf = results[i];
      if (pf.status === 'done') {
        setUploadProgress(prev => ({ ...prev, done: prev.done + 1 }));
        continue;
      }

      // Mark uploading
      results[i] = { ...pf, status: 'uploading' };
      setPendingFiles([...results]);

      try {
        // Step 1: Upload image to Google Drive
        const driveRes = await mediaApi.uploadDriveImage(pf.file);
        const driveUrl = driveRes.data?.data?.openUrl;

        if (!driveUrl) throw new Error('No URL returned from Drive upload');

        // Step 2: Save to gallery DB
        await galleryApi.upload({
          title: pf.title || 'Untitled',
          image: driveUrl,
          category: uploadCategory,
          eventName: uploadEventName || undefined,
          year: new Date().getFullYear(),
        });

        results[i] = { ...results[i], status: 'done' };
      } catch (err: any) {
        results[i] = { ...results[i], status: 'error', error: err?.message || 'Upload failed' };
      }

      setPendingFiles([...results]);
      setUploadProgress(prev => ({ ...prev, done: prev.done + 1 }));
    }

    setIsUploading(false);

    // If all succeeded, close modal and refresh
    const allDone = results.every(r => r.status === 'done');
    if (allDone) {
      setTimeout(() => {
        closeUploadModal();
        fetchImages();
      }, 800);
    }
  };

  const closeUploadModal = () => {
    if (isUploading) return;
    pendingFiles.forEach(pf => URL.revokeObjectURL(pf.preview));
    setPendingFiles([]);
    setUploadCategory('Events');
    setUploadEventName('');
    setUploadProgress({ done: 0, total: 0 });
    setIsUploadModalOpen(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFilesSelected(e.dataTransfer.files);
  };

  const getImageSrc = (image: GalleryImage) => {
    return resolveImageUrl(image.image, image.title) || image.image;
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-nexus-text">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Images</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.categories}</p>
            <p className="text-sm text-gray-500">Categories</p>
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
            <div className="flex flex-1 gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px] max-w-md">
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
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div
                className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImages.includes(image.id)
                    ? 'border-primary-500 ring-2 ring-primary-500/20'
                    : 'border-transparent'
                }`}
                onClick={() => toggleSelect(image.id)}
              >
                {image.image ? (
                  <img src={getImageSrc(image)} alt={image.title || 'Gallery image'} title="" className="w-full h-full object-cover" />
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
                  {image.eventName && (
                    <>
                      <span className="truncate">{image.eventName}</span>
                      <span>•</span>
                    </>
                  )}
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={closeUploadModal} size="lg">
        <ModalHeader>
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary-500" />
            Upload Gallery Images
          </div>
        </ModalHeader>
        <ModalBody>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />

          {/* Drop Zone */}
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/5 transition-all"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-nexus-text mb-1">
              Drop images here or click to browse
            </h3>
            <p className="text-sm text-gray-500">
              PNG, JPG, WEBP — up to 5MB each. Select multiple files at once.
            </p>
          </div>

          {/* Category & Event Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Category
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                disabled={isUploading}
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Event Name (optional)
              </label>
              <input
                type="text"
                value={uploadEventName}
                onChange={(e) => setUploadEventName(e.target.value)}
                placeholder="e.g. AI Workshop 2026"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Pending Files Preview */}
          {pendingFiles.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-nexus-text">
                  {pendingFiles.length} image{pendingFiles.length > 1 ? 's' : ''} selected
                </h4>
                {!isUploading && (
                  <button
                    onClick={() => {
                      pendingFiles.forEach(pf => URL.revokeObjectURL(pf.preview));
                      setPendingFiles([]);
                    }}
                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Progress bar */}
              {isUploading && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Uploading to Google Drive...</span>
                    <span>{uploadProgress.done}/{uploadProgress.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.done / uploadProgress.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {pendingFiles.map((pf, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                      pf.status === 'done'
                        ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                        : pf.status === 'error'
                        ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                        : pf.status === 'uploading'
                        ? 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                      <img src={pf.preview} alt="" className="w-full h-full object-cover" />
                    </div>

                    {/* Title input */}
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={pf.title}
                        onChange={(e) => updatePendingTitle(index, e.target.value)}
                        className="w-full text-sm bg-transparent border-0 p-0 text-gray-900 dark:text-white focus:ring-0 focus:outline-none truncate"
                        placeholder="Image title"
                        disabled={isUploading}
                      />
                      <p className="text-xs text-gray-400 truncate">
                        {(pf.file.size / (1024 * 1024)).toFixed(1)} MB • {pf.file.type.split('/')[1]?.toUpperCase()}
                      </p>
                    </div>

                    {/* Status indicator */}
                    <div className="shrink-0">
                      {pf.status === 'uploading' && (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      )}
                      {pf.status === 'done' && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {pf.status === 'error' && (
                        <div className="flex items-center gap-1" title={pf.error}>
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                      {pf.status === 'pending' && !isUploading && (
                        <button
                          onClick={() => removePendingFile(index)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                      {pf.status === 'pending' && isUploading && (
                        <FileImage className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={closeUploadModal} disabled={isUploading}>
            {pendingFiles.every(pf => pf.status === 'done') && pendingFiles.length > 0 ? 'Close' : 'Cancel'}
          </Button>
          {pendingFiles.some(pf => pf.status === 'error') && !isUploading && (
            <Button variant="outline" onClick={handleUploadAll}>
              Retry Failed
            </Button>
          )}
          <Button
            onClick={handleUploadAll}
            disabled={pendingFiles.length === 0 || isUploading || pendingFiles.every(pf => pf.status === 'done')}
            isLoading={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload {pendingFiles.filter(pf => pf.status === 'pending' || pf.status === 'error').length} Image{pendingFiles.filter(pf => pf.status === 'pending' || pf.status === 'error').length !== 1 ? 's' : ''}
          </Button>
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
