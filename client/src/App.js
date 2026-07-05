import "./App.css";
import TopNav from "./Components/TopNav";
import CatNav from "./Components/CatNav/index";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./Components";
import ProductDetails from "./Components/ProductDetails";
import Cart from "./Components/Cart";
import Login from "./Components/Login/Login.js";
import Register from "./Components/Register/Register.js";
import Payment from "./Components/Payment/Payment.js"

function App() {
  return (
    <div>
      
        <TopNav />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
        
      
    </div>
  );
}

export default App;
