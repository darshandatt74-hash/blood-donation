 import React from "react";

const AdminCard = ({ title, count }) => {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <h1>{count}</h1>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "20px",
    width: "220px",
    textAlign: "center",
    borderRadius: "10px",
    background: "#f9f9f9",
  },
};

export default AdminCard;
