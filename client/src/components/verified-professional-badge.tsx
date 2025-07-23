import { motion } from 'framer-motion';
import { Shield, CheckCircle } from 'lucide-react';

interface VerifiedProfessionalBadgeProps {
  className?: string;
}

export default function VerifiedProfessionalBadge({ className = '' }: VerifiedProfessionalBadgeProps) {
  return (
    <motion.div
      className={`relative inline-flex items-center gap-3 px-6 py-4 rounded-lg overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 255, 65, 0.1), rgba(0, 255, 65, 0.05))',
        border: '1px solid rgba(0, 255, 65, 0.3)'
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Holographic effect background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(0, 255, 65, 0.1) 50%, transparent 70%)',
        }}
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Shield icon with glow */}
      <motion.div
        className="relative z-10"
        animate={{
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Shield 
          size={24} 
          className="text-night-vision"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(0, 255, 65, 0.8))'
          }}
        />
      </motion.div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-military-header text-night-vision text-sm tracking-wider">
            VERIFIED PROFESSIONAL USE
          </span>
          <CheckCircle size={16} className="text-night-vision" />
        </div>
        <p className="text-tactical-tan text-xs font-hud">
          Validated by active duty operators
        </p>
      </div>
      
      {/* Subtle pulsing border */}
      <motion.div
        className="absolute inset-0 rounded-lg border border-night-vision/50"
        animate={{
          boxShadow: [
            '0 0 20px rgba(0, 255, 65, 0.3)',
            '0 0 30px rgba(0, 255, 65, 0.5)',
            '0 0 20px rgba(0, 255, 65, 0.3)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}