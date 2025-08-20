const fs = require('fs')

function generateFakeVotes() {
  const data = []
  let candidateA = 200000
  let candidateB = 198000
  let candidateC = 150000
  let candidateD = 80000
  let candidateE = 50000

  const timeLabels = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute++) {
      // 1-min increments
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const hour12 = hour % 12 === 0 ? 12 : hour % 12
      const minLabel = minute.toString().padStart(2, '0')
      timeLabels.push(`${hour12}:${minLabel} ${ampm}`)
    }
  }

  timeLabels.forEach((time, index) => {
    let aGain, bGain, cGain, dGain, eGain

    if (index < 300) {
      // First ~5 hours: close race
      aGain = randBetween(200, 400)
      bGain = randBetween(200, 400)
    } else if (index < 600) {
      // Next ~5 hours: B surges
      aGain = randBetween(100, 200)
      bGain = randBetween(400, 700)
    } else if (index < 900) {
      // Next ~5 hours: A fights back
      aGain = randBetween(400, 700)
      bGain = randBetween(100, 200)
    } else {
      // Last 9 hours: steady pace
      aGain = randBetween(200, 400)
      bGain = randBetween(200, 400)
    }

    // Smaller, less impactful gains for C, D, and E
    cGain = randBetween(50, 120)
    dGain = randBetween(20, 80)
    eGain = randBetween(10, 50)

    candidateA += aGain
    candidateB += bGain
    candidateC += cGain
    candidateD += dGain
    candidateE += eGain

    data.push({
      time,
      candidateA,
      candidateB,
      candidateC,
      candidateD,
      candidateE,
    })
  })

  return data
}

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate once and save to JSON file
const fakeData = generateFakeVotes()
fs.writeFileSync('votesData.json', JSON.stringify(fakeData, null, 2))
console.log('votesData.json generated with 1-min increments for 24 hours')
