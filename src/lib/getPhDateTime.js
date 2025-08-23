export function getPhDateTime(dateInput = new Date()) {
  const date = new Date(dateInput)

  const options = {
    year: 'numeric', // 2025
    month: 'long', // June
    day: 'numeric', // 18
    hour: 'numeric', // 3
    minute: '2-digit', // 30
    hour12: true, // 12-hour format with AM/PM
    timeZone: 'Asia/Manila', // Force PH timezone
  }

  return date.toLocaleString('en-PH', options)
}
