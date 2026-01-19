import { useState, useEffect, useRef } from 'react';
import Navigation from './Navigation.jsx';
import HeroSlider from './HeroSlider.jsx';
import Products from './Products.jsx';
import Features from './Features.jsx';
import Newsletter from './Newsletter.jsx';
import Footer from './Footer.jsx';

const Home = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const fetchTimeoutRef = useRef(null);

  const optimisticCartUpdate = (productId, newQuantity) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => {
        const itemProductId = item.productId?._id || item.productId || item.product;
        return itemProductId === productId;
      });

      if (existingItemIndex >= 0) {
        const newCart = [...prevCart];
        if (newQuantity === 0) {
          newCart.splice(existingItemIndex, 1);
        } else {
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newQuantity
          };
        }
        return newCart;
      } else if (newQuantity > 0) {
        return [
          ...prevCart,
          {
            productId: { _id: productId },
            quantity: newQuantity
          }
        ];
      }

      return prevCart;
    });
  };

  // Fetch cart from server (debounced)
  const fetchCart = () => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    fetchTimeoutRef.current = setTimeout(async () => {
      try {
        let url = 'http://localhost:4000/cart';
        
        if (user && user._id) {
          url += `?userId=${user._id}`;
        }

        const response = await fetch(url, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          setCart([]);
          return;
        }
        
        const data = await response.json();
        
        let cartItems = [];
        if (data.items && Array.isArray(data.items)) {
          cartItems = data.items;
        } else if (data.data && data.data.items) {
          cartItems = data.data.items;
        } else if (data.cart && data.cart.items) {
          cartItems = data.cart.items;
        }
        
        setCart(cartItems);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setCart([]);
      }
    }, 200);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  return (
    <div className="bg-gray-50">
      <Navigation cart={cart} onCartUpdate={fetchCart} />
      <HeroSlider />
      <Products 
        cart={cart}
        onOptimisticUpdate={optimisticCartUpdate}
        onCartUpdate={fetchCart}
      />
      <Features />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;