import { motion } from "framer-motion";

interface CircularTimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  progress: number;
  isBreak?: boolean;
}

const CircularTimer = ({
  hours,
  minutes,
  seconds,
  progress,
  isBreak = false,
}: CircularTimerProps) => {
  const pad = (num: number) => num.toString().padStart(2, "0");
  
  // SVG circle properties
  const size = 320;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="relative flex items-center justify-center">
      {/* Background glow */}
      <div 
        className={`absolute inset-0 rounded-full blur-3xl opacity-30 ${
          isBreak ? "bg-break-accent" : "bg-primary"
        }`}
        style={{ width: size, height: size }}
      />
      
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
          className="opacity-50"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isBreak ? "hsl(var(--break-accent))" : "hsl(var(--primary))"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* Decorative dots */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const dotRadius = radius + 20;
          const x = size / 2 + dotRadius * Math.cos(angle);
          const y = size / 2 + dotRadius * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i % 3 === 0 ? 4 : 2}
              fill="hsl(var(--muted-foreground))"
              className="opacity-30"
            />
          );
        })}
      </svg>

      {/* Time display in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          key={isBreak ? "break" : "focus"}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="timer-display text-5xl sm:text-6xl font-bold text-foreground tracking-tight">
            {hours > 0 && (
              <>
                <span>{pad(hours)}</span>
                <span className="mx-1 text-muted-foreground animate-pulse-soft">:</span>
              </>
            )}
            <span>{pad(minutes)}</span>
            <span className="mx-1 text-muted-foreground animate-pulse-soft">:</span>
            <span>{pad(seconds)}</span>
          </div>
          
          {isBreak && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-lg font-medium text-break-accent"
            >
              ☕ Break Time
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CircularTimer;
