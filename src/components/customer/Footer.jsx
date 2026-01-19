import React from 'react'

const Footer = () => {
  return (
     <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="assets/yosip.png"
                  alt="Yosip Logo"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <p className="text-gray-400">
                Premium natural yogurt crafted with love and the finest ingredients.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors text-left">Greek Yogurt</button></li>
                <li><button className="hover:text-white transition-colors text-left">Fruit Yogurt</button></li>
                <li><button className="hover:text-white transition-colors text-left">Organic Line</button></li>
                <li><button className="hover:text-white transition-colors text-left">Protein Yogurt</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors text-left">About Us</button></li>
                <li><button className="hover:text-white transition-colors text-left">Our Story</button></li>
                <li><button className="hover:text-white transition-colors text-left">Careers</button></li>
                <li><button className="hover:text-white transition-colors text-left">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <span className="text-sm">f</span>
                </button>
                <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <span className="text-sm">t</span>
                </button>
                <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <span className="text-sm">i</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 Yosip. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer