import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      <motion.div
        className="theme-toggle-thumb"
        animate={{ x: isDark ? 40 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Sun className="h-4 w-4 text-primary-foreground" />
        )}
      </motion.div>
      <div className="flex w-full justify-between px-2">
        <Sun className={`h-4 w-4 transition-opacity ${isDark ? 'opacity-40' : 'opacity-0'}`} />
        <Moon className={`h-4 w-4 transition-opacity ${isDark ? 'opacity-0' : 'opacity-40'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;
