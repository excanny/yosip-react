import { useState, useEffect } from 'react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cart, setCart] = useState([]);
  const [addedProducts, setAddedProducts] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const slides = [
    {
      title: "Healthy Indulgence.",
      subtitle: "Nutritious, creamy, and simply irresistible.",
      description: "Experience the perfect blend of health and taste with our premium yogurt collection.",
      buttonText: "Best Sellers",
      buttonSecondary: "Next",
      buttonColor: "bg-slate-900 hover:bg-slate-800",
      buttonSecondaryColor: "bg-white text-slate-900 hover:bg-gray-100",
      bgColor: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600",
      image: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eW9ndXJ0fGVufDB8fDB8fHww",
      splashElements: true
    },
    {
      title: "Fresh Fruit Paradise",
      subtitle: "Real fruit pieces in every spoonful",
      description: "Taste the difference that fresh, premium ingredients make in our artisanal yogurt.",
      buttonText: "Explore Flavors",
      buttonSecondary: "Learn More",
      buttonColor: "bg-pink-600 hover:bg-pink-700",
      buttonSecondaryColor: "bg-white text-pink-900 hover:bg-pink-50",
      bgColor: "bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=500&fit=crop&crop=center",
      splashElements: false
    },
    {
      title: "100% Pure Organic",
      subtitle: "From farm to your table with love",
      description: "Certified organic ingredients sourced from trusted local farms for the purest taste.",
      buttonText: "Go Organic",
      buttonSecondary: "Our Story",
      buttonColor: "bg-green-600 hover:bg-green-700",
      buttonSecondaryColor: "bg-white text-green-900 hover:bg-green-50",
      bgColor: "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500",
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&h=500&fit=crop&crop=center",
      splashElements: false
    }
  ];

  const products = [
    {
      id: 1,
      name: "Blueberry Bliss",
      description: "Creamy Greek yogurt with fresh blueberries and a hint of honey",
      price: "$4.99",
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: 2,
      name: "Strawberry Dream",
      description: "Fresh strawberry chunks in our signature creamy yogurt",
      price: "$4.79",
      image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: 3,
      name: "Classic Greek",
      description: "Traditional Greek yogurt, thick and creamy with authentic taste",
      price: "$5.49",
      image: "https://plus.unsplash.com/premium_photo-1683141128118-fe2d959dbd09?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8eW9ndXJ0fGVufDB8fDB8fHww"
    },
    {
      id: 4,
      name: "Vanilla Bean",
      description: "Rich vanilla bean flavor with smooth, creamy texture",
      price: "$4.59",
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: 5,
      name: "Mixed Berry",
      description: "A delightful blend of strawberries, blueberries, and raspberries",
      price: "$5.29",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: 6,
      name: "Honey Vanilla",
      description: "Classic vanilla with pure wildflower honey",
      price: "$4.89",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop&crop=center"
    }
  ];

  const highlights = [
    {
      icon: (
        <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      ),
      title: "Farm-fresh milk",
      description: "Made with the best locally sourced milk."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      title: "No added nonsense",
      description: "Pure goodness. No artificial additives."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      ),
      title: "Quality assured",
      description: "Trusted quality you can rely on."
    }
  ];

  // Auto-advance slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    setAddedProducts(new Set([...addedProducts, product.id]));
    
    // Remove "Added!" state after 2 seconds
    setTimeout(() => {
      setAddedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-gray-50">
       
      {/* Navigation */}
    <nav className="bg-white shadow-lg fixed w-full z-50">
      {/* Top Promo Banner */}
      <div className="bg-pink-50 text-sm text-gray-700 flex items-center justify-center gap-3 p-3 border-b">
        <span className="bg-black text-white text-xs font-semibold px-2 py-1 rounded-full">
          New
        </span>
        <span>Free delivery over $1000</span>
        <span className="ml-auto flex items-center gap-6 pr-6">
          <span className="flex items-center gap-1">🚚 Same-day delivery</span>
          <span className="flex items-center gap-1">🔒 Secure checkout</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="assets/yosip.png"
              alt="Yosip Logo"
              className="w-14 h-14 object-contain"
            />
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search yogurt, flavors, packs..."
                className="w-full pl-4 pr-12 py-3 rounded-full border text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Cart Button */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="relative bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4L7 13l-1.5 6h9" />
              </svg>
              <span className="font-medium">Cart</span>
              <span className="bg-white text-slate-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {cart.length}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>

      {/* Hero Slider Section - Made Shorter with Better Padding */}
      <section id="home" className="pt-32 px-4">
        <div className="relative overflow-hidden rounded-2xl mx-auto max-w-7xl">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className={`min-w-full h-[350px] ${slide.bgColor} flex items-center relative overflow-hidden`}>
                {/* Animated Splash Elements for first slide */}
                {slide.splashElements && (
                  <>
                    <div className="absolute top-16 left-1/4 w-6 h-6 bg-white bg-opacity-40 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute top-24 right-1/3 w-4 h-4 bg-white bg-opacity-30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-20 left-1/3 w-8 h-8 bg-white bg-opacity-35 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute top-28 right-1/4 w-3 h-3 bg-white bg-opacity-25 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
                    <div className="absolute bottom-24 right-1/2 w-10 h-10 bg-white bg-opacity-20 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
                    
                    {/* Large splash elements */}
                    <div className="absolute top-1/4 right-16 w-24 h-16 bg-white bg-opacity-20 rounded-full transform rotate-45"></div>
                    <div className="absolute bottom-16 left-8 w-32 h-20 bg-white bg-opacity-15 rounded-full transform -rotate-12"></div>
                    <div className="absolute top-8 left-1/2 w-20 h-12 bg-white bg-opacity-25 rounded-full transform rotate-12"></div>
                    
                    {/* Cherry element */}
                    <div className="absolute top-12 right-24 w-12 h-12 bg-red-500 rounded-full opacity-80"></div>
                    <div className="absolute top-8 right-20 w-3 h-6 bg-green-600 rounded-full transform rotate-45"></div>
                  </>
                )}

                <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
                  <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="space-y-4">
                      <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-base lg:text-lg text-white opacity-90 max-w-lg">
                        {slide.subtitle}
                      </p>
                      <p className="text-sm lg:text-base text-white opacity-80 max-w-lg">
                        {slide.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button className={`${slide.buttonColor} text-white px-6 py-3 rounded-full font-semibold text-base transition-colors`}>
                          {slide.buttonText}
                        </button>
                        <button className={`${slide.buttonSecondaryColor} border-2 border-white px-6 py-3 rounded-full font-semibold text-base transition-colors`}>
                          {slide.buttonSecondary}
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-full h-48 lg:h-60 object-cover rounded-2xl shadow-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-white w-7' 
                    : 'bg-white bg-opacity-50 w-2.5 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Highlights Section */}
        <div className="bg-white py-3 px-4 rounded-2xl max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl border border-gray-300">
                <div className="flex-shrink-0">
                  {highlight.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{highlight.title}</h3>
                  <p className="text-gray-600 text-sm">{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Our Premium Collection</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">From classic Greek to exotic flavors, discover yogurt perfection in every spoonful</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        addedProducts.has(product.id)
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {addedProducts.has(product.id) ? 'Added!' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-10 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Why Choose Yosip?</h2>
            <p className="text-xl text-gray-600">We're committed to delivering the highest quality yogurt experience</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">100% Natural</h3>
              <p className="text-gray-600">No artificial preservatives, colors, or flavors. Just pure, natural goodness in every cup.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Made with Love</h3>
              <p className="text-gray-600">Each batch is carefully crafted by our artisans who are passionate about yogurt perfection.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Fresh Daily</h3>
              <p className="text-gray-600">Delivered fresh to your door every day. Experience the difference freshness makes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
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

      {/* Footer */}
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
    </div>
  );
};

export default Home;