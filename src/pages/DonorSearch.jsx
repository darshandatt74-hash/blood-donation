import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./styles/DonorSearch.css";

const DonorSearch = () => {
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const donorsPerPage = 6;

  useEffect(() => {
    const fetchDonors = async () => {
      const snapshot = await getDocs(collection(db, "donors"));

      const donorList = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((d) => d.approved !== false); // only approved donors

      setDonors(donorList);
    };

    fetchDonors();
  }, []);

  // 🔎 Filter Logic
  const filteredDonors = donors.filter((donor) => {
    return (
      donor.name?.toLowerCase().includes(search.toLowerCase()) &&
      (bloodFilter === "" || donor.bloodGroup === bloodFilter) &&
      (cityFilter === "" ||
        donor.city?.toLowerCase().includes(cityFilter.toLowerCase())) &&
      (!availableOnly || donor.available === true)
    );
  });

  // 📄 Pagination
  const indexOfLast = currentPage * donorsPerPage;
  const indexOfFirst = indexOfLast - donorsPerPage;
  const currentDonors = filteredDonors.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredDonors.length / donorsPerPage);

  // 🔐 Contact Security
  const handleContact = (phone, type) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login to contact donor");
      navigate("/login");
      return;
    }

    if (type === "call") {
      window.location.href = `tel:${phone}`;
    } else {
      window.open(`https://wa.me/91${phone}`, "_blank");
    }
  };

  return (
    <div className="donor-container">
      <h2 className="title">Find Blood Donors</h2>

      {/* FILTERS */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={bloodFilter}
          onChange={(e) => setBloodFilter(e.target.value)}
        >
          <option value="">All Blood Groups</option>
          <option>A+</option><option>A-</option>
          <option>B+</option><option>B-</option>
          <option>AB+</option><option>AB-</option>
          <option>O+</option><option>O-</option>
        </select>

        <input
          type="text"
          placeholder="Enter City"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        />

        <label className="available-toggle">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Available Only
        </label>
      </div>

      {/* DONOR GRID */}
      <div className="donor-grid">
        {currentDonors.length === 0 ? (
          <div className="empty-state">
            <h3>No donors found</h3>
            <p>Try changing filters</p>
          </div>
        ) : (
          currentDonors.map((donor) => (
            <motion.div
              key={donor.id}
              className="donor-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className={`status-badge ${donor.available ? "available" : "not-available"}`}>
                {donor.available ? "Available" : "Not Available"}
              </div>

              <h3>{donor.name}</h3>
              <p className="blood-group">{donor.bloodGroup}</p>
              <p>📍 {donor.city}</p>

              <div className="contact-buttons">
                <button
                  className="call-btn"
                  onClick={() => handleContact(donor.phone, "call")}
                >
                  Call
                </button>

                <button
                  className="whatsapp-btn"
                  onClick={() => handleContact(donor.phone, "whatsapp")}
                >
                  WhatsApp
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorSearch;