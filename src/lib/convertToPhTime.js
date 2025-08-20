export function convertToPhTime(utcDateString) {
  const date = new Date(utcDateString)

  const options = {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Use 12-hour format with AM/PM
  }

  const phTime = date.toLocaleString('en-US', options)

  return phTime
}
