import { useState, useEffect } from 'react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
    


     return (
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
     );
}

export default HeroSlider;