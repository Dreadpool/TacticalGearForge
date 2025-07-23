import { motion } from "framer-motion";
import { RotateCcw, Maximize, Info } from "lucide-react";

export default function ProductShowcase3D() {
  return (
    <section className="py-20 bg-gradient-to-br from-camo-green to-ops-black relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-night-vision font-mono text-sm mb-4">// 3D PRODUCT VIEWER</div>
            <h2 className="text-4xl font-bold mb-6">INSPECT EVERY DETAIL</h2>
            <p className="text-steel-gray mb-8 leading-relaxed">
              Our advanced 3D visualization system allows you to examine every component, 
              material specification, and tactical feature before making your selection.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-night-vision"></div>
                <span>360° Product Rotation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-night-vision"></div>
                <span>Material Detail Analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-night-vision"></div>
                <span>Component Breakdown View</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hud-border p-8 bg-ops-black bg-opacity-60">
              <div className="aspect-square bg-steel-gray bg-opacity-30 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    className="text-night-vision text-6xl mb-4"
                    animate={{ 
                      rotateY: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    ⬢
                  </motion.div>
                  <p className="font-mono text-night-vision">3D VIEWER ACTIVE</p>
                  <p className="font-mono text-xs text-steel-gray mt-2">// THREE.JS IMPLEMENTATION</p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-4 right-4 space-y-2">
              <button className="hud-border p-2 bg-ops-black text-night-vision hover:bg-night-vision hover:text-ops-black transition-all">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button className="hud-border p-2 bg-ops-black text-night-vision hover:bg-night-vision hover:text-ops-black transition-all">
                <Maximize className="w-4 h-4" />
              </button>
              <button className="hud-border p-2 bg-ops-black text-night-vision hover:bg-night-vision hover:text-ops-black transition-all">
                <Info className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
