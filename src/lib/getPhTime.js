function phTime(dateAndTime) {
  const now = new Date(dateAndTime) ?? new Date();
  return now.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default phTime;
