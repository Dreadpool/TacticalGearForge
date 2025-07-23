import { motion } from "framer-motion";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { items, isLoading, updateItem, removeItem, clearCart, getTotalPrice, getTotalItems } = useCart();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ops-black text-white">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="hud-border p-6 bg-steel-gray bg-opacity-20">
                  <div className="flex space-x-4">
                    <div className="w-24 h-24 bg-steel-gray bg-opacity-40"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-steel-gray bg-opacity-40"></div>
                      <div className="h-4 bg-steel-gray bg-opacity-40"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                CONTINUE SHOPPING
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-night-vision font-mono text-sm mb-4">// TACTICAL LOADOUT</div>
            <h1 className="text-4xl font-bold mb-6">EQUIPMENT CART</h1>
            <p className="text-steel-gray">
              Review your selected tactical equipment before deployment.
            </p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="hud-border p-12 bg-steel-gray bg-opacity-20 max-w-md mx-auto">
                <ShoppingBag className="w-16 h-16 text-night-vision mx-auto mb-4" />
                <div className="text-night-vision font-mono text-2xl mb-4">CART EMPTY</div>
                <p className="text-steel-gray mb-6">
                  Your tactical loadout is currently empty. Browse our equipment catalog to begin.
                </p>
                <Link href="/products">
                  <Button className="bg-night-vision text-ops-black font-mono hover:bg-white">
                    BROWSE EQUIPMENT
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item: any, index: number) => (
                  <motion.div
                    key={item.id}
                    className="hud-border p-6 bg-steel-gray bg-opacity-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-full md:w-24 h-24 object-cover"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-mono text-xs text-night-vision mb-1">
                              MODEL: {item.product.model}
                            </div>
                            <h3 className="text-lg font-bold">{item.product.name}</h3>
                            <p className="text-steel-gray text-sm">{item.product.category}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-danger-red hover:bg-danger-red hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                              className="border-night-vision text-night-vision"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center font-mono">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateItem(item.id, item.quantity + 1)}
                              className="border-night-vision text-night-vision"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-night-vision">
                              ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-steel-gray">
                              ${item.product.price} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  className="flex justify-between items-center pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="border-danger-red text-danger-red hover:bg-danger-red hover:text-white font-mono"
                  >
                    CLEAR ALL EQUIPMENT
                  </Button>
                  
                  <div className="font-mono text-sm text-steel-gray">
                    {totalItems} ITEMS IN LOADOUT
                  </div>
                </motion.div>
              </div>

              {/* Order Summary */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="hud-border p-6 bg-steel-gray bg-opacity-20 sticky top-24">
                  <h2 className="font-mono font-bold text-night-vision text-xl mb-6">
                    MISSION SUMMARY
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="font-mono text-sm">SUBTOTAL:</span>
                      <span className="font-bold">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-sm">SHIPPING:</span>
                      <span className="text-night-vision">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-sm">TAX:</span>
                      <span className="font-bold">${(totalPrice * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-steel-gray pt-4">
                      <div className="flex justify-between text-lg">
                        <span className="font-mono font-bold">TOTAL:</span>
                        <span className="font-bold text-night-vision">
                          ${(totalPrice * 1.08).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input
                      placeholder="PROMO CODE"
                      className="bg-transparent border-night-vision font-mono text-white placeholder:text-steel-gray"
                    />
                    
                    <Button className="w-full bg-night-vision text-ops-black font-mono font-bold hover:bg-white py-3">
                      DEPLOY EQUIPMENT
                    </Button>
                    
                    <div className="text-center">
                      <Link href="/products">
                        <Button variant="ghost" className="text-steel-gray font-mono hover:text-night-vision">
                          CONTINUE SHOPPING
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="mt-8 pt-6 border-t border-steel-gray">
                    <div className="font-mono text-xs text-night-vision mb-2">
                      SECURE TRANSACTION
                    </div>
                    <p className="text-xs text-steel-gray">
                      Your order is protected by military-grade encryption and secure processing protocols.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
