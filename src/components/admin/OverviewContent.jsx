import { BarChart3, ShoppingCart, Users, DollarSign, Package, TrendingUp, TrendingDown, Bell, Search, Menu, X, LogOut, Home, ImagePlus, XCircle, Settings } from 'lucide-react'
import StatsCard from './StatsCard'
// import RecentOrdersTable from './RecentOrdersTable'
// import TopProducts from './TopProducts'
// import QuickActions from './QuickActions'


const stats = [
  { title: 'Total Revenue', value: '$48,574', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'bg-blue-600' },
  { title: 'Total Orders', value: '1,247', change: '+8.2%', trend: 'up', icon: ShoppingCart, color: 'bg-green-600' },
  { title: 'Total Customers', value: '8,549', change: '+15.3%', trend: 'up', icon: Users, color: 'bg-purple-600' },
  { title: 'Products', value: '342', change: '-2.4%', trend: 'down', icon: Package, color: 'bg-orange-600' }
]

// Quick Actions Component
const QuickActions = ({ onAddProduct, onViewOrders }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button 
        onClick={onAddProduct}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl hover:shadow-lg transition-shadow">
        <Package size={32} className="mb-2" />
        <h4 className="font-semibold text-lg">Add New Product</h4>
        <p className="text-sm text-blue-100 mt-1">Create a new product listing</p>
      </button>
      
      <button 
        onClick={onViewOrders}
        className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-xl hover:shadow-lg transition-shadow">
        <ShoppingCart size={32} className="mb-2" />
        <h4 className="font-semibold text-lg">View All Orders</h4>
        <p className="text-sm text-green-100 mt-1">Manage customer orders</p>
      </button>
      
      <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-xl hover:shadow-lg transition-shadow">
        <BarChart3 size={32} className="mb-2" />
        <h4 className="font-semibold text-lg">Analytics Report</h4>
        <p className="text-sm text-purple-100 mt-1">View detailed insights</p>
      </button>
    </div>
  )
}


// Overview Page Content
const OverviewContent = ({ onAddProduct, onViewOrders }) => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Welcome back, Admin! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} stat={stat} />
        ))}
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <TopProducts />
      </div> */}

      <QuickActions onAddProduct={onAddProduct} onViewOrders={onViewOrders} />
    </>
  )
}

export default OverviewContent;