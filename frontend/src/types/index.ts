export interface User {
  id: string;
  uniqueId: string;
  email: string;
  name: string;
  phone?: string;
  department?: string;
  batch?: string;
  studentId?: string;
  profileImage?: string;
  role: 'VISITOR' | 'MEMBER' | 'EXECUTIVE' | 'ADMIN';
  points: number;
  isVerified: boolean;
  createdAt: string;
  qrCode?: string;
  badges?: UserBadge[];
  _count?: {
    blogs: number;
    projects: number;
    eventRegistrations: number;
    workshopRegistrations: number;
    certificates: number;
  };
}

export interface UserBadge {
  id: string;
  badge: Badge;
  earnedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  points: number;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  date: string;
  endDate?: string;
  time?: string;
  venue?: string;
  type: EventType;
  capacity?: number;
  fee: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  _count?: {
    registrations: number;
    attendances: number;
  };
}

export type EventType = 'SEMINAR' | 'WORKSHOP' | 'COMPETITION' | 'HACKATHON' | 'MEETUP' | 'WEBINAR' | 'CONFERENCE';

export interface EventRegistration {
  id: string;
  userId: string;
  eventId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'ATTENDED';
  qrCode?: string;
  createdAt: string;
  event?: Event;
  user?: User;
}

export interface Workshop {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  instructor?: string;
  startDate: string;
  endDate?: string;
  duration?: string;
  schedule?: string;
  venue?: string;
  mode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  fee: number;
  capacity?: number;
  syllabus?: string;
  prerequisites?: string;
  hasCertificate: boolean;
  isPublished: boolean;
  createdAt: string;
  _count?: {
    registrations: number;
  };
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  category: ProjectCategory;
  technologies?: string;
  githubUrl?: string;
  demoUrl?: string;
  paperUrl?: string;
  authorId: string;
  teamMembers?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  author?: User;
}

export type ProjectCategory = 
  | 'AI_ML' 
  | 'DEEP_LEARNING' 
  | 'NLP' 
  | 'COMPUTER_VISION' 
  | 'DATA_SCIENCE' 
  | 'ROBOTICS' 
  | 'IOT' 
  | 'RESEARCH' 
  | 'OTHER';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string;
  authorId: string;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';
  views: number;
  publishedAt?: string;
  createdAt: string;
  author?: User;
}

export interface Executive {
  id: string;
  userId?: string;
  name: string;
  position: string;
  team?: string;
  image?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  order: number;
  isActive: boolean;
  tenure?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  image: string;
  eventId?: string;
  eventName?: string;
  category?: string;
  year?: number;
  order: number;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Certificate {
  id: string;
  uniqueCode: string;
  userId: string;
  title: string;
  description?: string;
  type: 'EVENT_PARTICIPATION' | 'WORKSHOP_COMPLETION' | 'COMPETITION_WINNER' | 'ACHIEVEMENT' | 'MEMBERSHIP';
  referenceId?: string;
  issuedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: Pagination;
  errors?: Array<{ field: string; message: string }>;
}

export interface Stats {
  totalMembers: number;
  totalEvents: number;
  totalWorkshops: number;
  totalBlogs: number;
  totalProjects: number;
}
