'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Eye, 
  Award, 
  Users, 
  Calendar, 
  Rocket,
  Heart,
  Star,
  Code,
  Brain,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

const milestones = [
  { year: '2019', title: 'Club Founded', description: 'Daffodil AI Club was established' },
  { year: '2020', title: 'First Hackathon', description: 'Organized our first AI Hackathon' },
  { year: '2021', title: '200+ Members', description: 'Reached 200 active members' },
  { year: '2022', title: 'National Recognition', description: 'Won Best AI Club Award' },
  { year: '2023', title: '500+ Members', description: 'Grew to 500+ active members' },
  { year: '2024', title: 'International Collaboration', description: 'Partnered with global AI communities' },
];

const values = [
  { icon: Brain, title: 'Innovation', description: 'Pushing boundaries in AI research and applications' },
  { icon: Users, title: 'Collaboration', description: 'Working together to achieve common goals' },
  { icon: BookOpen, title: 'Learning', description: 'Continuous learning and skill development' },
  { icon: Heart, title: 'Inclusivity', description: 'Welcoming members from all backgrounds' },
];

const advisors = [
  { name: 'Dr. Md. Saddam Hossain', role: 'Faculty Advisor', department: 'CSE Department' },
  { name: 'Prof. Abdul Karim', role: 'Co-Advisor', department: 'SWE Department' },
];

const executives = [
  { name: 'Rafiqul Islam', role: 'President', batch: '52' },
  { name: 'Fatima Akter', role: 'Vice President', batch: '53' },
  { name: 'Kamal Hossain', role: 'General Secretary', batch: '53' },
  { name: 'Nusrat Jahan', role: 'Treasurer', batch: '54' },
  { name: 'Mahmudul Hasan', role: 'Technical Lead', batch: '52' },
  { name: 'Sabrina Rahman', role: 'Event Coordinator', batch: '54' },
  { name: 'Ahmed Khan', role: 'Media Secretary', batch: '55' },
  { name: 'Tasnim Akhter', role: 'PR Manager', batch: '54' },
];

export default function AboutPage() {
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
            <Badge color="white" className="bg-white/20 text-white mb-6">About Us</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Daffodil AI Club
            </h1>
            <p className="text-xl text-white/80">
              The premier artificial intelligence community at Daffodil International University, 
              dedicated to fostering innovation, learning, and collaboration in AI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card variant="gradient" className="h-full">
                <CardContent className="p-8 text-white">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                    <Target className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl mb-4 text-white">Our Mission</CardTitle>
                  <CardDescription className="text-white/80 text-lg">
                    To empower DIU students with cutting-edge AI knowledge and skills through 
                    hands-on learning, collaborative projects, and industry exposure, preparing 
                    them to become leaders in the AI revolution.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gray-50 dark:bg-gray-800">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
                    <Eye className="w-8 h-8 text-primary-600" />
                  </div>
                  <CardTitle className="text-2xl mb-4">Our Vision</CardTitle>
                  <CardDescription className="text-lg">
                    To become Bangladesh's leading student AI community, recognized for 
                    producing skilled AI practitioners who contribute to solving real-world 
                    problems and driving technological innovation.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Badge color="blue" className="mb-4">Core Values</Badge>
            <h2 className="section-title mb-4">What We Stand For</h2>
            <p className="section-subtitle">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center card-hover">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="mb-2">{value.title}</CardTitle>
                    <CardDescription>{value.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Badge color="purple" className="mb-4">Our Journey</Badge>
            <h2 className="section-title mb-4">Milestones</h2>
            <p className="section-subtitle">
              Key moments in our growth story
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary-500 to-secondary-500" />
              
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center mb-8 ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8 order-2'}`}>
                    <Card className="inline-block">
                      <CardContent className="p-4">
                        <span className="text-primary-600 font-bold">{milestone.year}</span>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{milestone.title}</h4>
                        <p className="text-sm text-gray-500">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Center Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-white dark:border-gray-900 shadow-lg" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advisors */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Badge color="green" className="mb-4">Faculty</Badge>
            <h2 className="section-title mb-4">Our Advisors</h2>
            <p className="section-subtitle">
              Distinguished faculty members guiding our club
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {advisors.map((advisor, index) => (
              <motion.div
                key={advisor.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center card-hover">
                  <CardContent className="p-8">
                    <Avatar name={advisor.name} size="xl" className="mx-auto mb-4 w-24 h-24" />
                    <CardTitle className="mb-1">{advisor.name}</CardTitle>
                    <p className="text-primary-600 font-medium">{advisor.role}</p>
                    <p className="text-sm text-gray-500">{advisor.department}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Panel */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Badge color="purple" className="mb-4">Leadership</Badge>
            <h2 className="section-title mb-4">Executive Panel 2024</h2>
            <p className="section-subtitle">
              Meet the dedicated team leading Daffodil AI Club
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {executives.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="text-center card-hover">
                  <CardContent className="p-6">
                    <Avatar name={member.name} size="lg" className="mx-auto mb-4" />
                    <CardTitle className="text-lg mb-1">{member.name}</CardTitle>
                    <p className="text-primary-600 text-sm font-medium">{member.role}</p>
                    <p className="text-xs text-gray-500">Batch {member.batch}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '500+', label: 'Active Members' },
              { icon: Calendar, value: '100+', label: 'Events Organized' },
              { icon: Award, value: '50+', label: 'Workshops Conducted' },
              { icon: Rocket, value: '25+', label: 'Projects Completed' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <stat.icon className="w-10 h-10 mx-auto mb-4 opacity-80" />
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
