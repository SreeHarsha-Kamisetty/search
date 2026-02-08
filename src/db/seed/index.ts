import { seedProducts } from './products';

const runSeed = async () => {
  try {
    console.log('Seeding database...');
    await seedProducts();
    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed', error);
    process.exit(1);
  }
};

runSeed();
