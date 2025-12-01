import React from "react";
import GlobalStyle from "./GlobalStyles";
import { Routes, Route } from "react-router-dom";
import Navbar from "./compoents/Navbar/Navbar";
import Home from "./Pages/HomePage/Home";
import Services from "./Pages/Services/Services";
import Products from "./Pages/Products/Products";
import Footer from "./compoents/Footer/Footer";
import ScrollToTop from "./compoents/ScrollToTop";

function App() {
  return (
    <>
      <GlobalStyle />
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/products" element={<Products />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
