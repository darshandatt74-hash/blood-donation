import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const RequestStatusChart = ({ approved, pending }) => {
  const data = {
    labels: ["Approved", "Pending"],
    datasets: [
      {
        data: [approved, pending],
        backgroundColor: ["#43a047", "#fb8c00"],
      },
    ],
  };

  return <Pie data={data} />;
};

export default RequestStatusChart;
