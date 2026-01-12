import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface BreakSettingsDropdownProps {
  breakInterval: number;
  breakDuration: number;
  onBreakIntervalChange: (value: number) => void;
  onBreakDurationChange: (value: number) => void;
  disabled?: boolean;
}

const BreakSettingsDropdown = ({
  breakInterval,
  breakDuration,
  onBreakIntervalChange,
  onBreakDurationChange,
  disabled = false,
}: BreakSettingsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const intervals = [
    { value: 0, label: "No breaks" },
    { value: 15, label: "Every 15 min" },
    { value: 25, label: "Every 25 min" },
    { value: 30, label: "Every 30 min" },
    { value: 45, label: "Every 45 min" },
  ];

  const durations = [
    { value: 3, label: "3 min" },
    { value: 5, label: "5 min" },
    { value: 10, label: "10 min" },
    { value: 15, label: "15 min" },
  ];

  const currentIntervalLabel = intervals.find(i => i.value === breakInterval)?.label || "No breaks";
  const currentDurationLabel = durations.find(d => d.value === breakDuration)?.label || "5 min";

  return (
    <div className="fixed top-6 left-6 z-40">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 rounded-2xl bg-card px-4 py-2.5 shadow-card transition-all hover:shadow-glow ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <span className="text-sm font-medium">Break Settings</span>
        <ChevronDown 
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-2 z-50 w-64 rounded-2xl bg-card p-4 shadow-card"
            >
              {/* Break Interval */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Break every
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {intervals.map((interval) => (
                    <button
                      key={interval.value}
                      onClick={() => onBreakIntervalChange(interval.value)}
                      className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                        breakInterval === interval.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {interval.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Break Duration */}
              <AnimatePresence>
                {breakInterval > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="mb-2 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Break duration
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {durations.map((duration) => (
                        <button
                          key={duration.value}
                          onClick={() => onBreakDurationChange(duration.value)}
                          className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                            breakDuration === duration.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {duration.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Current settings summary */}
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  {breakInterval === 0 
                    ? "No breaks scheduled" 
                    : `${currentIntervalLabel} • ${currentDurationLabel} break`
                  }
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BreakSettingsDropdown;
