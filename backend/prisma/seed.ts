import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/** MVP is deliberately limited to these two sports (see docs/mvp-prd.md). */
const SPORTS = [
  { name: 'Swimming', icon: '🏊' },
  { name: 'Tennis', icon: '🎾' },
];

/**
 * There is no way to sign up as an admin — the role would be trivially
 * self-assignable if there were. Set ADMIN_EMAIL and ADMIN_PASSWORD to create
 * or promote one; the back office at /admin signs in with these.
 */
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('No ADMIN_EMAIL/ADMIN_PASSWORD set — skipping admin.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', passwordHash, isVerified: true },
    create: {
      firstName: 'CoachLink',
      lastName: 'Admin',
      email,
      phoneNumber: '',
      passwordHash,
      role: 'ADMIN',
      isVerified: true,
    },
  });
  console.log(`Admin ready: ${email}`);
}

async function main() {
  for (const sport of SPORTS) {
    await prisma.sport.upsert({
      where: { name: sport.name },
      update: { icon: sport.icon },
      create: sport,
    });
  }
  console.log(`Seeded ${SPORTS.length} sports.`);

  await seedAdmin();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
