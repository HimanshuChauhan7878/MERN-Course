import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1> Smart Traffic Violation Management</h1>
          <p>
            Digital enforcement platform for modern traffic management
          </p>
          {!isAuthenticated ? (
            <Link to="/login" className="btn btn-primary">
              Get Started
            </Link>
          ) : (
            <div className="d-flex justify-content-center gap-20">
              <Link
                to={
                  user?.role === "admin"
                    ? "/admin/dashboard"
                    : user?.role === "officer"
                    ? "/officer/dashboard"
                    : "/citizen/dashboard"
                }
                className="btn btn-primary"
              >
                Go to Dashboard
              </Link>
              <button onClick={logout} className="btn btn-outline">
                Logout
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="features-title">Key Features</h2>
          <div className="grid grid-3">
            <div className="card">
              <span className="icon">📸</span>
              <h3>Violation Recording</h3>
              <p>
                Traffic officers can record violations with images, location, and timestamps
              </p>
            </div>

            <div className="card">
              <span className="icon">💳</span>
              <h3>E-Challan System</h3>
              <p>
                Automated challan generation with QR codes and online payment options
              </p>
            </div>

            <div className="card">
              <span className="icon">📊</span>
              <h3>Analytics Dashboard</h3>
              <p>
                Real-time insights on violations, revenue, and traffic patterns
              </p>
            </div>

            <div className="card">
              <span className="icon">🔁</span>
              <h3>Repeat Offender Tracking</h3>
              <p>
                Automatic tracking and enhanced penalties for repeat violations
              </p>
            </div>

            <div className="card">
              <span className="icon">🗺️</span>
              <h3>Heatmap Analysis</h3>
              <p>
                Visualize violation hotspots on interactive maps for better planning
              </p>
            </div>

            <div className="card">
              <span className="icon">👤</span>
              <h3>Role-Based Access</h3>
              <p>
                Separate dashboards for Admin, Officers, and Citizens
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>
            Join thousands of traffic authorities using our platform
          </p>
          {!isAuthenticated && (
            <Link to="/login" className="btn">
              Sign In Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
