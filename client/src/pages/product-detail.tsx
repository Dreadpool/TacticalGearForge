import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/hooks/use-cart";
import { ArrowLeft, Plus, Minus, Shield, Truck, RotateCcw } from "lucide-react";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id!);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['/api/products', productId.toString()],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ops-black text-white">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="h-96 bg-steel-gray bg-opacity-20 hud-border"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-steel-gray bg-opacity-20"></div>
                  <div className="h-12 bg-steel-gray bg-opacity-20"></div>
                  <div className="h-24 bg-steel-gray bg-opacity-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ops-black text-white">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-6 text-center">
            <div className="hud-border p-12 bg-steel-gray bg-opacity-20 max-w-md mx-auto">
              <div className="text-danger-red font-mono text-2xl mb-4">EQUIPMENT NOT FOUND</div>
              <p className="text-steel-gray mb-6">
                The requested tactical equipment could not be located in our database.
              </p>
              <Link href="/products">
                <Button className="bg-night-vision text-ops-black font-mono hover:bg-white">
                  RETURN TO CATALOG
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const specifications = product.specifications ? JSON.parse(product.specifications) : {};

  const handleAddToCart = () => {
    addItem(product.id, quantity);
  };

  return (
    <div className="min-h-screen bg-ops-black text-white">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/products">
              <Button variant="ghost" className="mb-8 text-night-vision font-mono hover:bg-night-vision hover:text-ops-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK TO CATALOG
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="hud-border p-4 bg-steel-gray bg-opacity-20">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
                
                {/* 3D Viewer Controls */}
                <div className="flex justify-center space-x-4 mt-4">
                  <Button variant="outline" size="sm" className="font-mono border-night-vision text-night-vision">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    3D VIEW
                  </Button>
                  <Button variant="outline" size="sm" className="font-mono border-night-vision text-night-vision">
                    ZOOM
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <div>
                  <div className="text-night-vision font-mono text-sm mb-2">
                    MODEL: {product.model}
                  </div>
                  <Badge variant="outline" className="border-night-vision text-night-vision font-mono mb-4">
                    {product.category}
                  </Badge>
                  <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                  <p className="text-steel-gray text-lg leading-relaxed mb-6">
                    {product.description}
                  </p>
                </div>

                <div className="hud-border p-6 bg-steel-gray bg-opacity-20">
                  <div className="text-3xl font-bold text-night-vision mb-4">
                    ${product.price}
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="font-mono text-sm">QUANTITY:</span>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="border-night-vision text-night-vision"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-mono">{quantity}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="border-night-vision text-night-vision"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleAddToCart}
                    className="w-full bg-danger-red hover:bg-red-700 font-mono text-lg py-3"
                  >
                    ADD TO TACTICAL LOADOUT
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center hud-border p-4">
                    <Shield className="w-8 h-8 text-night-vision mx-auto mb-2" />
                    <div className="font-mono text-xs">FIELD TESTED</div>
                  </div>
                  <div className="text-center hud-border p-4">
                    <Truck className="w-8 h-8 text-night-vision mx-auto mb-2" />
                    <div className="font-mono text-xs">FREE SHIPPING</div>
                  </div>
                  <div className="text-center hud-border p-4">
                    <RotateCcw className="w-8 h-8 text-night-vision mx-auto mb-2" />
                    <div className="font-mono text-xs">30 DAY RETURN</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Details Tabs */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Tabs defaultValue="specifications" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-steel-gray bg-opacity-20 font-mono">
                <TabsTrigger value="specifications" className="data-[state=active]:bg-night-vision data-[state=active]:text-ops-black">
                  SPECIFICATIONS
                </TabsTrigger>
                <TabsTrigger value="features" className="data-[state=active]:bg-night-vision data-[state=active]:text-ops-black">
                  FEATURES
                </TabsTrigger>
                <TabsTrigger value="compatibility" className="data-[state=active]:bg-night-vision data-[state=active]:text-ops-black">
                  COMPATIBILITY
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="specifications" className="mt-6">
                <div className="hud-border p-6 bg-steel-gray bg-opacity-20">
                  <h3 className="font-mono font-bold text-night-vision mb-4">TECHNICAL SPECIFICATIONS</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-steel-gray pb-2">
                        <span className="font-mono text-sm uppercase">{key}:</span>
                        <span className="text-night-vision">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <div className="hud-border p-6 bg-steel-gray bg-opacity-20">
                  <h3 className="font-mono font-bold text-night-vision mb-4">KEY FEATURES</h3>
                  <ul className="space-y-2 text-steel-gray">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-night-vision"></div>
                      <span>Military-grade construction and materials</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-night-vision"></div>
                      <span>Field-tested and operationally proven</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-night-vision"></div>
                      <span>Modular design for mission flexibility</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-night-vision"></div>
                      <span>Quality assurance certified</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="compatibility" className="mt-6">
                <div className="hud-border p-6 bg-steel-gray bg-opacity-20">
                  <h3 className="font-mono font-bold text-night-vision mb-4">SYSTEM COMPATIBILITY</h3>
                  <p className="text-steel-gray mb-4">
                    This equipment is designed to integrate with standard tactical systems and MOLLE-compatible gear.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-mono text-night-vision mb-2">COMPATIBLE WITH:</h4>
                      <ul className="text-sm text-steel-gray space-y-1">
                        <li>• MOLLE/PALS Systems</li>
                        <li>• Standard Military Protocols</li>
                        <li>• NATO Specifications</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-mono text-night-vision mb-2">STANDARDS:</h4>
                      <ul className="text-sm text-steel-gray space-y-1">
                        <li>• ISO 9001 Certified</li>
                        <li>• Military Standards (MIL-STD)</li>
                        <li>• Field Performance Verified</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
