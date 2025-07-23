import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingProgressProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export default function LoadingProgress({ isLoading, onComplete }: LoadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete?.(), 300);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isLoading, onComplete]);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-night-vision via-tactical-tan to-night-vision"
        style={{
          background: 'linear-gradient(90deg, #00FF41 0%, #C8A882 50%, #00FF41 100%)',
          boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)',
        }}
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </motion.div>
  );
}