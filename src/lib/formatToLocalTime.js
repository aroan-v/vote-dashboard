/**
 * Converts any date string or Date object to the viewer's local time,
 * formatted as 12-hour time with hours and minutes.
 *
 * @param {string | Date} dateInput - UTC date string or Date object
 * @returns {string} - Formatted time in viewer's local timezone, e.g., "10:45 PM"
 */
export function formatToLocalTime(dateInput) {
  const date = new Date(dateInput) // Handles both Date objects and UTC strings

  // Formatting options
  const options = {
    hour: 'numeric', // Show hours
    minute: '2-digit', // Show minutes with leading zero
    hour12: true, // 12-hour clock with AM/PM
  }

  // Converts to the user's local timezone automatically
  return date.toLocaleTimeString(undefined, options)
}

/**
 * Shortcut to get the current time in the user's local timezone
 * formatted consistently across the dashboard.
 */
export function getLocalTimeNow() {
  return formatToLocalTime(new Date())
}
