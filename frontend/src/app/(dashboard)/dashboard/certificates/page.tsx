'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Award, 
  Download, 
  ExternalLink, 
  Calendar,
  Search,
  Filter,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

const mockCertificates = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    type: 'WORKSHOP',
    issueDate: '2024-02-28',
    certificateId: 'CERT-ML-2024-001',
    hours: 8,
    instructor: 'Dr. Rafiqul Islam',
  },
  {
    id: '2',
    title: 'Deep Learning Bootcamp',
    type: 'BOOTCAMP',
    issueDate: '2024-02-15',
    certificateId: 'CERT-DL-2024-045',
    hours: 24,
    instructor: 'Prof. Ahmed Khan',
  },
  {
    id: '3',
    title: 'Python for Data Science',
    type: 'WORKSHOP',
    issueDate: '2024-01-20',
    certificateId: 'CERT-PY-2024-023',
    hours: 6,
    instructor: 'Fatima Akter',
  },
  {
    id: '4',
    title: 'AI Hackathon 2024 - 2nd Place',
    type: 'HACKATHON',
    issueDate: '2024-01-10',
    certificateId: 'CERT-HACK-2024-002',
    hours: 48,
    achievement: '2nd Place Winner',
  },
];

const typeColors = {
  WORKSHOP: 'blue',
  BOOTCAMP: 'green',
  HACKATHON: 'orange',
  SEMINAR: 'purple',
} as const;

export default function DashboardCertificatesPage() {
  const [search, setSearch] = useState('');

  const filteredCertificates = mockCertificates.filter(cert =>
    cert.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalHours = mockCertificates.reduce((acc, cert) => acc + cert.hours, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-nexus-text">
            My Certificates
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and download your earned certificates
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-nexus-text">{mockCertificates.length}</p>
            <p className="text-sm text-gray-500">Total Certificates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{totalHours}</p>
            <p className="text-sm text-gray-500">Learning Hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{mockCertificates.filter(c => c.type === 'WORKSHOP').length}</p>
            <p className="text-sm text-gray-500">Workshop Certs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{mockCertificates.filter(c => c.type === 'HACKATHON').length}</p>
            <p className="text-sm text-gray-500">Achievement Certs</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          type="search"
          placeholder="Search certificates..."
          leftIcon={<Search className="w-5 h-5" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Certificates Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredCertificates.length > 0 ? (
          filteredCertificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Certificate Preview */}
                <div className="aspect-[1.4/1] bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 relative p-6 flex flex-col items-center justify-center border-b border-gray-100 dark:border-gray-800">
                  {/* Decorative Border */}
                  <div className="absolute inset-4 border-2 border-dashed border-primary-200 dark:border-primary-700 rounded-lg" />
                  
                  {/* Content */}
                  <div className="relative text-center">
                    <Award className="w-12 h-12 mx-auto text-primary-500 mb-3" />
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Certificate of Completion</p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-nexus-text mb-2 line-clamp-2">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Daffodil AI Club
                    </p>
                    {cert.achievement && (
                      <Badge color="yellow" className="mt-2">{cert.achievement}</Badge>
                    )}
                  </div>

                  {/* Certificate ID */}
                  <div className="absolute bottom-4 right-4">
                    <code className="text-xs text-gray-400">{cert.certificateId}</code>
                  </div>
                </div>

                {/* Details */}
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge color={typeColors[cert.type as keyof typeof typeColors]} size="sm">
                      {cert.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(cert.issueDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900 dark:text-nexus-text">{cert.hours} hours</p>
                    </div>
                    {cert.instructor && (
                      <div>
                        <p className="text-gray-500">Instructor</p>
                        <p className="font-medium text-gray-900 dark:text-nexus-text">{cert.instructor}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="md:col-span-2">
            <CardContent className="p-12 text-center">
              <Award className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-nexus-text mb-2">
                No certificates yet
              </h3>
              <p className="text-gray-500 mb-6">
                Complete workshops and events to earn certificates
              </p>
              <Link href="/events">
                <Button>Browse Events</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
