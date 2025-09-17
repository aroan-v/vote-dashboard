# Nylon Boldest Breakout Star Dashboard Tracker

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
