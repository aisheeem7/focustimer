import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import TimerInput from "./TimerInput";
import CircularTimer from "./CircularTimer";
import BreakSettingsDropdown from "./BreakSettingsDropdown";
import MotivationalPopup from "./MotivationalPopup";

const MOTIVATIONAL_MESSAGES = [
  "you're killing it ✨",
  "consistency is the key 🔑",
  "stay focused 🎯",
  "small steps, big results 📈",
  "keep going 💪",
  "your effort matters 💜",
  "you're doing amazing 🌟",
  "one more push 🚀",
  "this focus will pay off 🌈",
];

const FocusTimer = () => {
  // Timer state
  const [inputHours, setInputHours] = useState(0);
  const [inputMinutes, setInputMinutes] = useState(25);
  const [inputSeconds, setInputSeconds] = useState(0);

  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Break state
  const [breakInterval, setBreakInterval] = useState(0);
  const [breakDuration, setBreakDuration] = useState(5);
  const [isBreak, setIsBreak] = useState(false);
  const [breakRemaining, setBreakRemaining] = useState(0);
  const [focusElapsed, setFocusElapsed] = useState(0);
  const [breakTotalTime, setBreakTotalTime] = useState(0);

  // Motivational popup state
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const lastMessageTime = useRef(0);
  const messageIndex = useRef(0);

  // Total input time for calculations
  const totalInputTime = inputHours * 3600 + inputMinutes * 60 + inputSeconds;

  // Convert remaining time to display format
  const displayHours = Math.floor(remainingTime / 3600);
  const displayMinutes = Math.floor((remainingTime % 3600) / 60);
  const displaySeconds = remainingTime % 60;

  const breakDisplayMinutes = Math.floor(breakRemaining / 60);
  const breakDisplaySeconds = breakRemaining % 60;

  // Calculate progress
  const focusProgress = hasStarted && !isBreak
    ? ((totalInputTime - remainingTime) / totalInputTime) * 100
    : 0;
  
  const breakProgress = isBreak && breakTotalTime > 0
    ? ((breakTotalTime - breakRemaining) / breakTotalTime) * 100
    : 0;

  // Show motivational popup
  const showMotivationalPopup = useCallback((msg: string, duration = 4000) => {
    setPopupMessage(msg);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), duration);
  }, []);

  // Start timer
  const handleStart = () => {
    if (!hasStarted) {
      if (totalInputTime === 0) return;
      setRemainingTime(totalInputTime);
      setHasStarted(true);
      setFocusElapsed(0);
      lastMessageTime.current = 0;
      messageIndex.current = 0;
    }
    setIsRunning(true);
  };

  // Pause timer
  const handlePause = () => {
    setIsRunning(false);
  };

  // Reset timer
  const handleReset = () => {
    setIsRunning(false);
    setHasStarted(false);
    setRemainingTime(0);
    setIsBreak(false);
    setBreakRemaining(0);
    setBreakTotalTime(0);
    setFocusElapsed(0);
    lastMessageTime.current = 0;
    messageIndex.current = 0;
    setShowPopup(false);
  };

  // Main timer effect
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (isBreak) {
        // Break timer
        setBreakRemaining((prev) => {
          if (prev <= 1) {
            setIsBreak(false);
            setBreakTotalTime(0);
            showMotivationalPopup("break's over, let's go! 📚", 4000);
            return 0;
          }
          return prev - 1;
        });
      } else {
        // Focus timer
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setHasStarted(false);
            showMotivationalPopup("amazing work! you did it! 🎉", 6000);
            return 0;
          }
          return prev - 1;
        });

        setFocusElapsed((prev) => {
          const newElapsed = prev + 1;

          // Check for break interval
          if (
            breakInterval > 0 &&
            newElapsed > 0 &&
            newElapsed % (breakInterval * 60) === 0 &&
            remainingTime > 1
          ) {
            const breakTime = breakDuration * 60;
            setIsBreak(true);
            setBreakRemaining(breakTime);
            setBreakTotalTime(breakTime);
            showMotivationalPopup("time for a quick break! ☕", 4000);
          }

          // Check for motivational message (every 5 minutes)
          const elapsedMinutes = Math.floor(newElapsed / 60);
          if (
            elapsedMinutes > 0 &&
            elapsedMinutes % 5 === 0 &&
            lastMessageTime.current !== elapsedMinutes &&
            !isBreak
          ) {
            lastMessageTime.current = elapsedMinutes;
            const msg = MOTIVATIONAL_MESSAGES[messageIndex.current % MOTIVATIONAL_MESSAGES.length];
            messageIndex.current += 1;
            showMotivationalPopup(msg);
          }

          return newElapsed;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isRunning,
    isBreak,
    breakInterval,
    breakDuration,
    remainingTime,
    showMotivationalPopup,
  ]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      {/* Break Settings Dropdown - Top Left */}
      <BreakSettingsDropdown
        breakInterval={breakInterval}
        breakDuration={breakDuration}
        onBreakIntervalChange={setBreakInterval}
        onBreakDurationChange={setBreakDuration}
        disabled={hasStarted}
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">
          Let's Focus!
        </h1>
        <p className="text-muted-foreground">you can do it bro!</p>
      </motion.div>

      {/* Main Timer Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center"
      >
        {/* Timer Display */}
        <div className="mb-8">
          {hasStarted ? (
            isBreak ? (
              <CircularTimer
                hours={0}
                minutes={breakDisplayMinutes}
                seconds={breakDisplaySeconds}
                progress={breakProgress}
                isBreak
              />
            ) : (
              <CircularTimer
                hours={displayHours}
                minutes={displayMinutes}
                seconds={displaySeconds}
                progress={focusProgress}
              />
            )
          ) : (
            <div className="glass-card p-8 rounded-3xl">
              <TimerInput
                hours={inputHours}
                minutes={inputMinutes}
                seconds={inputSeconds}
                onHoursChange={setInputHours}
                onMinutesChange={setInputMinutes}
                onSecondsChange={setInputSeconds}
                disabled={hasStarted}
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              disabled={!hasStarted && totalInputTime === 0}
              className="soft-button flex items-center gap-2 bg-primary text-primary-foreground disabled:opacity-50 px-8 py-4 text-lg"
            >
              <Play className="h-6 w-6" />
              {hasStarted ? "Resume" : "Start"}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePause}
              className="soft-button flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 text-lg"
            >
              <Pause className="h-6 w-6" />
              Pause
            </motion.button>
          )}
          {hasStarted && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="soft-button flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-4"
            >
              <RotateCcw className="h-6 w-6" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Motivational Popup */}
      <MotivationalPopup message={popupMessage} isVisible={showPopup} />

      {/* Footer */}
      <p className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/60">
        ୨ৎ made with ♡ by ash ୨ৎ
      </p>
    </div>
  );
};

export default FocusTimer;
