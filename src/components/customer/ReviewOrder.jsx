import React from 'react';
import { CreditCard, ArrowLeft, Lock } from 'lucide-react';

const ReviewOrder = ({
    formData,
    cart,
    subtotal,
    shipping,
    tax,
    total,
    loading,
    error,
    onBack,
    onConfirm
}) => {
  return (
     <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Information
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Your Order</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={index} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                    <img
                      src={item.productId?.images?.[0] ? `http://localhost:4000${item.productId.images[0]}` : 'https://via.placeholder.com/80'}
                      alt={item.productId?.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.productId?.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-emerald-600 font-semibold">${item.itemTotal?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 font-medium">{formData.fullName}</p>
                <p className="text-gray-600">{formData.address}</p>
                <p className="text-gray-600">{formData.city}, {formData.state} {formData.zipCode}</p>
                <p className="text-gray-600">{formData.country}</p>
                <p className="text-gray-600 mt-2">📧 {formData.email}</p>
                <p className="text-gray-600">📱 {formData.phone}</p>
              </div>
            </div>
            
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="text-gray-800 font-medium">Credit Card</p>
                  <p className="text-sm text-gray-600">**** **** **** {formData.cardNumber.slice(-4)}</p>
                </div>
              </div>
            </div>
            
            {formData.orderNotes && (
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold text-gray-800 mb-3">Order Notes</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">{formData.orderNotes}</p>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7.5%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl text-emerald-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={onConfirm}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Confirm & Pay ${total.toFixed(2)}
                  </>
                )}
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
              >
                Edit Information
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ReviewOrder