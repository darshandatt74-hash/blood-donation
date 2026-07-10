import { useEffect,useState } from "react"
import { collection,onSnapshot,doc,updateDoc,deleteDoc } from "firebase/firestore"
import { db } from "../firebase"
import "./styles/AdminDonors.css"

const AdminDonors = ()=>{

const [donors,setDonors] = useState([])
const [search,setSearch] = useState("")

useEffect(()=>{

const unsub = onSnapshot(collection(db,"donors"),(snap)=>{

const list = snap.docs.map(doc=>({
id:doc.id,
...doc.data()
}))

setDonors(list)

})

return ()=>unsub()

},[])

const approveDonor = async(id)=>{
await updateDoc(doc(db,"donors",id),{approved:true})
}

const deleteDonor = async(id)=>{
if(window.confirm("Delete donor?")){
await deleteDoc(doc(db,"donors",id))
}
}

const filteredDonors = donors.filter(d =>
(d.name || "").toLowerCase().includes(search.toLowerCase())
)

return(

<div className="admin-page">

<h2>Donors</h2>

<input
className="search-input"
placeholder="Search donor..."
onChange={(e)=>setSearch(e.target.value)}
/>

<table>

<thead>

<tr>
<th>Name</th>
<th>Blood Group</th>
<th>City</th>
<th>Phone</th>
<th>Status</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{filteredDonors.map(d=>(

<tr key={d.id}>

<td>{d.name}</td>
<td>{d.bloodGroup}</td>
<td>{d.city}</td>
<td>{d.phone}</td>

<td>

{d.approved ?
<span className="status approved">Approved</span>
:
<span className="status pending">Pending</span>
}

</td>

<td>

{!d.approved && (
<button
className="btn approve"
onClick={()=>approveDonor(d.id)}
>
Approve
</button>
)}

<button
className="btn delete"
onClick={()=>deleteDonor(d.id)}
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}

export default AdminDonors