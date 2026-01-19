import React from 'react';
import { CheckCircle, Truck, Package } from 'lucide-react';

const OrderSuccess = ({ orderId, total, formData }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">Thank you for your purchase</p>
            
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Order Number</p>
              <p className="text-2xl font-bold text-emerald-600">{orderId}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <Truck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">Estimated Delivery</p>
                <p className="text-xs text-gray-600 mt-1">3-5 Business Days</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <Package className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">Order Total</p>
                <p className="text-xs text-gray-600 mt-1">${total.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-gray-800 mb-3">Shipping Address</p>
              <p className="text-sm text-gray-600">{formData.fullName}</p>
              <p className="text-sm text-gray-600">{formData.address}</p>
              <p className="text-sm text-gray-600">{formData.city}, {formData.state} {formData.zipCode}</p>
              <p className="text-sm text-gray-600">{formData.country}</p>
            </div>
            
            <div className="text-sm text-gray-600 mb-6">
              <p>A confirmation email has been sent to</p>
              <p className="font-semibold text-emerald-600">{formData.email}</p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/orders'}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Track Your Order
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default OrderSuccess