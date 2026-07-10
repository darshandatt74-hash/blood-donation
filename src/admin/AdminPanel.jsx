import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🔹 Fetch blood requests
  const fetchRequests = async () => {
    const snapshot = await getDocs(collection(db, "bloodRequests"));
    setRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  // 🔹 Approve request
  const approveRequest = async (id) => {
    await updateDoc(doc(db, "bloodRequests", id), {
      status: "approved"
    });
    fetchRequests();
  };

  // 🔹 Delete request
  const deleteRequest = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this request?");
    if (!confirm) return;

    await deleteDoc(doc(db, "bloodRequests", id));
    fetchRequests();
  };

  // 🔹 Logout admin
  const logoutAdmin = async () => {
    await signOut(auth);
    navigate("/admin-login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Panel</h2>

      {/* 🔥 ADMIN NAVIGATION BUTTONS */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/admin-dashboard")}>
          Dashboard
        </button>{" "}
        <button onClick={() => navigate("/admin-users")}>
          Manage Users
        </button>{" "}
        <button onClick={() => navigate("/admin-donors")}>
          Manage Donors
        </button>{" "}
        <button onClick={() => navigate("/admin")}>
          Blood Requests
        </button>{" "}
        <button
          onClick={logoutAdmin}
          style={{ background: "red", color: "white" }}
        >
          Logout
        </button>
      </div>

      <hr />

      <h3>Blood Requests</h3>

      {requests.length === 0 && <p>No blood requests found</p>}

      {requests.map(req => (
        <div
          key={req.id}
          style={{
            border: "1px solid gray",
            margin: "10px 0",
            padding: "10px",
            borderRadius: "5px"
          }}
        >
          <p><b>Patient:</b> {req.patientName}</p>
          <p><b>Blood Group:</b> {req.bloodGroup}</p>
          <p><b>City:</b> {req.city}</p>
          <p><b>Status:</b> {req.status}</p>

          {req.status !== "approved" && (
            <button onClick={() => approveRequest(req.id)}>
              Approve
            </button>
          )}{" "}

          <button
            onClick={() => deleteRequest(req.id)}
            style={{ background: "red", color: "white" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
