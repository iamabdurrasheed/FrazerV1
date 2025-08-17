import { db } from './db';
import { adminsTable } from './schema';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const [admin] = await db.insert(adminsTable).values({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User'
    }).returning();

    console.log('Admin user created:', admin);
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

seedAdmin();
