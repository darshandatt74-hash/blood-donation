import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy
} from "firebase/firestore";

import { db, auth } from "../firebase";
import { motion } from "framer-motion";
import {
  FaTint,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaPlusCircle
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";

const Dashboard = () => {

  const navigate = useNavigate();

  const [user,setUser] = useState(null);

  const [requests,setRequests] = useState([]);
  const [donors,setDonors] = useState([]);
  const [notifications,setNotifications] = useState([]);
  const [donations,setDonations] = useState([]);

  const [stats,setStats] = useState({
    total:0,
    approved:0,
    pending:0
  });


/* -------- AUTH LISTENER -------- */

useEffect(()=>{

const unsub = auth.onAuthStateChanged(u=>{
setUser(u);
});

return ()=>unsub();

},[]);


/* ---------------- REQUESTS ---------------- */

useEffect(()=>{

if(!user) return;

const q = query(
collection(db,"bloodRequests"),
where("userId","==",user.uid),
orderBy("createdAt","desc")
);

const unsub = onSnapshot(q,(snap)=>{

const data = snap.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

setRequests(data);

const approved = data.filter(r=>r.status==="approved").length;
const pending = data.filter(r=>r.status==="pending").length;

setStats({
total:data.length,
approved,
pending
});

});

return ()=>unsub();

},[user]);



/* ---------------- DONORS ---------------- */

useEffect(()=>{

const q = query(
collection(db,"donors"),
where("city","==","BHARUCH")
);

const unsub = onSnapshot(q,(snap)=>{

setDonors(
snap.docs.map(doc=>({
id:doc.id,
...doc.data()
}))
);

});

return ()=>unsub();

},[]);



/* ---------------- NOTIFICATIONS ---------------- */

useEffect(() => {

if (!user?.uid) return;

const q = query(
collection(db,"notifications"),
where("userId","==",user.uid)
);

const unsub = onSnapshot(q,(snap)=>{

const data = snap.docs.map(doc => ({
id: doc.id,
...doc.data()
}));

setNotifications(data);

});

return () => unsub();

}, [user?.uid]);


/* ---------------- DONATIONS ---------------- */

useEffect(()=>{

if(!user) return;

const q = query(
collection(db,"donations"),
where("userId","==",user.uid)
);

const unsub = onSnapshot(q,(snap)=>{

setDonations(
snap.docs.map(doc=>({
id:doc.id,
...doc.data()
}))
);

});

return ()=>unsub();

},[user]);



/* ---------------- UI ---------------- */

return (

<div className="dashboard-wrapper">

<h2>User Dashboard</h2>

<p className="welcome-text">
Welcome, {user?.email}
</p>



{/* QUICK ACTIONS */}

<div className="quick-actions">

<button onClick={()=>navigate("/request")}>
<FaPlusCircle/> Request Blood
</button>

<button onClick={()=>navigate("/donors")}>
<FaSearch/> Find Donors
</button>

</div>



{/* STATS */}

<div className="stats-grid">

<motion.div className="stat-card">
<FaTint className="stat-icon red"/>
<h1>{stats.total}</h1>
<p>Total Requests</p>
</motion.div>

<motion.div className="stat-card green">
<FaCheckCircle className="stat-icon"/>
<h1>{stats.approved}</h1>
<p>Approved</p>
</motion.div>

<motion.div className="stat-card yellow">
<FaClock className="stat-icon"/>
<h1>{stats.pending}</h1>
<p>Pending</p>
</motion.div>

</div>



{/* RECENT REQUESTS */}

<h3>Recent Blood Requests</h3>

{requests.length===0 ?(

<p>No blood requests yet</p>

):(

<table className="data-table">

<thead>
<tr>
<th>Patient</th>
<th>Blood</th>
<th>City</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{requests.slice(0,5).map(req=>(

<tr key={req.id}>

<td>{req.patientName}</td>
<td>{req.bloodGroup}</td>
<td>{req.city}</td>

<td>
<span className={`badge ${req.status}`}>
{req.status}
</span>
</td>

</tr>

))}

</tbody>

</table>

)}



{/* NEARBY DONORS */}

<h3>Nearby Donors</h3>

{donors.length===0 ?(

<p>No donors found</p>

):(

<div className="nearby-donors">

{donors.slice(0,5).map(d=>(

<div key={d.id} className="donor-card">

<div>
<span className="donor-name">{d.name}</span>
<br/>
{d.city}
</div>

<span className="donor-blood">
{d.bloodGroup}
</span>

</div>

))}

</div>

)}



{/* NOTIFICATIONS */}

<h3>Notifications</h3>

{notifications.length === 0 ? (

<p>No notifications</p>

) : (

<div className="notification-box">

{notifications.slice(0,5).map(n => (

<div key={n.id} className="notification-item">

🔔 {n.message}

</div>

))}

</div>

)}


{/* DONATION HISTORY */}

<h3>Donation History</h3>

{donations.length===0 ?(

<p>No donations yet</p>

):( 

<ul className="donation-list">

{donations.map(d=>(

<li key={d.id} className="donation-item">

🩸 {d.bloodGroup} donated at {d.hospital}

</li>

))}

</ul>

)}

</div>

);

};

export default Dashboard;