# Daffodil AI Club – Website Documentation

## 1. Website Purpose
এই ওয়েবসাইটের মূল উদ্দেশ্য হবে:
- ক্লাবের পরিচিতি দেওয়া
- AI/Tech বিষয়ে শিক্ষার্থীদের যুক্ত করা
- ইভেন্ট, ওয়ার্কশপ ও রিসার্চ কার্যক্রম প্রদর্শন
- নতুন মেম্বার ও ভলান্টিয়ার সংগ্রহ

---

## 2. User Types (Users)
1. Visitor (সাধারণ ভিজিটর)
2. Club Member
3. Executive/Admin Panel User
---

## 3. Core Pages & Features

### 3.1 Home Page
- Hero Section (Club tagline + AI theme)
- About Short Intro
- Latest Events (3–4 টি)
- Achievements / Highlights
- Call To Action (Join Club / Register Event)

### 3.2 About Us Page
- Club History
- Mission & Vision
- Advisor / Mentor Information
- Club Activities Overview

### 3.3 Executive Panel Page
- President, Vice President
- General Secretary
- Technical Team
- Design & Media Team
- Member Profiles (Photo + Role)

### 3.4 Events Page
- Upcoming Events
- Past Events Archive
- Event Details Page
- Event Registration Button

### 3.5 Workshops & Courses
- AI / ML Workshops
- Bootcamp Details
- Registration Form
- Certificate Info

### 3.6 Projects & Research
- Student AI Projects Showcase
- GitHub / Demo Links
- Research Papers
- Case Studies

### 3.7 Blog / Article Section
- AI Learning Articles
- Club Members Blog Post
- Admin Post Approval System

### 3.8 Gallery
- Event Photos
- Workshops Moments
- Filter by Year / Event

### 3.9 Membership Page
- Join Club Form
- Membership Benefits
- Rules & Responsibilities

### 3.10 Contact Us Page
- Contact Form
- Google Map (University Location)
- Social Media Links

---

## 4. Authentication System
- Member Login / Signup
- Role-based Access
- Admin Dashboard

---

## 5. Admin Panel Features
- Manage Events
- Approve Blogs
- Manage Members
- Upload Gallery Images
- Send Email Notifications

---

## 6. Advanced / Premium Features
- AI Chatbot (Club FAQ)
- Event Attendance QR System
- Certificate Generator (PDF)
- AI Learning Resources Hub

---

## 7. Tech Stack Suggestion

### Frontend
- HTML, CSS, TypeScript
- Next.js
- Tailwind CSS / Bootstrap

### Backend
- Node.js + Express

### Database
- MySQL 

### Others
- Cloudinary (Image Upload) / google drive

---

## 8. UI/UX Design Guidelines
- AI Theme Color (Blue, Purple)
- Dark Mode Support
- Mobile Responsive Design
- Clean & Modern Layout

---


End of Documentation




Plan: Daffodil AI Club Website with Student Unique ID System
এই প্ল্যানে Next.js + Node.js + MySQL ব্যবহার করে একটি ফুল-স্ট্যাক AI Club ওয়েবসাইট তৈরি করা হবে। Student login করলে একটি Unique Member ID জেনারেট হবে এবং Member Dashboard এ সব সুবিধা পাওয়া যাবে।

Steps
Project Structure Setup – Next.js frontend এবং Node.js/Express backend আলাদা folder structure তৈরি করুন (/client, /server), MySQL database connection সেটআপ করুন।

Authentication System with Unique ID – User registration এ DAIC-2026-XXXXX format এ unique member ID generate করুন। JWT token based login system implement করুন। Role: visitor, member, admin।

Core Pages Development – Home, About, Executive Panel, Events, Workshops, Projects, Blog, Gallery, Membership, Contact এই ১০টি page তৈরি করুন Tailwind CSS দিয়ে AI theme (Blue/Purple) ব্যবহার করে।

Member Dashboard – Login এর পর student এর জন্য dashboard page যেখানে: Profile info, Unique ID card (downloadable), Event registrations, Certificate collection, Blog submission।

Admin Panel – Events CRUD, Blog approval, Member management, Gallery upload, Email notification system implement করুন।

Advanced Features – AI Chatbot (FAQ), QR based event attendance, PDF certificate generator, এবং Learning resources hub যোগ করুন।

Additional Features (নতুন সংযোজন)
Feature	Description
Digital Member ID Card	QR code সহ downloadable ID card (PNG/PDF)
Member Points System	Event attend, blog লেখা, project submit এ points earn
Leaderboard	Top contributing members showcase
Event RSVP + Reminder	Email/SMS reminder before events
Skills Badge System	Workshop complete করলে skill badges (ML, Python, etc.)
Member Directory	Searchable member list with skills filter
Alumni Section	Past members এবং তাদের achievements
Newsletter Subscription	AI/Tech updates via email
Dark/Light Mode Toggle	User preference save করা
PWA Support	Mobile app এর মতো experience
Further Considerations
Unique ID Format কেমন হবে? – DAIC-YEAR-NUMBER (যেমন: DAIC-2026-00142) / DAIC-DEPT-NUMBER (যেমন: DAIC-CSE-00142) / শুধু sequential number?

Email Verification দরকার? – Registration এর সময় university email verify করা উচিত কি না? (Recommended: হ্যাঁ)

Hosting কোথায় হবে? – Vercel (Frontend) + Railway/Render (Backend) / University server / VPS?


Unique ID Format কেমন হবে -> DAIC-spring/fall/summer-00142
Registration এর সময় university email verify করা উচিত - domain @diu.edu.bd

Hosting কোথায় হবে University server


structure 
frontend/

backend/
modules/
   auth/
   auth.conroller.ts
   auth.service.ts
   auth.router.ts
   auth.validation.ts
   auth.model.ts

   event/
   event.model.ts
   event.service.ts

ei rokom bhobe