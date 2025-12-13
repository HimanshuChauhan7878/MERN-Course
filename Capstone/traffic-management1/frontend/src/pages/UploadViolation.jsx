import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { violationAPI } from "../services/api";

const UploadViolation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    violationType: "",
    location: {
      lat: "",
      lng: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const violationTypes = [
    "Helmet",
    "Speeding",
    "Red Light",
    "Wrong Parking",
    "Triple Riding",
    "No License",
    "Drunk Driving",
    "Wrong Lane"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "lng") {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        vehicleNumber: formData.vehicleNumber.toUpperCase(),
        violationType: formData.violationType,
        location: formData.location.lat && formData.location.lng
          ? {
              lat: parseFloat(formData.location.lat),
              lng: parseFloat(formData.location.lng)
            }
          : undefined
      };

      const response = await violationAPI.create(payload);
      setSuccess("Violation recorded successfully! Challan has been issued.");
      
      // Reset form
      setFormData({
        vehicleNumber: "",
        violationType: "",
        location: { lat: "", lng: "" }
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/officer/dashboard");
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to record violation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 20px" }}>
      <div className="container" style={{ maxWidth: "600px" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "32px", fontWeight: "700" }}>
          Record Violation
        </h1>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Vehicle Number *</label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
                placeholder="e.g., RJ14AB1234"
                style={{ textTransform: "uppercase" }}
              />
            </div>

            <div className="input-group">
              <label>Violation Type *</label>
              <select
                name="violationType"
                value={formData.violationType}
                onChange={handleChange}
                required
              >
                <option value="">Select violation type</option>
                {violationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Location (Optional)</label>
              <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                <input
                  type="number"
                  name="lat"
                  value={formData.location.lat}
                  onChange={handleChange}
                  placeholder="Latitude"
                  step="any"
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  name="lng"
                  value={formData.location.lng}
                  onChange={handleChange}
                  placeholder="Longitude"
                  step="any"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="btn btn-outline"
                  style={{ whiteSpace: "nowrap" }}
                >
                  📍 Get Location
                </button>
              </div>
              <p style={{ fontSize: "12px", color: "var(--gray)" }}>
                Location helps in heatmap analysis and tracking violation hotspots
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? "Recording..." : "Record Violation"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/officer/dashboard")}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Fine Information */}
        <div className="card" style={{ marginTop: "24px", background: "#f0f9ff", border: "2px solid #bae6fd" }}>
          <h3 style={{ marginBottom: "16px", fontSize: "18px" }}>Fine Amounts</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", fontSize: "14px" }}>
            <div><strong>Helmet:</strong> ₹500</div>
            <div><strong>Speeding:</strong> ₹1000</div>
            <div><strong>Red Light:</strong> ₹800</div>
            <div><strong>Wrong Parking:</strong> ₹300</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadViolation;
