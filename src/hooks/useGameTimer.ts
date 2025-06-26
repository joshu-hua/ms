import { useState, useEffect, useRef, useCallback } from "react";

// Define the return type for better TypeScript support
interface UseGameTimerReturn {
	time: number;
	formattedTime: string;
	startTimer: () => void;
	stopTimer: () => void;
	resetTimer: () => void;
	isRunning: boolean;
}

// Custom hook - must start with "use"
export const useGameTimer = (): UseGameTimerReturn => {
	// State for elapsed time in seconds
	const [time, setTime] = useState<number>(0);

	// State for whether timer is running
	const [isRunning, setIsRunning] = useState<boolean>(false);

	// Ref to store interval ID (doesn't cause re-renders)
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Effect to manage the timer interval
	useEffect(() => {
		if (isRunning) {
			// Start the timer
			intervalRef.current = setInterval(() => {
				setTime((prevTime) => prevTime + 1);
			}, 1000);
		} else {
			// Stop the timer
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}

		// Cleanup function - runs when component unmounts or dependencies change
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isRunning]);

	// Functions to control the timer (wrapped in useCallback for optimization)
	const startTimer = useCallback(() => {
		setIsRunning(true);
	}, []);

	const stopTimer = useCallback(() => {
		setIsRunning(false);
	}, []);

	const resetTimer = useCallback(() => {
		setTime(0);
		setIsRunning(false);
	}, []);

	// Format time as MM:SS or just seconds
	const formattedTime = `${Math.floor(time / 60)
		.toString()
		.padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`;

	// Return the hook's interface
	return {
		time,
		formattedTime,
		startTimer,
		stopTimer,
		resetTimer,
		isRunning,
	};
};
