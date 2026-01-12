import { motion } from "framer-motion";

interface TimerInputProps {
  hours: number;
  minutes: number;
  seconds: number;
  onHoursChange: (value: number) => void;
  onMinutesChange: (value: number) => void;
  onSecondsChange: (value: number) => void;
  disabled?: boolean;
}

const TimerInput = ({
  hours,
  minutes,
  seconds,
  onHoursChange,
  onMinutesChange,
  onSecondsChange,
  disabled = false,
}: TimerInputProps) => {
  const handleChange = (
    value: string,
    max: number,
    setter: (value: number) => void
  ) => {
    const num = parseInt(value) || 0;
    setter(Math.min(Math.max(0, num), max));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2"
    >
      <div className="flex flex-col items-center gap-1">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={hours.toString().padStart(2, '0')}
          onChange={(e) => handleChange(e.target.value.replace(/\D/g, ''), 23, onHoursChange)}
          className="time-input w-16 text-xl text-center [appearance:textfield]"
          disabled={disabled}
        />
        <span className="text-xs text-muted-foreground">hours</span>
      </div>
      <span className="text-2xl font-semibold text-muted-foreground">:</span>
      <div className="flex flex-col items-center gap-1">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={minutes.toString().padStart(2, '0')}
          onChange={(e) => handleChange(e.target.value.replace(/\D/g, ''), 59, onMinutesChange)}
          className="time-input w-16 text-xl text-center [appearance:textfield]"
          disabled={disabled}
        />
        <span className="text-xs text-muted-foreground">mins</span>
      </div>
      <span className="text-2xl font-semibold text-muted-foreground">:</span>
      <div className="flex flex-col items-center gap-1">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={seconds.toString().padStart(2, '0')}
          onChange={(e) => handleChange(e.target.value.replace(/\D/g, ''), 59, onSecondsChange)}
          className="time-input w-16 text-xl text-center [appearance:textfield]"
          disabled={disabled}
        />
        <span className="text-xs text-muted-foreground">secs</span>
      </div>
    </motion.div>
  );
};

export default TimerInput;
