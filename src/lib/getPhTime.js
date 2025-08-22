function getPhTime() {
  const now = new Date()
  return now.toLocaleTimeString('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila', // force PH timezone
  })
}

export default getPhTime
