import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import ProductCard from "@/components/product-card";
import Footer from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Products() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const categoryFilter = urlParams.get('category') || '';
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [sortBy, setSortBy] = useState("name");

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
            <div className="text-night-vision font-mono text-sm mb-4">// TACTICAL EQUIPMENT CATALOG</div>
            <h1 className="text-4xl font-bold mb-6">MISSION EQUIPMENT</h1>
            <p className="text-steel-gray max-w-2xl mx-auto">
              Browse our complete inventory of tactical gear. Every item is tested and verified for operational readiness.
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
              {[...Array(8)].map((_, i) => (
                <div key={i} className="hud-border bg-steel-gray bg-opacity-20 p-6 animate-pulse">
                  <div className="w-full h-48 bg-steel-gray bg-opacity-40 mb-4"></div>
                  <div className="h-4 bg-steel-gray bg-opacity-40 mb-2"></div>
                  <div className="h-6 bg-steel-gray bg-opacity-40 mb-2"></div>
                  <div className="h-16 bg-steel-gray bg-opacity-40 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-20 bg-steel-gray bg-opacity-40"></div>
                    <div className="h-10 w-32 bg-steel-gray bg-opacity-40"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="hud-border p-12 bg-steel-gray bg-opacity-20 max-w-md mx-auto">
                <div className="text-night-vision font-mono text-2xl mb-4">NO EQUIPMENT FOUND</div>
                <p className="text-steel-gray">
                  Adjust your search parameters or browse all categories.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
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
