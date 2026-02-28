export interface User {
  id: string;
  uniqueId?: string | null;
  email: string;
  name: string;
  phone?: string;
  department?: string;
  batch?: string;
  studentId?: string;
  profileImage?: string;
  role: 'VISITOR' | 'MEMBER' | 'EXECUTIVE' | 'ADMIN';
  membershipStatus?: 'NONE' | 'PENDING' | 'ACTIVE' | 'REJECTED';
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

export interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  image?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  date?: string; // Kept for backward compatibility if needed
  startDate: string; // Added
  endDate?: string;
  time?: string;
  venue?: string;
  type: string; // Changed to string to be more flexible with "Workshop" vs "WORKSHOP"
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'; // Added
  capacity?: number;
  maxParticipants?: number; // Added alias for capacity to match usage
  registeredCount?: number; // Added
  fee: number;
  isPublished: boolean;
  isFeatured: boolean;
  speaker?: Speaker; // Added
  createdAt: string;
  updatedAt?: string; // Added
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
  instructor?: string | { name: string; title: string; bio: string; image?: string };
  startDate: string;
  endDate?: string;
  duration?: string;
  schedule?: string;
  venue?: string;
  mode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  fee: number;
  price?: number; // Alias for fee
  capacity?: number;
  maxParticipants?: number; // Alias for capacity
  syllabus?: string | any[];
  prerequisites?: string | string[];
  hasCertificate: boolean;
  certificate?: boolean; // Alias for hasCertificate
  isPublished: boolean;
  isFeatured?: boolean; // Added
  level?: string; // Added
  totalHours?: number; // Added
  sessions?: number; // Added
  materials?: string[]; // Added
  registrations?: number; // Added
  registeredCount?: number; // Alias for registrations
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'; // Added
  createdAt: string;
  updatedAt?: string;
  _count?: {
    registrations: number;
  };
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  content?: string;
  image?: string;
  category: ProjectCategory;
  status?: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  technologies?: string | string[]; // Allow array
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  paperUrl?: string;
  authorId: string;
  teamMembers?: string | any[]; // Allow array/object
  startDate?: string;
  endDate?: string;
  isPublished: boolean;
  isFeatured: boolean;
  featured?: boolean; // Alias
  createdAt: string;
  updatedAt?: string;
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
  image?: string; // Alias
  category?: string;
  tags?: string | string[]; // Allow array
  authorId: string;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';
  views: number;
  likes?: number; // Added
  readTime?: string; // Added
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string; // Added
  author?: User | any; // Any to allow loose matching for now
  isFeatured?: boolean; // Added
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
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
  image?: string;
  imageUrl?: string; // Added alias
  eventId?: string;
  eventName?: string;
  category?: string;
  date?: string; // Added
  year?: number;
  order?: number;
  createdAt?: string;
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
  pages?: number; // Alias
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: Pagination;
  errors?: Array<{ field: string; message: string }>;
  event?: Event; // Specific response helpers
  events?: Event[];
  blog?: Blog;
  blogs?: Blog[];
  project?: Project;
  projects?: Project[];
  images?: GalleryImage[];
  isRegistered?: boolean;
  comments?: Comment[];
}

export interface Stats {
  totalMembers: number;
  totalEvents: number;
  totalWorkshops: number;
  totalBlogs: number;
  totalProjects: number;
}

export type PaymentMethod = 'BKASH' | 'NAGAD' | 'ROCKET';
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type MembershipStatusType = 'NONE' | 'PENDING' | 'ACTIVE' | 'REJECTED';

export interface MembershipApplication {
  id: string;
  userId: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  amount: number;
  phoneNumber?: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface MembershipStats {
  totalApplications: number;
  pending: number;
  approved: number;
  rejected: number;
  totalMembers: number;
}

export interface MembershipStatusResponse {
  role: string;
  membershipStatus: MembershipStatusType;
  applications: MembershipApplication[];
}
