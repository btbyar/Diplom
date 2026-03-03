import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { User } from './models/User.js';
import { Service } from './models/Service.js';
import { Part } from './models/Part.js';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-service';

async function seedDatabase() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB холболт амжилттай');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Part.deleteMany({});
    console.log('🗑️  Эртний мэдээлэл устгалаа');

    // Create admin user
    const hashedPassword = await bcryptjs.hash('admin123', 10);
    const adminUser = new User({
      email: 'admin@gmail.com',
      password: hashedPassword,
      phone: '88005553535',
      name: 'Admin User',
      role: 'admin',
    });
    await adminUser.save();
    console.log('✅ Admin хэрэглэгч үүсгэлээ');

    // Create dummy users
    const userPassword = await bcryptjs.hash('user123', 10);
    const dummyUsers = [
      {
        email: 'baatarbe14@gmail.com',
        password: userPassword,
        phone: '99119911',
        name: 'Баттар',
        role: 'user',
      },
      {
        email: 'ganbat@gmail.com',
        password: userPassword,
        phone: '88622611',
        name: 'Ганбат',
        role: 'user',
      },
      {
        email: 'ganbold@gmail.com',
        password: userPassword,
        phone: '94459029',
        name: 'Ганболд',
        role: 'user',
      },
      {
        email: 'munkh@gmail.com',
        password: userPassword,
        phone: '99223344',
        name: 'Мөнх',
        role: 'user',
      },
      {
        email: 'tsetseg@gmail.com',
        password: userPassword,
        phone: '88334455',
        name: 'Цэцэг',
        role: 'user',
      },
      {
        email: 'boldoo@gmail.com',
        password: userPassword,
        phone: '99445566',
        name: 'Болд',
        role: 'user',
      },
      {
        email: 'oyuna@gmail.com',
        password: userPassword,
        phone: '88556677',
        name: 'Оюуна',
        role: 'user',
      },
      {
        email: 'naraa@gmail.com',
        password: userPassword,
        phone: '99667788',
        name: 'Наараа',
        role: 'user',
      },
    ];

    const createdUsers = await User.insertMany(dummyUsers);
    console.log(`✅ ${createdUsers.length} хэрэглэгч үүсгэлээ`);

    // Create services
    const services = [
      {
        name: 'Тосо солих',
        description: 'Машины тоос солих үйлчилгээ',
        price: 50000,
        duration: 30,
        brand: 'Бүх марк',
      },
      {
        name: 'Шүүр цэвэрлэх',
        description: 'Агаарын шүүр болон түлшний шүүр цэвэрлэх',
        price: 30000,
        duration: 20,
        brand: 'Бүх марк',
      },
      {
        name: 'Тормозын цэвэрлэх',
        description: 'Тормозын систем сүүлчилгээ',
        price: 80000,
        duration: 60,
        brand: 'Бүх марк',
      },
      {
        name: 'Чанга сольк',
        description: 'Машины чангыг солих үйлчилгээ',
        price: 100000,
        duration: 45,
        brand: 'Бүх марк',
      },
      {
        name: 'Батарей солих',
        description: 'Машины батарейг солих',
        price: 150000,
        duration: 30,
        brand: 'Бүх марк',
      },
      {
        name: 'Шаршны цэвэрлэх',
        description: 'Шаршны хүрэлцүүлэлтийг сүүлчилгээ хийх',
        price: 120000,
        duration: 50,
        brand: 'Бүх марк',
      },
    ];

    const createdServices = await Service.insertMany(services);
    console.log(`✅ ${createdServices.length} үйлчилгээ үүсгэлээ`);

    console.log('🎉 Database seed амжилттай дүүслээ!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Алдаа:', error);
    process.exit(1);
  }
}

seedDatabase();
