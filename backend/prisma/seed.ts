import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create demo admin user
  const adminPassword = await bcrypt.hash('admin123456', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@diu.edu.bd' },
    update: {
      password: adminPassword,
      role: 'ADMIN',
      isVerified: true,
      membershipStatus: 'ACTIVE',
    },
    create: {
      uniqueId: 'DAIC-CSE-00001',
      email: 'admin@diu.edu.bd',
      password: adminPassword,
      name: 'Admin User',
      phone: '01700000000',
      department: 'CSE',
      batch: '50',
      studentId: 'ADM-000001',
      role: 'ADMIN',
      isVerified: true,
      membershipStatus: 'ACTIVE',
      points: 100,
    },
  });

  console.log(`✅ Admin user created/updated: ${admin.email} (${admin.role})`);

  // Create demo executive user
  const execPassword = await bcrypt.hash('exec123456', 12);

  const executive = await prisma.user.upsert({
    where: { email: 'executive@diu.edu.bd' },
    update: {
      password: execPassword,
      role: 'EXECUTIVE',
      isVerified: true,
      membershipStatus: 'ACTIVE',
    },
    create: {
      uniqueId: 'DAIC-SWE-00002',
      email: 'executive@diu.edu.bd',
      password: execPassword,
      name: 'Executive User',
      phone: '01711111111',
      department: 'SWE',
      batch: '51',
      studentId: 'EXC-000001',
      role: 'EXECUTIVE',
      isVerified: true,
      membershipStatus: 'ACTIVE',
      points: 50,
    },
  });

  console.log(`✅ Executive user created/updated: ${executive.email} (${executive.role})`);

  // Create demo member user
  const memberPassword = await bcrypt.hash('member123456', 12);

  const member = await prisma.user.upsert({
    where: { email: 'member@diu.edu.bd' },
    update: {
      password: memberPassword,
      role: 'MEMBER',
      isVerified: true,
      membershipStatus: 'ACTIVE',
    },
    create: {
      uniqueId: 'DAIC-CSE-00003',
      email: 'member@diu.edu.bd',
      password: memberPassword,
      name: 'Member User',
      phone: '01722222222',
      department: 'CSE',
      batch: '52',
      studentId: 'MBR-000001',
      role: 'MEMBER',
      isVerified: true,
      membershipStatus: 'ACTIVE',
      points: 25,
    },
  });

  console.log(`✅ Member user created/updated: ${member.email} (${member.role})`);

  // Create demo visitor user
  const visitorPassword = await bcrypt.hash('visitor123456', 12);

  const visitor = await prisma.user.upsert({
    where: { email: 'visitor@diu.edu.bd' },
    update: {
      password: visitorPassword,
      role: 'VISITOR',
      isVerified: true,
      membershipStatus: 'NONE',
    },
    create: {
      email: 'visitor@diu.edu.bd',
      password: visitorPassword,
      name: 'Visitor User',
      phone: '01733333333',
      department: 'SWE',
      batch: '53',
      studentId: 'VST-000001',
      role: 'VISITOR',
      isVerified: true,
      membershipStatus: 'NONE',
      points: 0,
    },
  });

  console.log(`✅ Visitor user created/updated: ${visitor.email} (${visitor.role})`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('  Admin:     admin@diu.edu.bd     / admin123456');
  console.log('  Executive: executive@diu.edu.bd / exec123456');
  console.log('  Member:    member@diu.edu.bd    / member123456');
  console.log('  Visitor:   visitor@diu.edu.bd   / visitor123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
