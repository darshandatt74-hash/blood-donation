import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase";
import "./styles/AdminHospitals.css";

const AdminHospitals = () => {

  const [hospitals,setHospitals] = useState([]);

  const [form,setForm] = useState({
    name:"",
    city:"",
    contact:""
  });

  useEffect(()=>{

    const unsub = onSnapshot(collection(db,"hospitals"),(snap)=>{

      const list = snap.docs.map(d=>({
        id:d.id,
        ...d.data()
      }));

      setHospitals(list);

    });

    return ()=>unsub();

  },[])

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const addHospital = async ()=>{

    if(!form.name || !form.city || !form.contact){
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db,"hospitals"),form);

    setForm({
      name:"",
      city:"",
      contact:""
    });

  };

  const deleteHospital = async(id)=>{
    await deleteDoc(doc(db,"hospitals",id));
  }

  return (

    <div className="admin-page">

      <h1 className="admin-title">🏥 Hospital Management</h1>

      <div className="hospital-form">

        <input
        name="name"
        placeholder="Hospital Name"
        value={form.name}
        onChange={handleChange}
        />

        <input
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
        />

        <input
        name="contact"
        placeholder="Contact"
        value={form.contact}
        onChange={handleChange}
        />

        <button onClick={addHospital}>
          Add Hospital
        </button>

      </div>


      <table className="hospital-table">

        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Contact</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

        {hospitals.length===0 && (
          <tr>
            <td colSpan="4">No hospitals found</td>
          </tr>
        )}

        {hospitals.map(h=>(
          <tr key={h.id}>

            <td>{h.name}</td>
            <td>{h.city}</td>
            <td>{h.contact}</td>

            <td>
              <button
              className="delete-btn"
              onClick={()=>deleteHospital(h.id)}
              >
              Delete
              </button>
            </td>

          </tr>
        ))}

        </tbody>

      </table>

    </div>
  );
};

export default AdminHospitals;