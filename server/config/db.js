import mongoose from "mongoose";

// Cache the database connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('❌ MongoDB disconnected');
      cached.conn = null;
      cached.promise = null;
    });

    mongoose.connection.on('connected', () => {
      console.log('🟢 DB connected');
    });

    try {
      cached.promise = mongoose.connect(process.env.MONGO_URI, opts);
    } catch (error) {
      console.error("❌ MongoDB Connection Error:", error.message);
      cached.conn = null;
      cached.promise = null;
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
};

export default connectDB;