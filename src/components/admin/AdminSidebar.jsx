import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, LogOut, X } from 'lucide-react'

// Sidebar Component
const AdminSidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, onLogout, onGoHome }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const navItems = [
    { id: 'overview', label: 'Overview', path: '/admin' },
    { id: 'orders', label: 'Orders', path: '/admin/orders' },
    { id: 'products', label: 'Products', path: '/admin/products' },
    { id: 'customers', label: 'Customers', path: '/admin/customers' },
    { id: 'analytics', label: 'Analytics', path: '/admin/analytics' },
    { id: 'settings', label: 'Settings', path: '/admin/settings' }
  ]

  // Sync activeTab with current route on mount and route change
  useEffect(() => {
    const currentPath = location.pathname
    const currentItem = navItems.find(item => item.path === currentPath)
    if (currentItem) {
      setActiveTab(currentItem.id)
    }
  }, [location.pathname])

  const handleNavigation = (item) => {
    setActiveTab(item.id)
    navigate(item.path)
    setSidebarOpen(false)
  }

  return (
    <>
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-blue-600">YOSIP</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-600">
              <X size={24} />
            </button>
          </div>
          
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="space-y-2 mt-auto">
            <button
              onClick={onGoHome}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Home size={20} />
              <span>Home Page</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}

export default AdminSidebar;