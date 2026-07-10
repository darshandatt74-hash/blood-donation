  import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const AdminNotifications = () => {

const [notifications,setNotifications] = useState([]);

useEffect(()=>{

const unsubUsers = onSnapshot(collection(db,"users"),(snap)=>{

setNotifications(prev=>[
...prev,
`👤 ${snap.size} total users registered`
])

})

const unsubRequests = onSnapshot(collection(db,"bloodRequests"),(snap)=>{

setNotifications(prev=>[
...prev,
`🩸 ${snap.size} blood requests created`
])

})

return ()=>{
unsubUsers()
unsubRequests()
}

},[])

return(

<div className="notification-card">

<h3>🔔 Notifications</h3>

<ul>

{notifications.map((n,i)=>(
<li key={i}>{n}</li>
))}

</ul>

</div>

)

}

export default AdminNotifications