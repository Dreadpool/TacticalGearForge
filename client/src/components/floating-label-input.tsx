import { useState, InputHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, className, value, onChange, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      onChange?.(e);
    };

    const isLabelFloating = isFocused || hasValue;

    return (
      <div className="relative">
        <div className="relative">
          <input
            ref={ref}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "w-full px-4 pt-6 pb-2 bg-black/30 backdrop-blur-sm border border-ranger-green/30 rounded-lg",
              "text-white font-hud placeholder-transparent transition-all duration-300",
              "focus:border-night-vision focus:outline-none focus:ring-2 focus:ring-night-vision/20",
              error && "border-danger-red focus:border-danger-red focus:ring-danger-red/20",
              className
            )}
            {...props}
          />
          
          <motion.label
            className={cn(
              "absolute left-4 text-tactical-tan font-hud pointer-events-none transition-all duration-300",
              error && "text-danger-red"
            )}
            animate={{
              y: isLabelFloating ? -8 : 8,
              scale: isLabelFloating ? 0.85 : 1,
              color: isFocused 
                ? (error ? '#FF4444' : '#00FF41')
                : (error ? '#FF4444' : '#C8A882')
            }}
            style={{
              transformOrigin: 'left center'
            }}
          >
            {label}
          </motion.label>
        </div>

        {/* Error message with shake animation */}
        {error && (
          <motion.div
            className="mt-2 text-danger-red font-hud text-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: 1, 
              x: [0, -5, 5, -5, 5, 0]
            }}
            transition={{ 
              opacity: { duration: 0.3 },
              x: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
            }}
          >
            {error}
          </motion.div>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';

export default FloatingLabelInput;