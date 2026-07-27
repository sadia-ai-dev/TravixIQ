import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TransitionProviderProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Centralized TransitionProvider to wrap main views and content areas.
 * Provides consistent fluid entry/exit animations across the application.
 */
const TransitionProvider: React.FC<TransitionProviderProps> = ({ children, className = '', id }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        id={id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default TransitionProvider;
