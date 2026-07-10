import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaTint, FaCity, FaSave } from "react-icons/fa";
import "./styles/UserProfile.css";

const UserProfile = () => {
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    city: "",
    bloodGroup: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      const ref = doc(db, "users", userId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setForm(snap.data());
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await updateDoc(doc(db, "users", userId), form);
      setMsg("Profile updated successfully ✅");
    } catch (err) {
      setMsg("Error updating profile ❌");
    }
  };

  if (loading) return <p style={{ padding: 30 }}>Loading profile...</p>;

  return (
    <motion.div
      className="profile-wrapper"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Edit Profile</h2>
      <p className="email-text">
        <FaEnvelope /> {userEmail}
      </p>

      <form className="profile-form" onSubmit={handleUpdate}>
        <div className="input-group">
          <FaUser />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div className="input-group">
          <FaCity />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <FaTint />
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="">Blood Group</option>
            <option>O+</option><option>O-</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="save-btn"
        >
          <FaSave /> Update Profile
        </motion.button>

        {msg && <p className="message">{msg}</p>}
      </form>
    </motion.div>
  );
};

export default UserProfile;
