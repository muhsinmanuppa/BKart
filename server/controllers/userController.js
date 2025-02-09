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
  try {
    // Set CORS headers explicitly
    res.header('Access-Control-Allow-Origin', 'https://b-kart-nine.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const { username, newPassword } = req.body;

    // Validate input
    if (!username || !newPassword) {
      return res.status(400).json({ 
        message: "Username and new password are required" 
      });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user
    user.password = hashedPassword;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error('Password update error:', error);
    
    // Set CORS headers even in error case
    res.header('Access-Control-Allow-Origin', 'https://b-kart-nine.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return res.status(500).json({ 
      message: "Server error while updating password",
      error: error.message
    });
  }
};

export default { loginUser, updatePassword };