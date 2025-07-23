import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface LiquidTabsProps {
  tabs: Tab[];
  className?: string;
}

export default function LiquidTabs({ tabs, className = '' }: LiquidTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <div className="relative bg-black/30 backdrop-blur-sm rounded-lg p-2 mb-6">
        <div className="flex relative">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative z-10 flex-1 px-4 py-3 font-military-header text-sm tracking-wider transition-colors duration-300 ${
                activeTab === tab.id
                  ? 'text-ops-black'
                  : 'text-night-vision hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
          
          {/* Liquid background */}
          <motion.div
            className="absolute top-2 bottom-2 bg-night-vision rounded-md"
            style={{
              background: 'linear-gradient(135deg, #00FF41 0%, #00CC33 100%)',
              boxShadow: '0 0 20px rgba(0, 255, 65, 0.4)'
            }}
            initial={false}
            animate={{
              x: `${tabs.findIndex(tab => tab.id === activeTab) * 100}%`,
              width: `${100 / tabs.length}%`
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {tabs.find(tab => tab.id === activeTab)?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}