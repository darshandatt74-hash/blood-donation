import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function DonorList() {
  const [donors, setDonors] = useState([]);
  const [blood, setBlood] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const data = await getDocs(collection(db, "donors"));
      setDonors(data.docs.map(d => d.data()));
    };
    fetch();
  }, []);

  const filtered = donors.filter(d =>
    (blood === "" || d.blood === blood) &&
    (city === "" || d.city === city)
  );

  return (
    <div>
      <h2>Donor List</h2>

      <select onChange={(e)=>setBlood(e.target.value)}>
        <option value="">All Blood</option>
        <option>A+</option><option>B+</option><option>O+</option><option>AB+</option><option>A-</option><option>B-</option><option>O-</option><option>AB-</option>
      </select>

      <input placeholder="City" onChange={(e)=>setCity(e.target.value)} />

      {filtered.map((d,i)=>(
        <p key={i}>{d.name} | {d.blood} | {d.city}</p>
      ))}
    </div>
  );
}
export default DonorList;
