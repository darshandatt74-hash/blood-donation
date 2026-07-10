import { useEffect, useState } from "react";
import {
collection,
onSnapshot,
doc,
updateDoc,
addDoc,
serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase";
import "./styles/AdminBloodRequests.css";

const AdminBloodRequests = () => {

const [requests,setRequests] = useState([]);

/* FETCH REQUESTS */

useEffect(()=>{

const unsub = onSnapshot(collection(db,"bloodRequests"),(snap)=>{

setRequests(
snap.docs.map(d=>({
id:d.id,
...d.data()
}))
)

})

return ()=>unsub()

},[])


/* APPROVE / REJECT */

const updateStatus = async(req,status)=>{

await updateDoc(doc(db,"bloodRequests",req.id),{
status
})

await addDoc(collection(db,"notifications"),{

userId:req.userId,
message:`Your blood request for ${req.bloodGroup} has been ${status}`,
createdAt:serverTimestamp()

})

}


/* COMPLETE DONATION */

const completeDonation = async(req)=>{

await updateDoc(doc(db,"bloodRequests",req.id),{
status:"completed"
})

/* ADD TO DONATION HISTORY */

await addDoc(collection(db,"donations"),{

userId:req.userId,
bloodGroup:req.bloodGroup,
hospital:req.hospital,
city:req.city,
createdAt:serverTimestamp()

})

await addDoc(collection(db,"notifications"),{

userId:req.userId,
message:`Your blood donation has been completed`,
createdAt:serverTimestamp()

})

}


return(

<div>

<h1 className="admin-title">Blood Requests</h1>

<table className="request-table">

<thead>

<tr>
<th>Patient</th>
<th>Blood Group</th>
<th>City</th>
<th>Contact</th>
<th>Status</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{requests.map(r=>(

<tr
key={r.id}
className={r.priority==="emergency" ? "emergency-row":""}
>

<td>{r.patientName}</td>
<td>{r.bloodGroup}</td>
<td>{r.city}</td>
<td>{r.phone}</td>

<td>

<span className={`status ${r.status}`}>
{r.status || "pending"}
</span>

</td>

<td>

<button
className="approve"
onClick={()=>updateStatus(r,"approved")}
>
Approve
</button>

<button
className="reject"
onClick={()=>updateStatus(r,"rejected")}
>
Reject
</button>

<button
className="complete"
onClick={()=>completeDonation(r)}
>
Complete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}

export default AdminBloodRequests