// Helper: check if time is close to target minute
export function isNearTime(minute, target, tolerance = 2) {
  // |minute - target| <= tolerance
  return Math.abs(minute - target) <= tolerance
}
