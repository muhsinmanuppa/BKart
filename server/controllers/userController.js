import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { username, password } = req.body;  // Changed from email to username to match model

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        isAdmin: user.isAdmin 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const updatePassword = async (req, res) => {
  console.log('📍 Starting password update process');
  const { username, newPassword } = req.body;

  try {
    // Check MongoDB connection status
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected. Current state:', mongoose.connection.readyState);
      throw new Error('Database connection not available');
    }

    console.log('✅ MongoDB connection verified');

    // Log request data (without sensitive info)
    console.log('📝 Update request for username:', username);

    if (!username || !newPassword) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        message: "Username and new password are required" 
      });
    }

    // Find user
    console.log('🔍 Finding user in database...');
    const user = await User.findOne({ username }).exec();
    
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(404).json({ message: "User not found" });
    }

    console.log('✅ User found, generating password hash...');

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.password = hashedPassword;
    console.log('💾 Saving updated password...');
    
    await user.save();
    
    console.log('✅ Password updated successfully');
    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error('❌ Password update error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    // Handle specific MongoDB errors
    if (error.name === 'MongoServerError') {
      return res.status(500).json({
        message: "Database error",
        details: error.message
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error",
        details: error.message
      });
    }

    res.status(500).json({ 
      message: "Server error while updating password",
      details: error.message
    });
  }
};

export default { loginUser, updatePassword };