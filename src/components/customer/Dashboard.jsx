import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Heart, User, CreditCard, MapPin, Bell, Settings, LogOut, TrendingUp, Clock, CheckCircle, Truck } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Mock orders data
    setOrders([
      {
        id: 'ORD-2024-001',
        date: '2024-12-05',
        status: 'delivered',
        total: 1250.00,
        items: 5,
        products: [
          { name: 'Greek Yogurt 12-Pack', image: 'assets/yosip.png', price: 250 }
        ]
      },
      {
        id: 'ORD-2024-002',
        date: '2024-12-08',
        status: 'processing',
        total: 890.50,
        items: 3,
        products: [
          { name: 'Strawberry Yogurt Mix', image: 'assets/yosip.png', price: 890.50 }
        ]
      },
      {
        id: 'ORD-2024-003',
        date: '2024-12-09',
        status: 'shipped',
        total: 1450.00,
        items: 8,
        products: [
          { name: 'Vanilla Yogurt Bundle', image: 'assets/yosip.png', price: 1450 }
        ]
      }
    ]);

    setLoading(false);
  }, []);

  const stats = [
    { label: 'Total Orders', value: '24', icon: ShoppingBag, color: 'bg-blue-500', change: '+12%' },
    { label: 'Total Spent', value: '₦45,230', icon: TrendingUp, color: 'bg-emerald-500', change: '+8%' },
    { label: 'Wishlist Items', value: '12', icon: Heart, color: 'bg-pink-500', change: '+3' },
    { label: 'Reward Points', value: '2,450', icon: Package, color: 'bg-purple-500', change: '+150' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Package },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const recentActivity = [
    { action: 'Order Delivered', detail: 'ORD-2024-001 has been delivered', time: '2 hours ago', icon: CheckCircle, color: 'text-green-500' },
    { action: 'Payment Successful', detail: 'Payment of ₦890.50 processed', time: '1 day ago', icon: CreditCard, color: 'text-blue-500' },
    { action: 'Order Shipped', detail: 'ORD-2024-003 is on the way', time: '2 days ago', icon: Truck, color: 'text-purple-500' }
  ];

  const OverviewContent = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Customer'}! 👋</h1>
        <p className="text-emerald-50">Here's what's happening with your orders today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img src={order.products[0].image} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <p className="font-semibold text-gray-800">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.items} items • ₦{order.total.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 text-emerald-600 font-semibold hover:bg-emerald-50 rounded-lg transition-colors">
              View All Orders →
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex space-x-3">
                  <div className={`${activity.color} mt-1`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.detail}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl p-6 hover:bg-emerald-50 transition-colors">
          <ShoppingBag className="w-8 h-8 mx-auto mb-3" />
          <p className="font-semibold">Continue Shopping</p>
        </button>
        <button className="bg-white border-2 border-blue-600 text-blue-600 rounded-xl p-6 hover:bg-blue-50 transition-colors">
          <Package className="w-8 h-8 mx-auto mb-3" />
          <p className="font-semibold">Track Order</p>
        </button>
        <button className="bg-white border-2 border-purple-600 text-purple-600 rounded-xl p-6 hover:bg-purple-50 transition-colors">
          <Heart className="w-8 h-8 mx-auto mb-3" />
          <p className="font-semibold">View Wishlist</p>
        </button>
      </div>
    </div>
  );

  const OrdersContent = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
        <p className="text-gray-600 mt-1">View and manage all your orders</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{order.id}</h3>
                  <p className="text-sm text-gray-600">Placed on {order.date}</p>
                </div>
                <span className={`inline-flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <img src={order.products[0].image} alt="" className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{order.products[0].name}</p>
                  <p className="text-sm text-gray-600">{order.items} items</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold text-gray-800">₦{order.total.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                  View Details
                </button>
                {order.status === 'delivered' && (
                  <button className="flex-1 border-2 border-emerald-600 text-emerald-600 py-2 rounded-lg hover:bg-emerald-50 transition-colors font-semibold">
                    Reorder
                  </button>
                )}
                {order.status === 'shipped' && (
                  <button className="flex-1 border-2 border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                    Track Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProfileContent = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        <p className="text-gray-600 mt-1">Manage your personal information</p>
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{user?.name || 'User'}</h3>
            <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
            <button className="mt-2 text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
              Change Profile Picture
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={user?.name || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              defaultValue={user?.email || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="+234 xxx xxx xxxx"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <button className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold mt-6">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <OverviewContent />;
      case 'orders': return <OrdersContent />;
      case 'profile': return <ProfileContent />;
      case 'wishlist': return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h3>
          <p className="text-gray-600 mb-6">Start adding items you love!</p>
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
            Browse Products
          </button>
        </div>
      );
      default: return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Coming Soon</h3>
          <p className="text-gray-600">This feature is under development</p>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="assets/yosip.png" alt="Yosip" className="w-12 h-12" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Customer Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your account and orders</p>
              </div>
            </div>
            <a href="/" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center space-x-2">
              <span>Back to Store</span>
              <ShoppingBag className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-emerald-50 text-emerald-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;