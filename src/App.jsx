import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Home from './components/Home';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import Orders from './components/admin/Orders';
import Products from './components/admin/Products';
import Customers from './components/admin/Customers';
import Analytics from './components/admin/Analytics';
import Reports from './components/admin/Reports';
import Settings from './components/admin/Settings';
import NotFound from './components/NotFound';

function App() {

  return (
     <Router>
      <div className="App">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Admin routes with shared layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="products" element={<Products />} />
              <Route path="customers" element={<Customers />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App