import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const DonorLocations = () => {

  const [locations, setLocations] = useState({});

  useEffect(() => {

    const unsub = onSnapshot(collection(db, "donors"), (snap) => {

      const counts = {};

      snap.docs.forEach(doc => {

        const city = doc.data().city || "Unknown";

        counts[city] = (counts[city] || 0) + 1;

      });

      setLocations(counts);

    });

    return () => unsub();

  }, []);

  return (

    <div className="location-card">

      <h3>📍 Donor Locations</h3>

      <ul>

        {Object.entries(locations).map(([city, count], i) => (

          <li key={i}>
            {city} → {count} donors
          </li>

        ))}

      </ul>

    </div>

  );

};

export default DonorLocations;