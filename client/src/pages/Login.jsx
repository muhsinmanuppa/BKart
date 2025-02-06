import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Handle Login Form
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/admin");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  // Trigger to show password reset form
  const handleForgotPassword = () => {
    setShowResetForm(true);
  };

  // Handle Password Reset
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/update-password`, {
        username: "admin",  // Static username, change if dynamic
        newPassword,        // Only send newPassword
      });
      alert("Password updated successfully!");
      setShowResetForm(false);
    } catch (err) {
      alert("Error updating password");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Login</h2>
      {!showResetForm ? (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="form-control mb-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary w-100">Login</button>
        </form>
      ) : (
        <form onSubmit={handleUpdatePassword}>
          <input type="text" className="form-control mb-2" value="admin" disabled />
          <input
            type="password"
            placeholder="New Password"
            className="form-control mb-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="form-control mb-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="btn btn-success w-100">Update Password</button>
        </form>
      )}
      {!showResetForm && (
        <button
          className="btn btn-link mt-2"
          onClick={handleForgotPassword}
          disabled={showResetForm} // Disable button when reset form is shown
        >
          Forgot Password?
        </button>
      )}
    </div>
  );
}

export default Login;
