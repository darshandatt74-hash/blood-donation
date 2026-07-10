import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./styles/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await signInWithEmailAndPassword(auth, email, password);

      // 🔴 EMAIL VERIFICATION CHECK
      if (!res.user.emailVerified) {
        await sendEmailVerification(res.user); // resend verification
        alert("Please verify your email first. Verification link sent again.");
        return;
      }

      // ✅ Store user data
      localStorage.setItem("userId", res.user.uid);
      localStorage.setItem("userEmail", res.user.email);

      navigate("/dashboard");

    } catch (error) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Login"}
        </button>

        <p className="switch-text">
          New user?{" "}
          <span onClick={() => navigate("/register")}>
            Create account
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;