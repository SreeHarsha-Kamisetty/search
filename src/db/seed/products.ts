import { db } from '../index';
import { products } from '../schema';
import { reindexAllProducts } from '../../search/reIndex';

export const seedProducts = async () => {
  await db.delete(products);

  await db.insert(products).values([
    {
      name: 'Nike Air Zoom Pegasus 40',
      description: 'Lightweight running shoes for daily training',
      brand: 'Nike',
      category: 'Shoes',
      price: '119.99',
      rating: '4.5',
      popularityScore: 90,
    },
    {
      name: 'Nike Revolution 6 Running Shoes',
      description: 'Comfortable shoes for road running',
      brand: 'Nike',
      category: 'Shoes',
      price: '69.99',
      rating: '4.2',
      popularityScore: 70,
    },
    {
      name: 'Adidas Ultraboost Light',
      description: 'High performance running shoes',
      brand: 'Adidas',
      category: 'Shoes',
      price: '179.99',
      rating: '4.6',
      popularityScore: 85,
    },
    {
      name: 'Apple iPhone 14 Pro',
      description: '6.1-inch display, A16 Bionic chip',
      brand: 'Apple',
      category: 'Mobiles',
      price: '999.00',
      rating: '4.8',
      popularityScore: 100,
    },
    {
      name: 'Apple iPhone 14',
      description: 'Powerful smartphone with A15 chip',
      brand: 'Apple',
      category: 'Mobiles',
      price: '799.00',
      rating: '4.6',
      popularityScore: 95,
    },
    {
      name: 'Samsung Galaxy S23',
      description: 'Flagship Android smartphone',
      brand: 'Samsung',
      category: 'Mobiles',
      price: '749.00',
      rating: '4.5',
      popularityScore: 88,
    },
    {
      name: 'Sony WH-1000XM5 Headphones',
      description: 'Noise cancelling wireless headphones',
      brand: 'Sony',
      category: 'Electronics',
      price: '399.00',
      rating: '4.7',
      popularityScore: 92,
    },
    {
      name: 'Apple AirPods Pro (2nd Gen)',
      description: 'Active noise cancellation earbuds',
      brand: 'Apple',
      category: 'Electronics',
      price: '249.00',
      rating: '4.6',
      popularityScore: 93,
    },
    {
      name: 'Logitech MX Master 3S Mouse',
      description: 'Wireless mouse for productivity',
      brand: 'Logitech',
      category: 'Accessories',
      price: '99.99',
      rating: '4.7',
      popularityScore: 80,
    },
    {
      name: 'Dell XPS 13 Laptop',
      description: 'Compact ultrabook with Intel processor',
      brand: 'Dell',
      category: 'Laptops',
      price: '1299.00',
      rating: '4.4',
      popularityScore: 75,
    },
  ]);

  await reindexAllProducts();
};
