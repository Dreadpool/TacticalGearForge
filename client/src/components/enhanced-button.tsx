import { motion } from 'framer-motion';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export default function EnhancedButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}: EnhancedButtonProps) {
  const baseClasses = "relative overflow-hidden font-military-header tracking-wider transition-all duration-300";
  
  const variants = {
    primary: "bg-night-vision text-ops-black hover:bg-tactical-tan",
    secondary: "bg-black/30 backdrop-blur-sm text-night-vision border border-night-vision hover:bg-night-vision hover:text-ops-black",
    danger: "bg-danger-red text-white hover:bg-red-700",
    ghost: "bg-transparent text-night-vision hover:bg-night-vision/20"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled || isLoading}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      style={{
        boxShadow: variant === 'primary' ? '0 0 20px rgba(0, 255, 65, 0.3)' : 'none'
      }}
    >
      {/* Gradient shift on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Loading spinner */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
      
      {/* Button content */}
      <motion.span
        className="relative z-10"
        animate={{ opacity: isLoading ? 0 : 1 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}