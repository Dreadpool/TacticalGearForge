import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-ops-black border-t border-night-vision py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-night-vision font-mono font-bold text-xl mb-4">TACOPS</div>
            <p className="text-steel-gray text-sm mb-4">
              Professional tactical equipment for military and law enforcement operations worldwide.
            </p>
            <div className="font-mono text-xs text-night-vision">
              CLASSIFICATION: UNCLASSIFIED<br/>
              DISTRIBUTION: APPROVED
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-mono font-bold mb-4 text-night-vision">EQUIPMENT</h4>
            <ul className="space-y-2 text-sm text-steel-gray">
              <li><a href="#" className="hover:text-night-vision transition-colors">Body Armor</a></li>
              <li><a href="#" className="hover:text-night-vision transition-colors">Tactical Gear</a></li>
              <li><a href="#" className="hover:text-night-vision transition-colors">Optics</a></li>
              <li><a href="#" className="hover:text-night-vision transition-colors">Accessories</a></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-mono font-bold mb-4 text-night-vision">SUPPORT</h4>
            <ul className="space-y-2 text-sm text-steel-gray">
              <li><a href="#" className="hover:text-night-vision transition-colors">Technical Support</a></li>
              <li><a href="#" className="hover:text-night-vision transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-night-vision transition-colors">Training</a></li>
              <li><a href="#" className="hover:text-night-vision transition-colors">Contact</a></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-mono font-bold mb-4 text-night-vision">SECURE COMMS</h4>
            <div className="hud-border p-4 bg-steel-gray bg-opacity-20">
              <div className="font-mono text-xs text-night-vision mb-2">ENCRYPTED CHANNEL</div>
              <input 
                type="email" 
                placeholder="ENTER EMAIL ADDRESS" 
                className="w-full bg-transparent border-b border-night-vision text-white font-mono text-xs py-2 mb-4 focus:outline-none"
              />
              <button className="w-full bg-night-vision text-ops-black font-mono text-xs py-2 hover:bg-white transition-colors">
                ESTABLISH CONNECTION
              </button>
            </div>
          </motion.div>
        </div>
        
        <div className="border-t border-steel-gray mt-12 pt-8 text-center">
          <p className="font-mono text-xs text-steel-gray">
            © 2024 TACOPS SYSTEMS. ALL RIGHTS RESERVED. // CLASSIFIED MATERIAL HANDLING REQUIRED
          </p>
        </div>
      </div>
    </footer>
  );
}
