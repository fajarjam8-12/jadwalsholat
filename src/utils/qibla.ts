/**
 * Qibla Direction and Digital Compass Engine
 * Accurate spherical trigonometric calculations to the Holy Ka'bah in Makkah
 */

export const KAABA_COORDS = {
  latitude: 21.422487,
  longitude: 39.826206,
};

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/**
 * Calculates Qibla azimuth angle from True North (0° = North, 90° = East, etc.)
 */
export function calculateQiblaDirection(userLat: number, userLng: number): number {
  const phiK = toRad(KAABA_COORDS.latitude);
  const lambdaK = toRad(KAABA_COORDS.longitude);
  const phi = toRad(userLat);
  const lambda = toRad(userLng);

  const deltaLambda = lambdaK - lambda;

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);

  let qiblaDeg = toDeg(Math.atan2(y, x));
  qiblaDeg = (qiblaDeg + 360) % 360;

  return Math.round(qiblaDeg * 10) / 10;
}

/**
 * Calculates distance from user to Ka'bah in kilometers using Haversine
 */
export function calculateDistanceToKaaba(userLat: number, userLng: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(KAABA_COORDS.latitude - userLat);
  const dLng = toRad(KAABA_COORDS.longitude - userLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(userLat)) *
      Math.cos(toRad(KAABA_COORDS.latitude)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Normalize angle to 0 - 360 degrees
 */
export function normalizeAngle(angle: number): number {
  let a = angle % 360;
  if (a < 0) a += 360;
  return a;
}

/**
 * Calculates shortest difference between heading and target (ranges -180 to 180)
 */
export function getAngleDifference(heading: number, target: number): number {
  let diff = (target - heading + 180) % 360 - 180;
  if (diff < -180) diff += 360;
  return diff;
}
