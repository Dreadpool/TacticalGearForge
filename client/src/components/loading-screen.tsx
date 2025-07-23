import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateProgress = () => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 1000);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    };

    const interval = setInterval(updateProgress, 100 + Math.random() * 200);
    
    return () => clearInterval(interval);
  }, [onComplete]);

  const progressBlocks = Math.floor((progress / 100) * 40);
  const emptyBlocks = 40 - progressBlocks;
  const progressBar = '█'.repeat(progressBlocks) + '░'.repeat(emptyBlocks);

  return (
    <motion.div
      className={`loading-screen flex items-center justify-center ${!isVisible ? 'fade-out' : ''}`}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center">
        <div className="mb-8">
          <div className="text-night-vision font-mono text-sm mb-4">
            <span className="terminal-cursor">INITIALIZING TACTICAL SYSTEMS</span>
          </div>
          
          <div className="font-mono text-xs text-night-vision mb-4">
            <div className="w-80">
              [{progressBar}] {Math.floor(progress)}%
            </div>
          </div>
          
          <div className="text-xs text-steel-gray font-mono space-y-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              LOADING SECURE PROTOCOLS...
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              ESTABLISHING ENCRYPTED CONNECTION...
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              AUTHENTICATION VERIFIED
            </motion.div>
          </div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="scanline-overlay animate-scanline"></div>
        </div>
      </div>
    </motion.div>
  );
}
