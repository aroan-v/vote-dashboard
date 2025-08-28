// utils/generateSampleData.js

/**
 * Generate sample voting data for Alice and Bob
 * @param {number} numPoints - number of data points to generate
 * @param {string} startTime - ISO string start time (default: now)
 * @returns {Array} Array of objects with timestamp, Alice, Bob
 */
export function generateSampleData(numPoints = 50, startTime = new Date().toISOString()) {
  const start = new Date(startTime)
  const data = []

  // Starting votes
  let aliceVotes = 1000
  let bobVotes = 800

  for (let i = 0; i < numPoints; i++) {
    // Create timestamp: add 5 minutes per step
    const timestamp = new Date(start.getTime() + i * 5 * 60 * 1000).toISOString()

    // Random vote increments for Alice and Bob
    aliceVotes += Math.floor(Math.random() * 30) // Alice grows faster
    bobVotes += Math.floor(Math.random() * 20) // Bob grows slower

    data.push({
      timestamp,
      Alice: aliceVotes,
      Bob: bobVotes,
    })
  }

  return data
}
