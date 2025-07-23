import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onEnterArmory: () => void;
}

// Typewriter Text Component
interface TypewriterTextProps {
  text: string;
  speed?: number;
}

const TypewriterText = ({ text, speed = 50 }: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayText}</span>;
};

export default function LoadingScreen({ onEnterArmory }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const loadingSteps = [
    "INITIALIZING TACTICAL SYSTEMS...",
    "LOADING ARMORY DATABASE...",
    "AUTHENTICATING CLEARANCE...",
    "PREPARING EQUIPMENT CATALOG...",
    "SYSTEM READY"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update step based on progress
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length);
        setCurrentStep(Math.min(stepIndex, loadingSteps.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoadingComplete(true), 1000);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [loadingSteps.length]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-ops-black flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Scan lines background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0, 255, 65, 0.1) 2px, rgba(0, 255, 65, 0.1) 4px)',
          animation: 'scanlines 2s linear infinite'
        }}
      />

      {/* Corner brackets */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-night-vision opacity-70 animate-pulse" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-night-vision opacity-70 animate-pulse" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-night-vision opacity-70 animate-pulse" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-night-vision opacity-70 animate-pulse" />
      </div>

      <div className="text-center z-10">
        {/* Title */}
        <motion.h1 
          className="text-4xl md:text-6xl font-military-header mb-8 tracking-widest"
          style={{ 
            textShadow: '0 0 30px rgba(0, 255, 65, 0.6)',
            color: '#00FF41',
            filter: 'drop-shadow(0 0 10px #00FF41)'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          TACTICAL OPERATIONS
        </motion.h1>

        {/* Sketchfab Holosun Embed */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="sketchfab-embed-wrapper" style={{ width: '400px', height: '300px', margin: '0 auto' }}>
            <iframe 
              title="Holosun HS510C Red Dot Sight | Game-Ready (PBR)" 
              frameBorder="0" 
              allowFullScreen
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                border: '2px solid #00FF41',
                boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)'
              }}
              src="https://sketchfab.com/models/2499516c0afd4698b72e4e9f8ab0e140/embed?autostart=1&ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0"
            />
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.div 
          className="text-xl md:text-2xl mb-8 font-mono-terminal tracking-wide"
          style={{ color: '#00FF41' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <TypewriterText text={loadingSteps[currentStep]} speed={30} />
        </motion.div>

        {/* Progress bar or Enter Armory Button */}
        {!loadingComplete ? (
          <>
            {/* Progress bar */}
            <motion.div 
              className="w-80 h-2 bg-ops-black border border-night-vision mx-auto mb-4"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 320 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.div 
                className="h-full bg-night-vision"
                style={{
                  width: `${progress}%`,
                  boxShadow: '0 0 10px #00FF41'
                }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>

            {/* Progress percentage */}
            <motion.div 
              className="text-night-vision font-mono-terminal text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {progress.toFixed(0)}% COMPLETE
            </motion.div>
          </>
        ) : (
          /* Enter Armory Button */
          <motion.button
            className="relative bg-transparent border-2 border-night-vision text-night-vision px-8 py-4 font-military-header text-xl tracking-widest hover:bg-night-vision hover:text-ops-black transition-all duration-300 group"
            style={{
              textShadow: '0 0 10px rgba(0, 255, 65, 0.8)',
              boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            onClick={onEnterArmory}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = '0 0 15px rgba(10, 10, 10, 1)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 65, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = '0 0 10px rgba(0, 255, 65, 0.8)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.3)';
            }}
          >
            <span className="relative z-10">ENTER ARMORY</span>
            
            {/* Glitch effect overlay */}
            <div className="absolute inset-0 bg-night-vision opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
            
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-night-vision opacity-60" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-night-vision opacity-60" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-night-vision opacity-60" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-night-vision opacity-60" />
          </motion.button>
        )}

        {/* Status readout */}
        <motion.div 
          className="fixed top-6 left-6 text-night-vision font-mono-terminal text-xs"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <div className="bg-ops-black bg-opacity-80 p-4 border border-night-vision border-opacity-40">
            <div className="text-night-vision mb-2 font-hud font-semibold">SYSTEM STATUS</div>
            <div className="text-night-vision">SECURITY: CLASSIFIED</div>
            <div className="text-night-vision">ACCESS: AUTHORIZED</div>
            <div className="text-night-vision">MODE: LOADING</div>
            <div className="text-night-vision">READY: {progress >= 100 ? 'TRUE' : 'FALSE'}</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}