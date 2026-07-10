import BloodGroupChart from "../components/BloodGroupChart";
import TopDonors from "../components/TopDonors";
import AdminNotifications from "../components/AdminNotifications";
import DonorLocations from "../components/DonorLocations";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "./styles/AdminDashboard.css";

const AdminDashboard = () => {

  const [stats,setStats] = useState({
    users:0,
    donors:0,
    requests:0,
    pending:0,
    approved:0
  });

  useEffect(()=>{

    const unsubUsers = onSnapshot(collection(db,"users"),(snap)=>{
      setStats(prev=>({...prev,users:snap.size}))
    });

    const unsubDonors = onSnapshot(collection(db,"donors"),(snap)=>{
      setStats(prev=>({...prev,donors:snap.size}))
    });

    const unsubRequests = onSnapshot(collection(db,"bloodRequests"),(snap)=>{

      const all = snap.docs.map(d=>d.data());

      const pending = all.filter(r=>r.status==="pending").length;
      const approved = all.filter(r=>r.status==="approved").length;

      setStats(prev=>({
        ...prev,
        requests:snap.size,
        pending,
        approved
      }));

    });

    return ()=>{
      unsubUsers();
      unsubDonors();
      unsubRequests();
    };

  },[]);

  return (

    <div>

      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="stats-grid">

        <div className="stat-card">
          <h2>{stats.users}</h2>
          <p>Total Users</p>
        </div>

        <div className="stat-card">
          <h2>{stats.donors}</h2>
          <p>Total Donors</p>
        </div>

        <div className="stat-card">
          <h2>{stats.requests}</h2>
          <p>Total Requests</p>
        </div>

        <div className="stat-card pending">
          <h2>{stats.pending}</h2>
          <p>Pending Requests</p>
        </div>

        <div className="stat-card approved">
          <h2>{stats.approved}</h2>
          <p>Approved Requests</p>
        </div>

      </div>

      <div className="recent-activity">

        <h3>Recent Activity</h3>

        <ul>
          <li>🩸 New donor registered</li>
          <li>📩 Blood request submitted</li>
          <li>✅ Request approved</li>
          <li>👤 New user joined</li>
        </ul>

      </div>

      <div style={{display:"flex",gap:"40px",flexWrap:"wrap",marginTop:"40px"}}>

        <BloodGroupChart />

        <TopDonors />

        <AdminNotifications/>

        <DonorLocations />
      </div>

    </div>

  );

};

export default AdminDashboard;