import { BarChart3, ShoppingCart, Users, DollarSign, Package, TrendingUp, TrendingDown, Bell, Search, Menu, X, LogOut, Home, ImagePlus, XCircle, Settings } from 'lucide-react';

// Stats Card Component
const StatsCard = ({ stat }) => {
  const Icon = stat.icon
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`${stat.color} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        {stat.trend === 'up' ? (
          <TrendingUp className="text-green-500" size={20} />
        ) : (
          <TrendingDown className="text-red-500" size={20} />
        )}
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
      <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {stat.change} from last month
      </p>
    </div>
  )
}

export default StatsCard;