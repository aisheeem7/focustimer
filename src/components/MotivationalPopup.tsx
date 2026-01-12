import { motion, AnimatePresence } from "framer-motion";

interface MotivationalPopupProps {
  message: string;
  isVisible: boolean;
}

const MotivationalPopup = ({ message, isVisible }: MotivationalPopupProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 10 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25 
          }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="px-5 py-3 rounded-2xl bg-card/90 backdrop-blur-md border border-primary/20 shadow-glow">
            <p className="text-sm font-medium text-foreground">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MotivationalPopup;
