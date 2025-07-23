import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";

import ProfessionalMilitaryHero from "@/components/three/professional-military-hero";
import VideoBackground from "@/components/video-background";
import LoadingScreen from "@/components/loading-screen";
import ProductShowcase3D from "@/components/product-showcase-3d";
import ProductCardModern from "@/components/product-card-modern";
import SkeletonLoader from "@/components/skeleton-loader";
import Footer from "@/components/footer";
import { Link } from "wouter";
import { Shield, Backpack, Eye, Gavel } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Home() {
  const [showLoading, setShowLoading] = useState(true);
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const featuredProducts = products || [];

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (product: Product) => {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId: product.id, 
          quantity: 1 
        })
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to Cart",
        description: "Item successfully added to your tactical loadout",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  });

  const handleAddToCart = (product: Product) => {
    addToCartMutation.mutate(product);
  };

  const handleViewDetails = (product: Product) => {
    window.location.href = `/products/${product.id}`;
  };

  const categories = [
    { name: "PROTECTION", icon: Shield, description: "Body armor, helmets, protective equipment" },
    { name: "LOAD BEARING", icon: Backpack, description: "Backpacks, vests, modular systems" },
    { name: "OPTICS", icon: Eye, description: "Scopes, night vision, surveillance" },
    { name: "TOOLS", icon: Gavel, description: "Multi-tools, knives, utility equipment" },
  ];

  const stats = [
    { value: "2,847", label: "MISSIONS SUPPORTED" },
    { value: "47", label: "COUNTRIES SERVED" },
    { value: "99.8%", label: "RELIABILITY RATING" },
    { value: "24/7", label: "SUPPORT RESPONSE" },
  ];

  return (
    <div className="min-h-screen bg-ops-black text-white">
      <AnimatePresence>
        {showLoading && (
          <LoadingScreen onEnterArmory={() => setShowLoading(false)} />
        )}
      </AnimatePresence>
      
      {!showLoading && (
        <>
          <Navigation />
          {/* Video Background */}
          <VideoBackground />
          
          {/* Three.js Hero Scene with integrated content */}
          <ProfessionalMilitaryHero />

      {/* Featured Products */}
      <section className="py-20 relative bg-ops-black" style={{ zIndex: 50 }}>
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-night-vision font-mono text-sm mb-4">// FEATURED EQUIPMENT</div>
            <h2 className="text-4xl font-bold mb-6">TACTICAL INVENTORY</h2>
            <p className="text-steel-gray max-w-2xl mx-auto">
              Military-grade equipment tested in the field. Every piece of gear meets the highest standards of durability and performance.
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SkeletonLoader count={3} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCardModern
                  key={product.id}
                  product={product}
                  index={index}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="absolute inset-0 tactical-grid opacity-10 pointer-events-none"></div>
      </section>

      <ProductShowcase3D />

      {/* Product Categories */}
      <section className="py-20 relative bg-ops-black" style={{ zIndex: 50 }}>
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-night-vision font-mono text-sm mb-4">// EQUIPMENT CATEGORIES</div>
            <h2 className="text-4xl font-bold mb-6">TACTICAL DIVISIONS</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
                    <div className="group hud-border p-6 hover:bg-night-vision hover:text-ops-black transition-all cursor-pointer">
                      <IconComponent className="w-10 h-10 mb-4 group-hover:text-ops-black text-night-vision" />
                      <h3 className="font-mono font-bold mb-2">{category.name}</h3>
                      <p className="text-sm text-steel-gray group-hover:text-ops-black">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-steel-gray bg-opacity-20 relative" style={{ zIndex: 50 }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="hud-border p-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-night-vision mb-2">{stat.value}</div>
                <div className="font-mono text-sm text-steel-gray">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="absolute inset-0 tactical-grid opacity-5 pointer-events-none"></div>
      </section>

          <Footer />
        </>
      )}
    </div>
  );
}
