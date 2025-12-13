import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { challanAPI } from "../services/api";

const OfficerDashboard = () => {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0
  });

  useEffect(() => {
    fetchChallans();
  }, []);

  const fetchChallans = async () => {
    try {
      setLoading(true);
      const response = await challanAPI.getAllChallans();
      setChallans(response.challans.slice(0, 10)); // Show recent 10
      
      // Calculate stats
      const total = response.challans.length;
      const pending = response.challans.filter(c => c.status === "pending").length;
      const paid = response.challans.filter(c => c.status === "paid").length;
      setStats({ total, pending, paid });
    } catch (error) {
      console.error("Error fetching challans:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 20px" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700" }}>
            Officer Dashboard
          </h1>
          <Link to="/officer/upload" className="btn btn-primary">
            + Record Violation
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-3" style={{ marginBottom: "40px" }}>
          <div className="card">
            <h3 style={{ fontSize: "14px", color: "var(--gray)", marginBottom: "8px" }}>Total Challans</h3>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "var(--primary)" }}>
              {stats.total}
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontSize: "14px", color: "var(--gray)", marginBottom: "8px" }}>Pending</h3>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "var(--warning)" }}>
              {stats.pending}
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontSize: "14px", color: "var(--gray)", marginBottom: "8px" }}>Paid</h3>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "var(--secondary)" }}>
              {stats.paid}
            </div>
          </div>
        </div>

        {/* Recent Challans */}
        <div className="card">
          <h2 style={{ marginBottom: "24px", fontSize: "24px" }}>Recent Challans</h2>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : challans.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--gray)" }}>
              <p style={{ fontSize: "18px", marginBottom: "8px" }}>No challans found</p>
              <Link to="/officer/upload" className="btn btn-primary" style={{ marginTop: "16px" }}>
                Record Your First Violation
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ padding: "12px", textAlign: "left" }}>Challan ID</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Vehicle</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Violation</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Fine</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {challans.map((challan) => (
                    <tr key={challan._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "12px" }}>{challan._id.slice(-8)}</td>
                      <td style={{ padding: "12px" }}>{challan.vehicleNumber}</td>
                      <td style={{ padding: "12px" }}>{challan.violationType}</td>
                      <td style={{ padding: "12px", fontWeight: "600" }}>₹{challan.fineAmount}</td>
                      <td style={{ padding: "12px" }}>
                        <span className={`badge ${
                          challan.status === "paid" ? "badge-success" :
                          challan.status === "pending" ? "badge-warning" : "badge-danger"
                        }`}>
                          {challan.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px", color: "var(--gray)", fontSize: "14px" }}>
                        {new Date(challan.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
