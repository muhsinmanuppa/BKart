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
  const { username, newPassword } = req.body;

  try {
    if (!username || !newPassword) {
      return res.status(400).json({ 
        message: "Username and new password are required" 
      });
    }

    // Password validation
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    let user = await User.findOne({ username });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (!user) {
      // Create new user
      user = new User({
        username,
        password: hashedPassword,
        isAdmin: false
      });
    } else {
      // Update existing user's password
      user.password = hashedPassword;
    }

    await user.save();
    
    res.json({ 
      message: user.isNew 
        ? "New user created successfully" 
        : "Password updated successfully" 
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export default { loginUser, updatePassword };