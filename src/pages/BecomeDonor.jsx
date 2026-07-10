import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaPhoneAlt, FaTint, FaCity, FaHeartbeat } from "react-icons/fa";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./styles/BecomeDonor.css";

const BecomeDonor = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    city: "",
    available: true,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    // Allow only numbers in phone field
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setForm({ ...form, phone: numericValue });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  const validateForm = () => {
    if (form.name.trim().length < 3) {
      return "Name must be at least 3 characters";
    }

    if (!/^\d{10}$/.test(form.phone)) {
      return "Phone number must be exactly 10 digits";
    }

    if (!form.bloodGroup) {
      return "Please select blood group";
    }

    if (form.city.trim().length < 2) {
      return "City must be at least 2 characters";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      setError("Please login first");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await addDoc(collection(db, "donors"), {
        ...form,
        approved: false,
        userId: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      alert("🎉 You are now registered as a donor!");

      setForm({
        name: "",
        phone: "",
        bloodGroup: "",
        city: "",
        available: true,
      });

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donor-wrapper">
      <motion.div
        className="donor-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2><FaHeartbeat /> Become a Blood Donor</h2>
        <p className="subtitle">
          One donation can save <b>3 lives</b> ❤️
        </p>

        <form onSubmit={handleSubmit}>
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
            <FaPhoneAlt />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              maxLength="10"
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
              <option value="">Select Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
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

          <label className="checkbox">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
            />
            Available to donate
          </label>

          {error && <p className="form-error">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Become Donor"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default BecomeDonor;
