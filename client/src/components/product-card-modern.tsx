import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ShoppingCart, Plus, Eye, Star } from 'lucide-react';
import { Product } from '@shared/schema';

interface ProductCardModernProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductCardModern({ 
  product, 
  index, 
  onAddToCart, 
  onViewDetails 
}: ProductCardModernProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });
  
  // Magnetic cursor effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.1;
    const deltaY = (e.clientY - centerY) * 0.1;
    
    setMousePosition({ x: deltaX, y: deltaY });
  };

  // Stagger animation on viewport entry
  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          delay: index * 0.1,
          ease: "easeOut"
        }
      });
    }
  }, [isInView, controls, index]);

  // 3D tilt calculation
  const calculateTilt = () => {
    if (!isHovered) return { rotateX: 0, rotateY: 0 };
    
    return {
      rotateX: mousePosition.y * -0.3,
      rotateY: mousePosition.x * 0.3
    };
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={controls}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="relative bg-black/20 backdrop-blur-md border border-ranger-green/30 rounded-lg overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.3), rgba(66, 84, 57, 0.1))',
          backdropFilter: 'blur(20px)',
          boxShadow: isHovered 
            ? '0 25px 50px rgba(0, 255, 65, 0.2), 0 0 30px rgba(0, 255, 65, 0.1)' 
            : '0 10px 30px rgba(0, 0, 0, 0.3)'
        }}
        animate={{
          scale: isHovered ? 1.05 : 1,
          x: mousePosition.x,
          y: mousePosition.y,
          ...calculateTilt()
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          scale: { duration: 0.3 }
        }}
      >
        {/* WHO USES IT Badge */}
        <motion.div
          className="absolute top-3 left-3 z-20 bg-night-vision/90 text-ops-black px-3 py-1 rounded-full text-xs font-military-header font-bold tracking-wide"
          style={{
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.6)',
            textShadow: '0 0 10px rgba(0, 0, 0, 0.8)'
          }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 255, 65, 0.6)',
              '0 0 30px rgba(0, 255, 65, 0.8)',
              '0 0 20px rgba(0, 255, 65, 0.6)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          WHO USES IT
        </motion.div>

        {/* Product Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <motion.img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{
              filter: 'brightness(0.9) contrast(1.1)'
            }}
            animate={{
              scale: isHovered ? 1.15 : 1.05,
              rotate: isHovered ? 1 : 0
            }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut"
            }}
          />
          
          {/* Ken Burns overlay effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-night-vision/20"
            animate={{
              opacity: isHovered ? 0.3 : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Quick actions overlay */}
          <motion.div
            className="absolute inset-0 bg-ops-black/60 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="bg-night-vision/20 backdrop-blur-sm border border-night-vision text-night-vision p-3 rounded-full hover:bg-night-vision hover:text-ops-black transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye size={20} />
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-military-header text-white text-lg tracking-wide mb-1">
              {product.name}
            </h3>
            <p className="text-tactical-tan text-sm font-mono-terminal">
              Model: {product.model}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  className="text-night-vision fill-current" 
                />
              ))}
            </div>
            <span className="text-white text-sm">5.0</span>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
            {product.description}
          </p>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-2xl font-military-header text-night-vision">
              ${product.price}
            </div>
            
            <motion.button
              className="group/btn bg-night-vision/20 backdrop-blur-sm border border-night-vision text-night-vision px-4 py-2 rounded-lg font-hud font-semibold text-sm tracking-wide overflow-hidden relative"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(0, 255, 65, 0.9)',
                color: '#0A0A0A'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="flex items-center gap-2"
                initial={{ width: 'auto' }}
                whileHover={{ width: 'auto' }}
              >
                <Plus size={16} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  whileHover={{ opacity: 1, width: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  ADD TO CART
                </motion.span>
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Glassmorphism border glow */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: 'linear-gradient(145deg, rgba(0, 255, 65, 0.1), rgba(200, 168, 130, 0.05))',
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}