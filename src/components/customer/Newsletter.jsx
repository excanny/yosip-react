import React from 'react'

const Newsletter = () => {
  return (
     <section className="py-10 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Stay Fresh with Us</h2>
          <p className="text-xl text-emerald-100 mb-8">Get exclusive offers, new flavor alerts, and healthy recipes delivered to your inbox</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-300"
            />
            <button className="bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
  )
}

export default Newsletter