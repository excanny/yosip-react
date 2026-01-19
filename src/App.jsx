import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Home from './components/customer/Home';
import AdminDashboard from './components/admin/AdminDashboard';
import Dashboard from './components/customer/Dashboard';
import AdminOrders from './components/admin/AdminOrders';
import AdminProducts from './components/admin/AdminProducts';
import AdminCustomers from './components/admin/AdminCustomers';
import AdminSettings from './components/admin/AdminSettings';
import ProductDetailsPage from './components/customer/ProductDetailsPage';
import Checkout from './components/customer/Checkout';
// import NotFound from './components/NotFound';


function App() {

  return (
     <Router>
      <div className="App">
       
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Product Details Route */}
            <Route path="/products/:productId" element={<ProductDetailsPage />} />

            {/* Admin Layout */}
            <Route path="/admin" element={<AdminDashboard />}>
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>

        </main>
      </div>
    </Router>
  )
}

export default App
