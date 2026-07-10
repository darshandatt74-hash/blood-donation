import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaPhoneAlt, FaTint, FaCity, FaHospital } from "react-icons/fa";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./styles/RequestBlood.css";

const RequestBlood = () => {

  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    bloodGroup: "",
    city: "",
    hospital: "",
    address: "",
    units: 1,
    priority: "normal",
  });

  const [hospitals, setHospitals] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validatePhone = (phone) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone);
  };

  /* LOAD HOSPITALS FROM FIRESTORE */

  useEffect(() => {

    const loadHospitals = async () => {

      const snapshot = await getDocs(collection(db, "hospitals"));

      const hospitalList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setHospitals(hospitalList);

    };

    loadHospitals();

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    if (!validatePhone(form.phone)) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    try {

      /* CHECK PENDING REQUEST */

      const q = query(
        collection(db, "bloodRequests"),
        where("userId", "==", user.uid),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert("You already have a pending request");
        return;
      }

      /* SAVE REQUEST */

      await addDoc(collection(db, "bloodRequests"), {
        ...form,
        userId: user.uid,
        email: user.email,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("Blood request submitted successfully");

      setForm({
        patientName: "",
        phone: "",
        bloodGroup: "",
        city: "",
        hospital: "",
        address: "",
        units: 1,
        priority: "normal",
      });

    } catch (error) {
      console.error(error);
      alert("Error submitting request");
    }
  };

  return (
    <div className="request-wrapper">
      <motion.div
        className="request-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>🩸 Request Blood</h2>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <FaUser />
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              value={form.patientName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaPhoneAlt />
            <input
              type="text"
              name="phone"
              placeholder="Mobile Number"
              value={form.phone}
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

          {/* HOSPITAL DROPDOWN */}

          <div className="input-group">
            <FaHospital />
            <select
              name="hospital"
              value={form.hospital}
              onChange={handleChange}
              required
            >

              <option value="">Select Hospital</option>

              {hospitals.map((h) => (
                <option key={h.id} value={h.name}>
                  {h.name} - {h.city}
                </option>
              ))}

            </select>
          </div>

          <textarea
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <div className="two-column">

            <select
              name="units"
              value={form.units}
              onChange={handleChange}
            >
              <option value="1">1 Unit</option>
              <option value="2">2 Units</option>
              <option value="3">3 Units</option>
              <option value="4">4 Units</option>
            </select>

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>

          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="submit-btn"
          >
            Submit Request
          </motion.button>

        </form>
      </motion.div>
    </div>
  );
};

export default RequestBlood;