import React from 'react'

function NylonPoll() {
  return (
    <div className="">
      {/* Load Crowdsignal poll inside iframe */}
      <iframe title="Boldest Breakout Star" src="https://poll.fm/15909793/embed" height="650" />
    </div>
  )
}

export default NylonPoll
