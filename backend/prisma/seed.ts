import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** MVP is deliberately limited to these two sports (see docs/mvp-prd.md). */
const SPORTS = [
  { name: 'Swimming', icon: '🏊' },
  { name: 'Tennis', icon: '🎾' },
];

async function main() {
  for (const sport of SPORTS) {
    await prisma.sport.upsert({
      where: { name: sport.name },
      update: { icon: sport.icon },
      create: sport,
    });
  }
  console.log(`Seeded ${SPORTS.length} sports.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
