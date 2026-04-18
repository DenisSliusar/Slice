// Haptic feedback utilities for mobile devices

export type HapticType = "light" | "medium" | "heavy" | "success" | "warning" | "error";

export const triggerHaptic = (type: HapticType = "light") => {
  // Check if the Vibration API is available
  if (!navigator.vibrate) {
    return;
  }

  const patterns: Record<HapticType, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 50,
    success: [10, 50, 10],
    warning: [20, 100],
    error: [50, 100, 50],
  };

  try {
    navigator.vibrate(patterns[type]);
  } catch (error) {
    // Silently fail if vibration is not supported
    console.debug("Haptic feedback not supported", error);
  }
};

// Specific haptic functions for common actions
export const haptics = {
  light: () => triggerHaptic("light"),
  medium: () => triggerHaptic("medium"),
  heavy: () => triggerHaptic("heavy"),
  success: () => triggerHaptic("success"),
  warning: () => triggerHaptic("warning"),
  error: () => triggerHaptic("error"),
};
