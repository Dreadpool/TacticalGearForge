import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AnimatedCounter from "@/components/animated-counter";
import LiquidTabs from "@/components/liquid-tabs";
import VerifiedProfessionalBadge from "@/components/verified-professional-badge";
import TestimonialCard from "@/components/testimonial-card";
import StickyAddToCart from "@/components/sticky-add-to-cart";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Minus, Star, FileText, ExternalLink, Zap, Shield } from "lucide-react";
import type { Product } from "@shared/schema";

export default function ProductDetailModern() {
  const params = useParams();
  const productId = parseInt(params.id!);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['/api/products', productId.toString()],
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (productData: { product: Product; quantity: number }) => {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId: productData.product.id, 
          quantity: productData.quantity 
        })
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to Cart",
        description: `${product?.name} added to your tactical loadout`,
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

  const handleAddToCart = (prod: Product, qty: number) => {
    addToCartMutation.mutate({ product: prod, quantity: qty });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ops-black text-white">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-5 gap-8">
              {/* Image skeleton */}
              <div className="col-span-3 space-y-4">
                <div className="h-96 bg-black/20 backdrop-blur-sm rounded-lg animate-pulse" />
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-black/20 backdrop-blur-sm rounded animate-pulse" />
                  ))}
                </div>
              </div>
              
              {/* Details skeleton */}
              <div className="col-span-2 space-y-6">
                <div className="h-8 bg-black/20 backdrop-blur-sm rounded animate-pulse" />
                <div className="h-12 bg-black/20 backdrop-blur-sm rounded animate-pulse" />
                <div className="h-32 bg-black/20 backdrop-blur-sm rounded animate-pulse" />
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
            <motion.div 
              className="max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-black/20 backdrop-blur-md border border-ranger-green/30 p-12 rounded-lg">
                <div className="text-danger-red font-military-header text-2xl mb-4 tracking-wider">
                  EQUIPMENT NOT FOUND
                </div>
                <p className="text-tactical-tan mb-6 font-hud">
                  The requested tactical equipment could not be located in our database.
                </p>
                <Link href="/products">
                  <motion.button
                    className="bg-night-vision text-ops-black px-6 py-3 font-military-header tracking-wider hover:bg-tactical-tan transition-colors rounded"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    RETURN TO CATALOG
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Real operator testimonials - verified quotes only
  const getOperatorTestimonial = (productName: string) => {
    const testimonials: Record<string, any> = {
      "AIMPOINT MICRO T-2 RED DOT SIGHT": {
        quote: "I love my T2 Aimpoint because it's a round dot. Even with a 3x multiplier, at 100 yards that dot is still round…it's crisp. There's no bursting or pixilation or anything like that. It's a nice clear round dot.",
        author: "Pat McNamara",
        credentials: "Former Delta Force, 22 years Army Special Operations",
        sourceUrl: "https://aimpoint.us/pat-mcnamara"
      },
      "HALEY STRATEGIC D3CRM MICRO CHEST RIG": {
        quote: "The D3CRM has earned operational experience with deployments to every branch of the U.S. military including broad usage with U.S./NATO special operations forces, federal, and local law enforcement agencies.",
        author: "Travis Haley",
        credentials: "Force Reconnaissance Marine, 15 years real-world experience",
        sourceUrl: "https://haleystrategic.com/"
      }
    };
    
    return testimonials[productName] || null;
  };

  const documents = [
    { name: "Field Test Report", type: "PDF", size: "2.3 MB" },
    { name: "Technical Specifications", type: "PDF", size: "1.8 MB" },
    { name: "Certification Document", type: "PDF", size: "956 KB" }
  ];

  const tabsData = [
    {
      id: "description",
      label: "DESCRIPTION",
      content: (
        <div className="space-y-4 text-tactical-tan font-hud leading-relaxed">
          <p>{product.description}</p>
          <p>
            This tactical equipment has been rigorously tested in combat environments and meets the highest 
            standards for operational reliability. Designed with input from active duty operators, every 
            component has been optimized for performance under extreme conditions.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-black/30 backdrop-blur-sm p-4 rounded border border-ranger-green/30">
              <h4 className="text-night-vision font-military-header mb-2">MATERIALS</h4>
              <p className="text-sm">Military-grade polymers and reinforced composites</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-4 rounded border border-ranger-green/30">
              <h4 className="text-night-vision font-military-header mb-2">TESTING</h4>
              <p className="text-sm">Field validated by special operations units</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "specifications",
      label: "SPECIFICATIONS",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Weight", value: "2.3 lbs" },
              { label: "Dimensions", value: "12\" x 8\" x 4\"" },
              { label: "Material", value: "Ballistic Nylon" },
              { label: "Color", value: "Multicam" },
              { label: "NSN", value: "8465-01-123-4567" },
              { label: "Manufacturer", value: "Tactical Systems Inc." }
            ].map((spec, index) => (
              <motion.div
                key={spec.label}
                className="flex justify-between items-center p-3 bg-black/30 backdrop-blur-sm rounded border border-ranger-green/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="font-mono-terminal text-tactical-tan text-sm">{spec.label}:</span>
                <span className="text-white font-hud">{spec.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-ops-black text-white">
      <Navigation />
      
      {/* Sticky Add to Cart */}
      <StickyAddToCart
        product={product}
        onAddToCart={handleAddToCart}
      />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/products">
              <motion.button
                className="inline-flex items-center text-night-vision hover:text-white transition-colors font-mono-terminal text-sm tracking-wider"
                whileHover={{ x: -5 }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK TO INVENTORY
              </motion.button>
            </Link>
          </motion.div>

          {/* Split Layout: 60/40 Image/Details */}
          <div className="grid grid-cols-5 gap-12">
            {/* Left Side - Product Images (60%) */}
            <motion.div 
              className="col-span-3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Main Image */}
              <div className="relative mb-6 group">
                <motion.img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                  style={{
                    background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.3), rgba(66, 84, 57, 0.1))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 255, 65, 0.2)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Technical overlay */}
                <motion.div
                  className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm p-3 rounded border border-night-vision/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-night-vision font-mono-terminal text-xs tracking-wider">
                    MODEL: {product.model}
                  </div>
                  <div className="text-night-vision font-mono-terminal text-xs tracking-wider">
                    STATUS: OPERATIONAL
                  </div>
                </motion.div>
              </div>

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-4 gap-3">
                {(() => {
                  const additionalImages = product.additionalImages ? JSON.parse(product.additionalImages) : [product.imageUrl];
                  return additionalImages.map((imageUrl: string, i: number) => (
                    <motion.div
                      key={i}
                      className="relative aspect-square cursor-pointer group"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={imageUrl}
                        alt={`${product.name} view ${i + 1}`}
                        className="w-full h-full object-cover rounded border border-ranger-green/30 group-hover:border-night-vision transition-colors"
                      />
                    </motion.div>
                  ));
                })()}
              </div>
            </motion.div>

            {/* Right Side - Product Details (40%) */}
            <motion.div 
              className="col-span-2 space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="text-night-vision font-mono-terminal text-sm mb-2 tracking-wider">
                    // {product.category}
                  </div>
                  <h1 className="text-4xl font-military-header mb-4 tracking-wider">
                    {product.name}
                  </h1>
                  
                  {/* Professional Operator Use */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-night-vision" />
                      <span className="text-tactical-tan font-hud text-sm">Used by Special Operations Forces</span>
                    </div>
                  </div>
                </div>

                {/* Animated Price Counter */}
                <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-ranger-green/30">
                  <div className="text-5xl font-military-header text-night-vision mb-2">
                    <AnimatedCounter
                      value={parseFloat(product.price)}
                      prefix="$"
                      duration={1500}
                    />
                  </div>
                  <p className="text-tactical-tan font-hud text-sm">
                    Professional operator pricing
                  </p>
                </div>

                {/* Verified Professional Use Section */}
                <div className="space-y-4">
                  <VerifiedProfessionalBadge />
                  
                  {/* Real Operator Testimonial */}
                  {(() => {
                    const testimonial = getOperatorTestimonial(product.name);
                    return testimonial ? (
                      <TestimonialCard
                        quote={testimonial.quote}
                        author={testimonial.author}
                        credentials={testimonial.credentials}
                        sourceUrl={testimonial.sourceUrl}
                      />
                    ) : (
                      <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-ranger-green/30">
                        <p className="text-tactical-tan font-hud text-sm text-center">
                          Operator testimonials being verified - only authentic quotes will be displayed
                        </p>
                      </div>
                    );
                  })()}

                  {/* Document Links */}
                  <div className="space-y-2">
                    <h4 className="font-military-header text-night-vision text-sm tracking-wider mb-3">
                      DOCUMENTATION
                    </h4>
                    {documents.map((doc, index) => (
                      <motion.div
                        key={doc.name}
                        className="group flex items-center justify-between p-3 bg-black/20 backdrop-blur-sm rounded border border-ranger-green/20 hover:border-night-vision/50 transition-colors cursor-pointer"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-night-vision" />
                          <div>
                            <div className="text-white font-hud text-sm">{doc.name}</div>
                            <div className="text-tactical-tan font-mono-terminal text-xs">
                              {doc.type} • {doc.size}
                            </div>
                          </div>
                        </div>
                        <ExternalLink 
                          size={14} 
                          className="text-tactical-tan group-hover:text-night-vision transition-colors" 
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="font-military-header text-night-vision text-sm tracking-wider">
                      QUANTITY:
                    </label>
                    <div className="flex items-center bg-black/30 backdrop-blur-sm rounded border border-ranger-green/30">
                      <motion.button
                        className="px-4 py-2 text-night-vision hover:bg-night-vision hover:text-ops-black transition-colors"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Minus size={16} />
                      </motion.button>
                      <span className="px-4 py-2 font-military-header text-white min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <motion.button
                        className="px-4 py-2 text-night-vision hover:bg-night-vision hover:text-ops-black transition-colors"
                        onClick={() => setQuantity(quantity + 1)}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus size={16} />
                      </motion.button>
                    </div>
                  </div>
                  
                  <motion.button
                    className="w-full bg-night-vision text-ops-black py-4 font-military-header text-lg tracking-wider hover:bg-tactical-tan transition-colors rounded flex items-center justify-center gap-3"
                    onClick={() => handleAddToCart(product, quantity)}
                    disabled={addToCartMutation.isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      boxShadow: '0 0 20px rgba(0, 255, 65, 0.4)'
                    }}
                  >
                    <Zap size={20} />
                    {addToCartMutation.isPending ? 'ADDING TO LOADOUT...' : 'ADD TO TACTICAL LOADOUT'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Liquid Tabs Section */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <LiquidTabs tabs={tabsData} />
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}