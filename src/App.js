import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminDashboard from './components/AdminDashboard';
import Product from './components/Product/Product';
import AddProduct from './components/Product/AddProduct';
import EditProduct from "./components/Product/EditProduct";
import Order from './components/Orders/Order';
import OrderDetails from './components/Orders/OrderDetails';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route cho trang AdminDashboard */}
        <Route path="/" element={<AdminDashboard />} />
        
        {/* Route cho trang Product */}
        <Route path="/product" element={<Product />} />
        <Route path="/product/add" element={<AddProduct />} />
        <Route path="/product/edit/:id" element={<EditProduct />} />
        <Route path='/order' element={<Order/>}/>
        <Route path="/order/:orderid" element={<OrderDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
