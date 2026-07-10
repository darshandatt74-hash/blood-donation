import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaTint,
  FaUserPlus,
  FaSearch,
  FaHeartbeat,
} from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CountUp from "react-countup";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [donorCount, setDonorCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  // 🔥 Fetch Live Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const donorsSnapshot = await getDocs(collection(db, "donors"));
        const requestsSnapshot = await getDocs(
          collection(db, "bloodRequests")
        );

        setDonorCount(donorsSnapshot.size);
        setRequestCount(requestsSnapshot.size);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      {/* ================= HERO ================= */}
      <div className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>
            <FaTint className="hero-icon" />
            Donate Blood, Save Lives
          </h1>

          <p>
            Your one donation can save up to 3 lives.
            Join our community and become someone’s hero today.
          </p>

          <div className="hero-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="primary-btn"
              onClick={() => navigate("/request")}
            >
              Request Blood
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="secondary-btn"
              onClick={() => navigate("/become-donor")}
            >
              Become Donor
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="features">
        <motion.div
          className="card"
          whileHover={{ scale: 1.07 }}
          onClick={() => navigate("/become-donor")}
        >
          <FaTint className="icon red" />
          <h3>Donate Blood</h3>
          <p>Register and become a life saver in your city.</p>
        </motion.div>

        <motion.div
          className="card"
          whileHover={{ scale: 1.07 }}
          onClick={() => navigate("/register")}
        >
          <FaUserPlus className="icon blue" />
          <h3>Register Account</h3>
          <p>Create your profile and join our donor network.</p>
        </motion.div>

        <motion.div
          className="card"
          whileHover={{ scale: 1.07 }}
          onClick={() => navigate("/donors")}
        >
          <FaSearch className="icon green" />
          <h3>Find Donor</h3>
          <p>Search verified donors by blood group and city.</p>
        </motion.div>

        <motion.div
          className="card"
          whileHover={{ scale: 1.07 }}
          onClick={() => navigate("/request")}
        >
          <FaHeartbeat className="icon pink" />
          <h3>Emergency Help</h3>
          <p>Need blood urgently? Send a quick request now.</p>
        </motion.div>
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <div className="how-section">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>

        <div className="how-steps">
          <motion.div className="step-card" whileHover={{ scale: 1.05 }}>
            <div className="step-number">1</div>
            <FaUserPlus className="step-icon blue" />
            <h3>Register</h3>
            <p>Create your account and join our donor community.</p>
          </motion.div>

          <motion.div className="step-card" whileHover={{ scale: 1.05 }}>
            <div className="step-number">2</div>
            <FaTint className="step-icon red" />
            <h3>Donate / Request</h3>
            <p>Donate blood or request during emergencies.</p>
          </motion.div>

          <motion.div className="step-card" whileHover={{ scale: 1.05 }}>
            <div className="step-number">3</div>
            <FaHeartbeat className="step-icon pink" />
            <h3>Save Lives</h3>
            <p>Connect and help save precious lives.</p>
          </motion.div>
        </div>
      </div>

      {/* ================= LIVE STATS ================= */}
      <div className="stats-section">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Live Statistics
        </motion.h2>

        <div className="stats-grid">
          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <h3>
              <CountUp end={donorCount} duration={2} />
            </h3>
            <p>Total Donors</p>
          </motion.div>

          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <h3>
              <CountUp end={requestCount} duration={2} />
            </h3>
            <p>Total Requests</p>
          </motion.div>

          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <h3>
              <CountUp end={donorCount + requestCount} duration={2} />
            </h3>
            <p>Lives Impacted</p>
          </motion.div>
        </div>
      </div>
            {/* ================= EMERGENCY SECTION ================= */}
      <div className="emergency-section">
        <motion.div
          className="emergency-content"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FaHeartbeat className="emergency-icon" />

          <h2>Need Blood Urgently?</h2>

          <p>
            Our network is available 24/7 to help you during emergencies.
            Contact us immediately.
          </p>

          <a href="tel:+919876543210" className="call-btn">
           Call Now: +91 9876543210
          </a>
        </motion.div>
      </div> 
      
            {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-container">

          <div className="footer-section">
            <h3>Blood Donation</h3>
            <p>
              We connect donors with patients in need.
              Together we can save lives.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <p onClick={() => navigate("/")}>Home</p>
            <p onClick={() => navigate("/donors")}>Find Donor</p>
            <p onClick={() => navigate("/request")}>Request Blood</p>
            <p onClick={() => navigate("/become-donor")}>Become Donor</p>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@blooddonation.com</p>
            <p>Phone: +91 9876543210</p>
            <p>Available 24/7</p>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Blood Donation | All Rights Reserved
        </div>
      </footer>


    </>
  );
};

export default Home;
