function Header({ setPage }) {
  return (
    <header
      style={{
        background: "#007bff",
        color: "white",
        padding: "20px",
        textAlign: "center",
        borderRadius: "8px"
      }}
    >
      <h1>My Website</h1>

      <nav style={{ marginTop: "10px" }}>
        <button
          onClick={() => setPage("home")}
          style={{ color: "white", marginRight: "20px", background: "none", border: "none" }}
        >
          Home
        </button>

        <button
          onClick={() => setPage("about")}
          style={{ color: "white", marginRight: "20px", background: "none", border: "none" }}
        >
          About
        </button>

        <button
          onClick={() => setPage("contact")}
          style={{ color: "white", background: "none", border: "none" }}
        >
          Contact
        </button>
      </nav>
    </header>
  );
}

export default Header;
