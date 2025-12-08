import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>Login</h2>

      <input
        style={{ padding: 8, width: 250 }}
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      /><br/><br/>

      <input
        style={{ padding: 8, width: 250 }}
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      /><br/><br/>

      <button
        style={{
          padding: "10px 20px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}
