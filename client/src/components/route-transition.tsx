import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface RouteTransitionProps {
  children: ReactNode;
  routeKey: string;
}

export default function RouteTransition({ children, routeKey }: RouteTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}