import { useState, useEffect } from "react";
import { challanAPI, paymentAPI } from "../services/api";

const CitizenDashboard = () => {
  const [challans, setChallans] = useState([]);
  const [searchVehicle, setSearchVehicle] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    fetchMyChallans();
  }, []);

  const fetchMyChallans = async () => {
    try {
      setLoading(true);
      const response = await challanAPI.getMyChallans();
      setChallans(response.challans);
    } catch (error) {
      console.error("Error fetching challans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchVehicle.trim()) return;
    try {
      setLoading(true);
      const response = await challanAPI.getChallanByVehicle(searchVehicle);
      setSearchResults(response.challans);
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (challanId) => {
    try {
      setPayingId(challanId);
      await paymentAPI.create(challanId);
      alert("Payment successful! Your challan has been paid.");
      fetchMyChallans();
      if (searchResults.length > 0) {
        handleSearch();
      }
    } catch (error) {
      alert("Payment failed: " + error.message);
    } finally {
      setPayingId(null);
    }
  };

  const displayChallans = searchResults.length > 0 ? searchResults : challans;

  return (
    <div style={{ padding: "40px 20px" }}>
      <div className="container">
        <h1 style={{ fontSize: "32px", marginBottom: "32px", fontWeight: "700" }}>
          Citizen Dashboard
        </h1>

        {/* Search Section */}
        <div className="card" style={{ marginBottom: "40px" }}>
          <h2 style={{ marginBottom: "24px", fontSize: "24px" }}>Search Challan by Vehicle</h2>
          <div style={{ display: "flex", gap: "12px" }}>
            <input
              type="text"
              value={searchVehicle}
              onChange={(e) => setSearchVehicle(e.target.value)}
              placeholder="Enter vehicle number (e.g., RJ14AB1234)"
              style={{ flex: 1, padding: "12px 16px", borderRadius: "8px", border: "2px solid #e5e7eb" }}
            />
            <button onClick={handleSearch} className="btn btn-primary" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
            {searchResults.length > 0 && (
              <button
                onClick={() => {
                  setSearchResults([]);
                  setSearchVehicle("");
                }}
                className="btn btn-outline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-3" style={{ marginBottom: "40px" }}>
          <div className="card">
            <h3 style={{ fontSize: "14px", color: "var(--gray)", marginBottom: "8px" }}>Total Challans</h3>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "var(--primary)" }}>
              {challans.length}
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontSize: "14px", color: "var(--gray)", marginBottom: "8px" }}>Pending</h3>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "var(--warning)" }}>
              {challans.filter(c => c.status === "pending").length}
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontSize: "14px", color: "var(--gray)", marginBottom: "8px" }}>Paid</h3>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "var(--secondary)" }}>
              {challans.filter(c => c.status === "paid").length}
            </div>
          </div>
        </div>

        {/* Challans List */}
        <div className="card">
          <h2 style={{ marginBottom: "24px", fontSize: "24px" }}>
            {searchResults.length > 0 ? "Search Results" : "My Challans"}
          </h2>

          {loading && !displayChallans.length ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : displayChallans.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--gray)" }}>
              <p style={{ fontSize: "18px", marginBottom: "8px" }}>No challans found</p>
              <p>Search for a vehicle number or wait for challans to be issued to your account.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {displayChallans.map((challan) => (
                <div
                  key={challan._id}
                  style={{
                    padding: "20px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px"
                  }}
                >
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <div style={{ display: "flex", gap: "16px", marginBottom: "8px", flexWrap: "wrap" }}>
                      <div>
                        <span style={{ fontSize: "12px", color: "var(--gray)" }}>Challan ID</span>
                        <p style={{ fontWeight: "600" }}>{challan._id.slice(-8)}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: "12px", color: "var(--gray)" }}>Vehicle</span>
                        <p style={{ fontWeight: "600" }}>{challan.vehicleNumber}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: "12px", color: "var(--gray)" }}>Violation</span>
                        <p style={{ fontWeight: "600" }}>{challan.violationType}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                      <div>
                        <span style={{ fontSize: "12px", color: "var(--gray)" }}>Fine Amount</span>
                        <p style={{ fontSize: "20px", fontWeight: "700", color: "var(--primary)" }}>
                          ₹{challan.fineAmount}
                        </p>
                      </div>
                      <span className={`badge ${
                        challan.status === "paid" ? "badge-success" :
                        challan.status === "pending" ? "badge-warning" : "badge-danger"
                      }`}>
                        {challan.status}
                      </span>
                      <span style={{ fontSize: "14px", color: "var(--gray)" }}>
                        {new Date(challan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {challan.status === "pending" && (
                    <button
                      onClick={() => handlePayment(challan._id)}
                      className="btn btn-primary"
                      disabled={payingId === challan._id}
                    >
                      {payingId === challan._id ? "Processing..." : "Pay Now"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
