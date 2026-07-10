import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const BloodGroupChart = () => {

  const [chartData, setChartData] = useState(null);

  useEffect(() => {

    const unsub = onSnapshot(collection(db, "donors"), (snap) => {

      let counts = {};

      snap.docs.forEach(doc => {
        const bg = doc.data().bloodGroup || "Unknown";
        counts[bg] = (counts[bg] || 0) + 1;
      });

      const data = {
        labels: Object.keys(counts),
        datasets: [
          {
            label: "Blood Groups",
            data: Object.values(counts),
            backgroundColor: [
              "#e53935",
              "#fb8c00",
              "#43a047",
              "#1e88e5",
              "#8e24aa",
              "#fdd835"
            ]
          }
        ]
      };

      setChartData(data);

    });

    return () => unsub();

  }, []);

  // 🔴 Important fix
  if (!chartData) {
    return <p>Loading chart...</p>;
  }

  return (
    <div style={{ width: "350px", marginTop: "30px" }}>
      <h3>Blood Group Statistics</h3>
      <Pie data={chartData} />
    </div>
  );

};

export default BloodGroupChart;