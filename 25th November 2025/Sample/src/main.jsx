import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MyForm from "./MyForm.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MyForm />
  </StrictMode>
);
