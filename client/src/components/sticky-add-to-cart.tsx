import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '@shared/schema';

interface StickyAddToCartProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  className?: string;
}

export default function StickyAddToCart({ 
  product, 
  onAddToCart, 
  className = '' 
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when user scrolls past the main add-to-cart button
      const scrollThreshold = window.innerHeight * 0.8;
      setIsVisible(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${className}`}
          style={{
            background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.95), rgba(66, 84, 57, 0.2))',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(0, 255, 65, 0.3)'
          }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
        >
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between">
              {/* Product info */}
              <div className="flex items-center gap-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg border border-ranger-green/30"
                />
                <div>
                  <h3 className="font-military-header text-white text-sm tracking-wide">
                    {product.name}
                  </h3>
                  <p className="text-night-vision font-mono-terminal text-lg font-bold">
                    ${product.price}
                  </p>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4">
                {/* Quantity selector */}
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-lg p-2 border border-ranger-green/30">
                  <motion.button
                    className="w-8 h-8 flex items-center justify-center text-night-vision hover:bg-night-vision hover:text-ops-black rounded transition-colors"
                    onClick={() => handleQuantityChange(-1)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Minus size={16} />
                  </motion.button>
                  
                  <span className="w-8 text-center text-white font-military-header">
                    {quantity}
                  </span>
                  
                  <motion.button
                    className="w-8 h-8 flex items-center justify-center text-night-vision hover:bg-night-vision hover:text-ops-black rounded transition-colors"
                    onClick={() => handleQuantityChange(1)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={16} />
                  </motion.button>
                </div>

                {/* Add to Cart button */}
                <motion.button
                  className="flex items-center gap-3 bg-night-vision text-ops-black px-6 py-3 rounded-lg font-military-header text-sm tracking-wider hover:bg-tactical-tan transition-colors"
                  onClick={() => onAddToCart(product, quantity)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: '0 0 20px rgba(0, 255, 65, 0.4)'
                  }}
                >
                  <ShoppingCart size={18} />
                  ADD TO CART
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}