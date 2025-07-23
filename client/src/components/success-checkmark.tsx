import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessCheckmarkProps {
  isVisible: boolean;
  size?: number;
  className?: string;
}

export default function SuccessCheckmark({ 
  isVisible, 
  size = 24, 
  className = '' 
}: SuccessCheckmarkProps) {
  const pathLength = 1;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      initial={{ scale: 0, rotate: -180 }}
      animate={isVisible ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
      transition={{ 
        duration: 0.5,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
    >
      {/* Circle background */}
      <motion.div
        className="absolute inset-0 rounded-full bg-night-vision"
        initial={{ scale: 0 }}
        animate={isVisible ? { scale: 1 } : { scale: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.5)'
        }}
      />
      
      {/* Checkmark SVG */}
      <motion.svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        className="relative z-10"
      >
        <motion.path
          d="M9 12l2 2 4-4"
          stroke="#0A0A0A"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={pathLength}
          initial={{ pathLength: 0 }}
          animate={isVisible ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ 
            delay: 0.3,
            duration: 0.4,
            ease: "easeInOut"
          }}
        />
      </motion.svg>
      
      {/* Pulse effect */}
      {isVisible && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-night-vision"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            repeat: 2
          }}
        />
      )}
    </motion.div>
  );
}