function getPhTime() {
  const now = new Date()
  return now.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export default getPhTime
