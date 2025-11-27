import { createRoot } from "react-dom/client";
import { Suspense, lazy, useState } from "react";

const Header = lazy(() => import("./Header.jsx"));
const Sidebar = lazy(() => import("./Sidebar.jsx"));

const Home = lazy(() =>
  new Promise(resolve =>
    setTimeout(() => resolve(import("./pages/Home.jsx")), 2000)
  )
);

const About = lazy(() =>
  new Promise(resolve =>
    setTimeout(() => resolve(import("./pages/About.jsx")), 3000)
  )
);

const Contact = lazy(() =>
  new Promise(resolve =>
    setTimeout(() => resolve(import("./pages/Contact.jsx")), 4000)
  )
);

function App() {
  const [page, setPage] = useState("home");

  let PageComponent;
  if (page === "home") PageComponent = <Home />;
  if (page === "about") PageComponent = <About />;
  if (page === "contact") PageComponent = <Contact />;

  return (
    <Suspense fallback={<div style={{ padding: "20px" }}>Loading page...</div>}>
      <Header setPage={setPage} />

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Sidebar setPage={setPage} />
        {PageComponent}
      </div>
    </Suspense>
  );
}

createRoot(document.getElementById("root")).render(<App />);
