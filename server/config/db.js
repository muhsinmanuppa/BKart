import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Using existing MongoDB connection");
      return mongoose.connection;
    }

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('❌ MongoDB disconnected');
    });

    mongoose.connection.on('connected', async () => {
      console.log('🟢 DB connected');

      // Insert a dummy record
      try {
        const Dummy = mongoose.model("Dummy", new mongoose.Schema({ name: String }));
        await Dummy.create({ name: "Test Entry" });
        console.log("✅ Dummy data inserted");
      } catch (error) {
        console.error("❌ Failed to insert dummy data:", error.message);
      }
    });

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });

    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
