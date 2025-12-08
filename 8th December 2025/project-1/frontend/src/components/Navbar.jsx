import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: 20, background: "#333", color: "white" }}>
      <Link to="/" style={{ marginRight: 20, color: "white" }}>Home</Link>
      <Link to="/login" style={{ marginRight: 20, color: "white" }}>Login</Link>
      <Link to="/register" style={{ color: "white" }}>Register</Link>
    </nav>
  );
}
