export function generateRandomMillion() {
  // Returns a random number between 1,000,000 and 9,999,999
  return Math.floor(Math.random() * 9_000_000) + 1_000_000;
}
