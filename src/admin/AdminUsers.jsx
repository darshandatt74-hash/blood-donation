import { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import "./styles/AdminUsers.css";

const AdminUsers = () => {

  const [users,setUsers] = useState([])
  const [search,setSearch] = useState("")

  useEffect(()=>{

    const unsub = onSnapshot(collection(db,"users"),(snap)=>{

      setUsers(
        snap.docs.map(d=>({
          id:d.id,
          ...d.data()
        }))
      )

    })

    return ()=>unsub()

  },[])

  const deleteUser = async(id)=>{

    const confirmDelete = window.confirm("Delete this user?")

    if(!confirmDelete) return

    await deleteDoc(doc(db,"users",id))

  }

  const filteredUsers = users.filter(user =>
    (user.name || "").toLowerCase().includes(search.toLowerCase())
  )

  return (

    <div>

      <h1 className="admin-title">Users</h1>

      <input
      className="search-input"
      placeholder="Search user..."
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      />

      <table className="admin-user-table">

        <thead>

          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {filteredUsers.map(u=>(

            <tr key={u.id}>

              <td>{u.name || "N/A"}</td>
              <td>{u.email}</td>
              <td>{u.role || "user"}</td>

              <td>

                <button
                className="delete-btn"
                onClick={()=>deleteUser(u.id)}
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

export default AdminUsers