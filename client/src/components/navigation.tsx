import { Link, useLocation } from "wouter";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export default function Navigation() {
  const [location] = useLocation();
  const { items } = useCart();
  
  const cartItemCount = items.reduce((total: number, item) => total + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ops-black bg-opacity-90 backdrop-blur-sm border-b border-night-vision">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="text-night-vision font-mono font-bold text-xl glitch-text cursor-pointer" data-text="TACOPS">
                TACOPS
              </div>
            </Link>
            <div className="hidden md:flex space-x-6 font-mono text-sm">
              <Link href="/products" className="text-steel-gray hover:text-night-vision transition-colors">
                GEAR
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/products" className="hud-border px-4 py-2 text-night-vision font-mono text-sm hover:bg-night-vision hover:text-ops-black transition-all">
              <Search className="w-4 h-4 mr-2 inline" />
              SEARCH
            </Link>
            <Link href="/cart" className="hud-border px-4 py-2 text-night-vision font-mono text-sm hover:bg-night-vision hover:text-ops-black transition-all">
              <ShoppingCart className="w-4 h-4 mr-2 inline" />
              CART ({cartItemCount})
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
