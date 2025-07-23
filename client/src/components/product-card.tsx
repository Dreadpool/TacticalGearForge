import { motion } from "framer-motion";
import type { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, 1);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        className="product-card hud-border bg-steel-gray bg-opacity-20 p-6 transition-all duration-300 cursor-pointer"
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover mb-4"
        />
        
        <div className="font-mono text-xs text-night-vision mb-2">
          MODEL: {product.model}
        </div>
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-steel-gray text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-night-vision">
            ${product.price}
          </span>
          <button 
            onClick={handleAddToCart}
            className="bg-danger-red px-4 py-2 font-mono text-sm hover:bg-red-700 transition-colors"
          >
            ADD TO CART
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
