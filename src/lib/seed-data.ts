import { db } from './db';
import { categoriesTable, productsTable, offersTable, productOffersTable } from './schema';

async function seedData() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create categories
    console.log('📂 Creating categories...');
    const [electronics, clothing, books] = await db.insert(categoriesTable).values([
      {
        name: 'Electronics',
        description: 'Latest electronic gadgets and devices',
        slug: 'electronics',
        isActive: true
      },
      {
        name: 'Clothing',
        description: 'Fashion and apparel for all ages',
        slug: 'clothing',
        isActive: true
      },
      {
        name: 'Books',
        description: 'Books across all genres',
        slug: 'books',
        isActive: true
      }
    ]).returning();

    console.log('✅ Categories created:', 3);

    // Create products
    console.log('📦 Creating products...');
    const products = await db.insert(productsTable).values([
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced camera system',
        price: '999.99',
        originalPrice: '1099.99',
        sku: 'IPHONE-15-PRO',
        stockQuantity: 50,
        categoryId: electronics.id,
        images: ['https://example.com/iphone15pro1.jpg', 'https://example.com/iphone15pro2.jpg'],
        isActive: true
      },
      {
        name: 'MacBook Air M2',
        description: 'Lightweight laptop with M2 chip',
        price: '1199.99',
        originalPrice: '1299.99',
        sku: 'MACBOOK-AIR-M2',
        stockQuantity: 25,
        categoryId: electronics.id,
        images: ['https://example.com/macbook1.jpg'],
        isActive: true
      },
      {
        name: 'Nike Air Max',
        description: 'Comfortable running shoes',
        price: '129.99',
        originalPrice: '149.99',
        sku: 'NIKE-AIR-MAX',
        stockQuantity: 100,
        categoryId: clothing.id,
        images: ['https://example.com/nike1.jpg', 'https://example.com/nike2.jpg'],
        isActive: true
      },
      {
        name: 'Denim Jacket',
        description: 'Classic denim jacket for all seasons',
        price: '79.99',
        originalPrice: '89.99',
        sku: 'DENIM-JACKET',
        stockQuantity: 75,
        categoryId: clothing.id,
        images: ['https://example.com/denim1.jpg'],
        isActive: true
      },
      {
        name: 'The Great Gatsby',
        description: 'Classic American novel by F. Scott Fitzgerald',
        price: '12.99',
        originalPrice: '15.99',
        sku: 'GREAT-GATSBY',
        stockQuantity: 200,
        categoryId: books.id,
        images: ['https://example.com/gatsby1.jpg'],
        isActive: true
      },
      {
        name: 'React Programming Guide',
        description: 'Complete guide to React development',
        price: '29.99',
        originalPrice: '39.99',
        sku: 'REACT-GUIDE',
        stockQuantity: 150,
        categoryId: books.id,
        images: ['https://example.com/react1.jpg'],
        isActive: true
      }
    ]).returning();

    console.log('✅ Products created:', products.length);

    // Create offers
    console.log('🎯 Creating offers...');
    const [summerSale, techDeal] = await db.insert(offersTable).values([
      {
        title: 'Summer Sale',
        description: 'Get up to 30% off on summer collection',
        discountPercentage: '30.00',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
        isActive: true
      },
      {
        title: 'Tech Deals',
        description: 'Special discounts on electronics',
        discountPercentage: '15.00',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true
      }
    ]).returning();

    console.log('✅ Offers created:', 2);

    // Associate products with offers
    console.log('🔗 Associating products with offers...');
    await db.insert(productOffersTable).values([
      {
        productId: products[2].id, // Nike Air Max
        offerId: summerSale.id
      },
      {
        productId: products[3].id, // Denim Jacket
        offerId: summerSale.id
      },
      {
        productId: products[0].id, // iPhone 15 Pro
        offerId: techDeal.id
      },
      {
        productId: products[1].id, // MacBook Air M2
        offerId: techDeal.id
      }
    ]);

    console.log('✅ Product-offer associations created');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Categories: 3`);
    console.log(`- Products: ${products.length}`);
    console.log(`- Offers: 2`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seedData();
