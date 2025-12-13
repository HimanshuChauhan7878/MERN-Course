import { useState, useEffect } from "react";
import { analyticsAPI, challanAPI, adminAPI } from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showChallanForm, setShowChallanForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [challanForm, setChallanForm] = useState({
    vehicleNumber: "",
    ownerId: "",
    violationType: "",
    fineAmount: "",
    description: ""
  });
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filter]);

  useEffect(() => {
    if (showChallanForm && searchUser) {
      fetchUsers();
    }
  }, [searchUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, challansData] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        challanAPI.getAllChallans(filter !== "all" ? { status: filter } : {})
      ]);
      setStats(statsData.stats);
      setChallans(challansData.challans);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers(searchUser);
      setUsers(response.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleVehicleSearch = async () => {
    if (!challanForm.vehicleNumber) return;
    try {
      const response = await adminAPI.searchVehicle(challanForm.vehicleNumber);
      setVehicleInfo(response.vehicle);
      setChallanForm({
        ...challanForm,
        ownerId: response.vehicle.ownerId._id
      });
    } catch (error) {
      setVehicleInfo(null);
      alert("Vehicle not found. You can still create challan by selecting owner manually.");
    }
  };

  const handleChallanSubmit = async (e) => {
    e.preventDefault();
    if (!challanForm.vehicleNumber || !challanForm.ownerId || !challanForm.violationType || !challanForm.fineAmount) {
      alert("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await adminAPI.createChallan(challanForm);
      alert("Challan created successfully!");
      setChallanForm({
        vehicleNumber: "",
        ownerId: "",
        violationType: "",
        fineAmount: "",
        description: ""
      });
      setVehicleInfo(null);
      setShowChallanForm(false);
      fetchData(); // Refresh data
    } catch (error) {
      alert("Failed to create challan: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700" }}>
            Admin Dashboard
          </h1>
          <button
            onClick={() => setShowChallanForm(!showChallanForm)}
            className="btn btn-primary"
          >
            {showChallanForm ? "Cancel" : "+ Log Challan"}
          </button>
        </div>

        {/* Challan Logging Form */}
        {showChallanForm && (
          <div className="card" style={{ marginBottom: "40px", background: "#f0f9ff", border: "2px solid #bae6fd" }}>
            <h2 style={{ marginBottom: "24px", fontSize: "24px" }}>Log New Challan</h2>
            <form onSubmit={handleChallanSubmit}>
              <div className="grid grid-2">
                <div className="input-group">
                  <label>Vehicle Number *</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      value={challanForm.vehicleNumber}
                      onChange={(e) => setChallanForm({ ...challanForm, vehicleNumber: e.target.value })}
                      placeholder="e.g., RJ14AB1234"
                      style={{ flex: 1, textTransform: "uppercase" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleVehicleSearch}
                      className="btn btn-outline"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Search
                    </button>
                  </div>
                  {vehicleInfo && (
                    <div style={{ marginTop: "8px", padding: "8px", background: "#d1fae5", borderRadius: "4px", fontSize: "14px" }}>
                      <strong>Owner:</strong> {vehicleInfo.ownerId.name} ({vehicleInfo.ownerId.email})
                    </div>
                  )}
                </div>

                <div className="input-group">
                  <label>Select Owner *</label>
                  <div>
                    <input
                      type="text"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      placeholder="Search owner by name, email, or phone"
                      style={{ marginBottom: "8px" }}
                    />
                    <select
                      value={challanForm.ownerId}
                      onChange={(e) => setChallanForm({ ...challanForm, ownerId: e.target.value })}
                      required
                    >
                      <option value="">Select owner</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} - {user.email}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-2">
                <div className="input-group">
                  <label>Violation Type *</label>
                  <select
                    value={challanForm.violationType}
                    onChange={(e) => setChallanForm({ ...challanForm, violationType: e.target.value })}
                    required
                  >
                    <option value="">Select violation type</option>
                    <option value="Helmet">Helmet</option>
                    <option value="Speeding">Speeding</option>
                    <option value="Red Light">Red Light</option>
                    <option value="Wrong Parking">Wrong Parking</option>
                    <option value="Triple Riding">Triple Riding</option>
                    <option value="No License">No License</option>
                    <option value="Drunk Driving">Drunk Driving</option>
                    <option value="Wrong Lane">Wrong Lane</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Fine Amount (₹) *</label>
                  <input
                    type="number"
                    value={challanForm.fineAmount}
                    onChange={(e) => setChallanForm({ ...challanForm, fineAmount: e.target.value })}
                    placeholder="Enter fine amount"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea
                  value={challanForm.description}
                  onChange={(e) => setChallanForm({ ...challanForm, description: e.target.value })}
                  placeholder="Enter violation description (optional)"
                  rows="3"
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create Challan"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChallanForm(false);
                    setChallanForm({
                      vehicleNumber: "",
                      ownerId: "",
                      violationType: "",
                      fineAmount: "",
                      description: ""
                    });
                    setVehicleInfo(null);
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-4" style={{ marginBottom: "40px" }}>
          <div className="stats-card">
            <h3>Total Challans</h3>
            <div className="value">{stats?.totalChallans || 0}</div>
          </div>
          <div className="stats-card" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
            <h3>Pending</h3>
            <div className="value">{stats?.pendingChallans || 0}</div>
          </div>
          <div className="stats-card" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
            <h3>Paid</h3>
            <div className="value">{stats?.paidChallans || 0}</div>
          </div>
          <div className="stats-card" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}>
            <h3>Revenue</h3>
            <div className="value">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
          </div>
        </div>

        {/* Violations by Type Chart */}
        <div className="card" style={{ marginBottom: "40px" }}>
          <h2 style={{ marginBottom: "24px", fontSize: "24px" }}>Violations by Type</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {stats?.violationsByType?.map((item, index) => (
              <div key={index}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontWeight: "600" }}>{item._id || "Unknown"}</span>
                  <span style={{ color: "var(--primary)", fontWeight: "700" }}>{item.count}</span>
                </div>
                <div style={{
                  height: "8px",
                  background: "#e5e7eb",
                  borderRadius: "4px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${(item.count / stats.totalChallans) * 100}%`,
                    background: `hsl(${index * 60}, 70%, 50%)`,
                    transition: "width 0.3s ease"
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Repeat Offenders */}
        {stats?.repeatOffenders?.length > 0 && (
          <div className="card" style={{ marginBottom: "40px" }}>
            <h2 style={{ marginBottom: "24px", fontSize: "24px" }}>Repeat Offenders</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ padding: "12px", textAlign: "left" }}>Vehicle Number</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Violations</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.repeatOffenders.map((offender, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "12px" }}>{offender._id}</td>
                      <td style={{ padding: "12px" }}>
                        <span className="badge badge-danger">{offender.count} violations</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Challans List */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "24px" }}>Recent Challans</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "2px solid #e5e7eb" }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

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
                {challans.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: "24px", textAlign: "center", color: "var(--gray)" }}>
                      No challans found
                    </td>
                  </tr>
                ) : (
                  challans.map((challan) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
