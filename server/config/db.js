import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      // If already connected, reuse the connection
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Add serverless-friendly options
      bufferCommands: false,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit process in serverless environment
    throw error;
  }
};

export default connectDB;