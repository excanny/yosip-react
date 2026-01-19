import React, { useState } from 'react'
import { BarChart3, ShoppingCart, Users, DollarSign, Package, TrendingUp, TrendingDown, Bell, Search, Menu, X, LogOut, Home, ImagePlus, XCircle, Settings } from 'lucide-react'
import AdminSidebar from './AdminSidebar';
import Header from '../customer/Header';
import OverviewContent from './OverviewContent';
import ProductsContent from './ProductsContent';

// Mock data
const recentOrders = [
  { id: '#ORD-001', customer: 'John Doe', amount: '$234.00', status: 'Completed', date: '2024-03-15' },
  { id: '#ORD-002', customer: 'Jane Smith', amount: '$156.00', status: 'Processing', date: '2024-03-15' },
  { id: '#ORD-003', customer: 'Bob Johnson', amount: '$89.50', status: 'Shipped', date: '2024-03-14' },
  { id: '#ORD-004', customer: 'Alice Brown', amount: '$445.00', status: 'Pending', date: '2024-03-14' },
  { id: '#ORD-005', customer: 'Charlie Wilson', amount: '$178.00', status: 'Completed', date: '2024-03-13' }
]

const topProducts = [
  { name: 'Wireless Headphones', sales: 145, revenue: '$4,350', stock: 23 },
  { name: 'Smart Watch Pro', sales: 128, revenue: '$3,840', stock: 45 },
  { name: 'USB-C Cable', sales: 98, revenue: '$980', stock: 12 },
  { name: 'Phone Case', sales: 87, revenue: '$1,305', stock: 67 }
]

// Recent Orders Table Component
const RecentOrdersTable = () => {
  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Order ID</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Customer</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Amount</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-2 text-sm font-medium text-gray-900">{order.id}</td>
                <td className="py-4 px-2 text-sm text-gray-600">{order.customer}</td>
                <td className="py-4 px-2 text-sm font-semibold text-gray-900">{order.amount}</td>
                <td className="py-4 px-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-2 text-sm text-gray-600">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Top Products Component
const TopProducts = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Top Products</h3>
        <BarChart3 className="text-gray-400" size={20} />
      </div>
      
      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
              <span className="text-sm font-bold text-green-600">{product.revenue}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{product.sales} sales</span>
              <span className={product.stock < 30 ? 'text-red-600' : 'text-gray-600'}>
                Stock: {product.stock}
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((product.sales / 150) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}




// Orders Page Content
const OrdersContent = () => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Orders Management</h2>
        <p className="text-gray-600 mt-1">View and manage all customer orders</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">Full orders management interface would go here...</p>
      </div>
    </>
  )
}



// Customers Page Content
const CustomersContent = () => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Customers</h2>
        <p className="text-gray-600 mt-1">View and manage customer information</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">Customer management interface would go here...</p>
      </div>
    </>
  )
}

// Analytics Page Content
const AnalyticsContent = () => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Analytics</h2>
        <p className="text-gray-600 mt-1">Detailed insights and reports</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">Analytics dashboard would go here...</p>
      </div>
    </>
  )
}

// Settings Page Content
const SettingsContent = () => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">Settings interface would go here...</p>
      </div>
    </>
  )
}

// Main Dashboard Component
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  //const [showAddProduct, setShowAddProduct] = useState(false)

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logged out successfully!')
      // In real app: navigate('/')
    }
  }

  const handleGoHome = () => {
    alert('Going to home page...')
    // In real app: navigate('/')
  }

  // const renderContent = () => {
  //   switch (activeTab) {
  //     case 'overview':
  //       return <OverviewContent 
  //         onAddProduct={() => setShowAddProduct(true)}
  //         onViewOrders={() => setActiveTab('orders')}
  //       />
  //     case 'orders':
  //       return <OrdersContent />
  //     case 'products':
  //       return <ProductsContent />
  //     case 'customers':
  //       return <CustomersContent />
  //     case 'analytics':
  //       return <AnalyticsContent />
  //     case 'settings':
  //       return <SettingsContent />
  //     default:
  //       return <OverviewContent 
  //         onAddProduct={() => setShowAddProduct(true)}
  //         onViewOrders={() => setActiveTab('orders')}
  //       />
  //   }
  // }

  // In the renderContent function of AdminDashboard
const renderContent = () => {
  switch (activeTab) {
    case 'overview':
      return <OverviewContent 
        onAddProduct={() => setShowAddProduct(true)}
        onViewOrders={() => setActiveTab('orders')}
      />
    case 'orders':
      return <OrdersContent />
    case 'products':
      return <ProductsContent 
        onAddProduct={() => setShowAddProduct(true)}  
      />
    case 'customers':
      return <CustomersContent />
    case 'analytics':
      return <AnalyticsContent />
    case 'settings':
      return <SettingsContent />
    default:
      return <OverviewContent 
        onAddProduct={() => setShowAddProduct(true)}
        onViewOrders={() => setActiveTab('orders')}
      />
  }
}

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        onGoHome={handleGoHome}
      />

      <div className="flex-1 overflow-auto">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard