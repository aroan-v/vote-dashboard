# Vote Dashboard Tracker

## Introduction

Stans of all kinds—whether it’s for music, TV shows, movies, artists, or any celebrity—spend so much time on fan activities like voting in award shows and online polls. This one in particular was for Will Ashley, who was nominated for Nylon’s Boldest Breakout Star. Out of pure passion, a lot of fans (me included) even lost sleep staying up late just to keep voting past bedtime.

To make things more fun, and because I’m part of the fandom myself, I built this interactive vote tracker. The idea was to boost team morale, help everyone see progress in real-time, and even lay out strategies based on the charts and data.

In the end, we still landed in 2nd place—but the experience made me realize how tech can bring a fandom together, make the grind more engaging, and give people a sense of teamwork in something as simple as an online poll.

## Main Features

- **Real-Time Vote Updates:** Fetches vote counts every 3 seconds to show live updates.
- **Snapshot Recording:** Takes a snapshot of votes every 5 minutes using cron-job.org and GitHub Actions.
- **Historical Data Storage:** Saves snapshots in my GitHub repository to display charts and tables.
- **Top Gainer Feature:** Highlights the contestant with the highest vote gain from the last snapshot, usually in 5-minute increments.

### Visualizations & Counters

- **Overall Votes Chart:** Displays the vote “gap” in a line area chart, motivating users to “close the gap” or “widen the gap.”
- **Momentum Chart:** Shows vote gains every 5 minutes; useful for detecting anomalies such as sudden spikes during off-hours.
- **Total Votes Counter:** Tracks total votes rather than live gaps to boost morale and celebrate every vote post-voting.
- **Gained Votes Tracker:** Tabular 5-minute vote counts; helps formulate voting strategies and monitor candidate momentum.
- **Gap History:** Tracks vote gap changes every 5 minutes. Green updates indicate a gain in favor of Will.

## Limitations

- **GitHub Actions Reliability:** Sometimes fails to trigger despite cron-job.org signals, causing spikes in charts and tables.
- **Mobile Chart Rendering:** D3 charts on mobile need more styling for comfort; desktop view is currently sufficient.

## Other Explored Concepts Through Research

- Learned to intercept and parse scripts injected by Nylon’s API, as they return DOM elements with vote results.
- Initially appended fetched HTML every 3 seconds, but later switched to regex extraction for cleaner and lighter processing.
- Evaluated chart libraries: Recharts, VictoryCharts, and ApexCharts—but D3 provided the flexibility and SVG integration needed.

## Applications Used

- **Visual Studio Code** – development
- **Git & GitHub** – version control and data snapshots
- **D3.js** – charting and visualization
- **cron-job.org** – scheduled vote snapshots

## Author

aroan-v
