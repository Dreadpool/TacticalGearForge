import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import ProductCardModern from "@/components/product-card-modern";
import SkeletonLoader from "@/components/skeleton-loader";
import Footer from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

export default function Products() {
  const [location, navigate] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const categoryFilter = urlParams.get('category') || '';
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [sortBy, setSortBy] = useState("name");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', selectedCategory ? `?category=${selectedCategory}` : ''],
  });

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const categories = ["PROTECTION", "LOAD BEARING", "OPTICS", "TOOLS", "FOOTWEAR"];

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
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-ops-black text-white">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-night-vision font-mono-terminal text-sm mb-4 tracking-wider">// TACTICAL EQUIPMENT CATALOG</div>
            <h1 className="text-5xl md:text-6xl font-military-header mb-6 tracking-wider"
              style={{
                background: 'linear-gradient(45deg, #00FF41 0%, #C8A882 50%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(0, 255, 65, 0.3)'
              }}
            >
              MISSION EQUIPMENT
            </h1>
            <p className="text-tactical-tan max-w-2xl mx-auto font-hud text-lg leading-relaxed">
              Browse our complete inventory of tactical gear. Every item is tested and verified for operational readiness by elite operators worldwide.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div 
            className="mb-12 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-night-vision w-4 h-4" />
              <Input
                placeholder="SEARCH EQUIPMENT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-steel-gray bg-opacity-20 border-night-vision font-mono text-white placeholder:text-steel-gray"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px] bg-steel-gray bg-opacity-20 border-night-vision font-mono text-white">
                <Filter className="w-4 h-4 mr-2 text-night-vision" />
                <SelectValue placeholder="CATEGORY" />
              </SelectTrigger>
              <SelectContent className="bg-ops-black border-night-vision">
                <SelectItem value="">ALL CATEGORIES</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px] bg-steel-gray bg-opacity-20 border-night-vision font-mono text-white">
                <SelectValue placeholder="SORT BY" />
              </SelectTrigger>
              <SelectContent className="bg-ops-black border-night-vision">
                <SelectItem value="name">NAME A-Z</SelectItem>
                <SelectItem value="price-low">PRICE LOW-HIGH</SelectItem>
                <SelectItem value="price-high">PRICE HIGH-LOW</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <SkeletonLoader count={8} />
            </div>
          ) : sortedProducts.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-black/20 backdrop-blur-md border border-ranger-green/30 p-12 max-w-md mx-auto rounded-lg"
                style={{
                  background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.3), rgba(66, 84, 57, 0.1))',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div className="text-night-vision font-military-header text-2xl mb-4 tracking-wide">NO EQUIPMENT FOUND</div>
                <p className="text-tactical-tan font-hud">
                  Adjust your search parameters or browse all categories.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map((product, index) => (
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

          {/* Results Summary */}
          <motion.div 
            className="mt-12 text-center font-mono text-sm text-steel-gray"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            SHOWING {sortedProducts.length} OF {filteredProducts.length} EQUIPMENT ITEMS
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
