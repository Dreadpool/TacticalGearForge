import { motion } from "framer-motion";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center tactical-grid">
      <div className="absolute inset-0 bg-gradient-to-br from-ops-black via-transparent to-camo-green opacity-80"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="text-night-vision font-mono text-sm mb-4">
            CLASSIFIED // TACTICAL EQUIPMENT SYSTEMS
          </div>
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 glitch-text" 
            data-text="MISSION READY"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            MISSION READY
          </motion.h1>
          <motion.p 
            className="text-xl text-steel-gray max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            Professional-grade tactical equipment for military, law enforcement, and security professionals. 
            Every mission demands precision.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <Link href="/products">
            <motion.button 
              className="bg-night-vision text-ops-black px-8 py-4 font-mono font-bold hover:bg-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              BROWSE EQUIPMENT
            </motion.button>
          </Link>
          <Link href="/products">
            <motion.button 
              className="hud-border px-8 py-4 text-night-vision font-mono hover:bg-night-vision hover:text-ops-black transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              VIEW CATALOG
            </motion.button>
          </Link>
        </motion.div>
      </div>
      
      {/* HUD Elements */}
      <motion.div 
        className="absolute top-20 left-6 font-mono text-xs text-night-vision"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 2.5 }}
      >
        <div className="hud-border p-3">
          STATUS: OPERATIONAL<br/>
          SECURITY: CLASSIFIED<br/>
          USERS: 2,847 ACTIVE
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-20 right-6 font-mono text-xs text-night-vision"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 3 }}
      >
        <div className="hud-border p-3">
          LOCATION: SECURED<br/>
          CONNECTION: ENCRYPTED<br/>
          THREAT LEVEL: GREEN
        </div>
      </motion.div>
    </section>
  );
}
