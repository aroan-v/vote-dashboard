async function fetchVotes() {
  try {
    // Step 1: Fetch the poll script output
    const response = await fetch('https://polls.polldaddy.com/vote-js.php?p=15909793')
    const text = await response.text()

    // Step 2: Regex to capture name + percentage + votes
    // Example match:  title='FYANG SMITH'> FYANG SMITH </span><span class='pds-feedback-result'><span class='pds-feedback-per'>&nbsp;49.11%</span><span class='pds-feedback-votes'>&nbsp; (347,764 votes)
    const pollRegex =
      /title='([^']+)'.*?pds-feedback-per'>&nbsp;([\d.]+)%.*?pds-feedback-votes'>&nbsp;\(([\d,]+) votes\)/g

    const results = []
    let match

    while ((match = pollRegex.exec(text)) !== null) {
      results.push({
        name: match[1].trim(), // Candidate name
        percentage: parseFloat(match[2]), // Percentage as number
        votes: parseInt(match[3].replace(/,/g, ''), 10), // Votes as integer
      })
    }

    return results
  } catch (err) {
    console.error('Error fetching votes:', err)
  }
}

fetchVotes()
