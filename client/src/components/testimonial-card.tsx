import { motion } from 'framer-motion';
import { Quote, ExternalLink } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  rank?: string;
  unit?: string;
  credentials?: string;
  sourceUrl?: string;
  className?: string;
}

export default function TestimonialCard({
  quote,
  author,
  rank,
  unit,
  credentials,
  sourceUrl,
  className = ''
}: TestimonialCardProps) {
  return (
    <motion.div
      className={`relative p-6 rounded-lg overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.3), rgba(66, 84, 57, 0.1))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 65, 0.2)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 30px rgba(0, 255, 65, 0.2)'
      }}
    >
      {/* Quote icon */}
      <Quote 
        size={32} 
        className="text-night-vision/30 mb-4"
        style={{ transform: 'rotate(180deg)' }}
      />
      
      {/* Quote text */}
      <blockquote className="text-white font-hud text-base leading-relaxed mb-4 italic">
        "{quote}"
      </blockquote>
      
      {/* Author info */}
      <div className="border-t border-steel-gray/30 pt-4">
        <div className="font-military-header text-night-vision text-sm tracking-wide">
          {rank && `${rank} `}{author}
        </div>
        {(unit || credentials) && (
          <div className="text-tactical-tan text-xs font-mono-terminal mt-1">
            {credentials || unit}
          </div>
        )}
        {sourceUrl && (
          <a 
            href={sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-night-vision hover:text-white transition-colors text-xs mt-2"
          >
            <span>Verify Quote</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
      
      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: 'radial-gradient(circle at top right, rgba(0, 255, 65, 0.1), transparent)',
          opacity: 0
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}