import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-service';

async function checkDb() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`Collection ${collection.name}: ${count} documents`);
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Database check error:', err);
  }
}

checkDb();
