export function convertToPhTime(utcDateString) {
  const date = new Date(utcDateString)

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // 12-hour format
    timeZone: 'Asia/Manila', // Force PH timezone
  }

  const phTime = date.toLocaleTimeString('en-PH', options)

  return phTime
}
