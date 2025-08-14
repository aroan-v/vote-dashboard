let previousDigits = [];
let snapshotHistory = []; // holds recent snapshots (max 5)
let updateHistory = []; // stores past timestamps (as Date objects)
let updateGaps = []; // stores time gaps between updates in milliseconds

let baselineVotes = {}; // Will store previous vote snapshot
const voterCountSnapshot = [];
let lastFetchedData = null;
let lastTime = null;
let lastUnique;
let lastVoterCount = null;
let lastVotesDustbia = null;
let lastVotesWillca = null;
let voteGaps = null;
let times = null;
let colors = [];
let dotMarkers = [];
const colorMap = {
  WILLCA: '#E95793', // pink
  DUSTBIA: '#9AA6B2', // gray
};
let lastGithubDate = null;

function sanitizeRawData(rawData) {
  const times = rawData.times;

  // Check if the last time entry is a duplicate
  if (times.at(-1) === times.at(-2)) {
    // Remove last timestamp
    rawData.times.pop();

    // Loop through voteIncrements and remove last item in each array
    for (const key in rawData.voteIncrements) {
      rawData.voteIncrements[key].pop();
    }

    // Optional: if you also want to trim from updateTimesPH or voteGap
    rawData.updateTimesPH?.pop?.();
    rawData.voteGap?.pop?.();
  }

  return rawData;
}

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('tableBody');
  setInterval(updatePHTime, 500);

  async function fetchAndDisplayVotes() {
    try {
      const response = await fetch(
        'https://backend.choicely.com/contests/Y2hvaWNlbHktZXUvY29udGVzdHMvVEV4RWhYSGhMdDNWVU9odGlISlA/vote_counts/'
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const participants = Object.entries(data.participants);
      const updatedDate = phTime(data.updated);

      if (lastTime === updatedDate) {
        return; // do nothing if its still the same api
      }

      lastTime = updatedDate;
      displayVotes({ participants, updatedDate });
    } catch (error) {
      console.error('Error fetching vote data:', error);
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-red-400 py-4">
            Failed to load data (${error.message})
          </td>
        </tr>`;
    }
  }

  const fakeData = {
    times: [
      '12:36 AM',
      '1:00 AM',
      '1:14 AM',
      '1:30 AM',
      '1:37 AM',
      '2:00 AM',
      '2:15 AM',
      '2:29 AM',
      '2:35 AM',
      '3:00 AM',
      '3:15 AM',
      '3:17 AM',
      '3:45 AM',
      '3:59 AM',
      '4:12 AM',
      '4:30 AM',
      '4:58 AM',
      '5:10 AM',
      '5:18 AM',
      '5:44 AM',
      '5:57 AM',
      '6:11 AM',
      '6:29 AM',
      '6:43 AM',
      '6:57 AM',
      '7:14 AM',
      '7:24 AM',
      '7:41 AM',
      '7:59 AM',
      '8:06 AM',
      '8:23 AM',
      '8:29 AM',
      '8:55 AM',
      '9:10 AM',
      '9:22 AM',
      '9:41 AM',
      '9:48 AM',
      '10:10 AM',
      '10:29 AM',
      '10:41 AM',
      '10:59 AM',
      '11:03 AM',
      '11:27 AM',
      '11:45 AM',
      '12:00 PM',
      '12:27 PM',
      '12:35 PM',
      '12:57 PM',
      '1:10 PM',
      '1:22 PM',
      '1:44 PM',
      '1:55 PM',
      '2:05 PM',
      '2:14 PM',
      '2:31 PM',
      '2:52 PM',
      '3:14 PM',
      '3:17 PM',
      '3:29 PM',
      '3:59 PM',
      '4:14 PM',
      '4:29 PM',
      '4:44 PM',
      '4:59 PM',
      '5:14 PM',
      '5:22 PM',
      '5:42 PM',
      '5:59 PM',
      '6:14 PM',
      '6:29 PM',
      '6:44 PM',
      '6:59 PM',
      '7:15 PM',
      '7:29 PM',
      '7:44 PM',
      '7:56 PM',
      '8:15 PM',
      '8:30 PM',
      '8:41 PM',
      '9:00 PM',
      '9:15 PM',
      '9:30 PM',
      '9:41 PM',
      '10:00 PM',
      '10:15 PM',
      '10:28 PM',
      '11:00 PM',
      '11:14 PM',
      '11:26 PM',
      '11:44 PM',
      '11:59 PM',
      '12:12 AM',
      '12:29 AM',
      '12:44 AM',
      '12:59 AM',
      '12:59 AM',
    ],
    voteIncrements: {
      KISH: [
        22, 73, 132, 102, 3, 11, 78, 31, 0, 117, 420, 41, 322, 382, 1,
        118, 111, 2, 0, 91, 74, 84, 135, 13, 5, 5, 2, 5, 34, 8, 6, 3,
        8, 25, 7, 118, 1, 7, 196, 35, 6, 2, 627, 9, 9, 16, 7, 68, 124,
        68, 10, 9, 9, 82, 148, 115, 118, 0, 2, 217, 4, 12, 202, 120,
        2, 30, 46, 13, 113, 8, 166, 146, 6, 28, 105, 237, 137, 142,
        172, 1413, 37, 131, 301, 8, 541, 80, 128, 37, 14, 38, 17, 46,
        131, 102, 138, 0,
      ],
      DUSTBIA: [
        42200, 94262, 52472, 49074, 17886, 67005, 41690, 37896, 15732,
        65220, 40516, 5645, 63374, 27862, 25895, 30326, 48468, 20834,
        14560, 49207, 21734, 23642, 35351, 26825, 30404, 37731, 23575,
        37027, 42859, 15921, 46764, 14766, 81676, 46697, 39691, 71779,
        29012, 87988, 78491, 51982, 81756, 17517, 94710, 63631, 70267,
        98748, 32555, 84752, 56293, 53230, 96385, 53217, 43810, 39135,
        75709, 96799, 94951, 12047, 49485, 119830, 60331, 56124,
        51236, 51397, 49010, 27366, 65726, 60079, 61347, 70565, 74820,
        75600, 71471, 75084, 80154, 55128, 109419, 79376, 58760,
        93362, 80498, 92981, 74570, 149549, 130639, 118996, 302493,
        128605, 102251, 137354, 99609, 72146, 93254, 69500, 61612, 0,
      ],
      BREKA: [
        73, 256, 183, 4, 8, 14, 44, 74, 46, 43, 76, 3, 72, 4, 0, 37,
        38, 0, 0, 401, 18, 65, 36, 5, 11, 5, 10, 4, 10, 54, 13, 54,
        48, 38, 7, 18, 0, 26, 54, 77, 71, 37, 32, 222, 230, 71, 1, 11,
        30, 8, 27, 67, 40, 89, 22, 84, 31, 1, 4, 75, 79, 11, 13, 6, 2,
        3, 40, 15, 22, 11, 36, 65, 63, 36, 24, 101, 19, 84, 35, 13, 4,
        25, 7, 520, 74, 12, 59, 4, 29, 96, 54, 36, 123, 20, 11, 0,
      ],
      WILLCA: [
        57211, 122063, 72685, 76304, 28662, 93727, 66063, 55567,
        19681, 81250, 44048, 5199, 67100, 29305, 22749, 25836, 36621,
        16427, 11513, 42175, 16844, 18105, 26514, 21700, 20851, 30732,
        20460, 35703, 34770, 11926, 43425, 15379, 65336, 35224, 34853,
        59892, 20525, 75637, 54721, 33734, 58236, 11634, 80378, 53243,
        52646, 119577, 40949, 108447, 63770, 55777, 105749, 51526,
        50272, 43474, 77018, 101585, 97796, 11560, 41380, 115779,
        46696, 51384, 65392, 76704, 79591, 40727, 116196, 92809,
        81371, 82123, 78519, 73224, 74346, 63937, 67531, 54081,
        101898, 70049, 68372, 151415, 112218, 128617, 96305, 155225,
        128841, 121941, 272197, 115257, 80396, 96746, 60945, 48434,
        67786, 47025, 45964, 0,
      ],
      AZRALPH: [
        22, 74, 44, 2, 2, 13, 105, 9, 5, 67, 70, 4, 71, 4, 2, 36, 24,
        0, 0, 51, 171, 2, 4, 1, 7, 5, 1, 5, 6, 2, 3, 3, 232, 192, 110,
        79, 61, 333, 92, 51, 4, 1, 16, 10, 9, 113, 3, 11, 213, 16, 33,
        8, 11, 5, 8, 237, 74, 1, 4, 208, 19, 4, 25, 1, 7, 195, 58, 2,
        7, 5, 38, 15, 159, 133, 56, 5, 12, 6, 16, 86, 36, 15, 7, 6,
        20, 14, 91, 5, 8, 28, 17, 12, 9, 1, 52, 0,
      ],
    },
    baselineVotes: {
      KISH: 74221,
      DUSTBIA: 21187071,
      BREKA: 110085,
      WILLCA: 20524610,
      AZRALPH: 163736,
    },
    updateTimesPH: [
      '08/07/2025, 24:45:17',
      '08/07/2025, 01:00:21',
      '08/07/2025, 01:15:14',
      '08/07/2025, 01:30:15',
      '08/07/2025, 01:45:17',
      '08/07/2025, 02:00:22',
      '08/07/2025, 02:15:18',
      '08/07/2025, 02:30:17',
      '08/07/2025, 02:45:14',
      '08/07/2025, 03:00:23',
      '08/07/2025, 03:15:16',
      '08/07/2025, 03:30:16',
      '08/07/2025, 03:45:16',
      '08/07/2025, 04:00:15',
      '08/07/2025, 04:15:15',
      '08/07/2025, 04:30:18',
      '08/07/2025, 05:00:20',
      '08/07/2025, 05:15:14',
      '08/07/2025, 05:30:19',
      '08/07/2025, 05:45:20',
      '08/07/2025, 06:00:18',
      '08/07/2025, 06:15:17',
      '08/07/2025, 06:30:15',
      '08/07/2025, 06:45:15',
      '08/07/2025, 07:00:21',
      '08/07/2025, 07:15:16',
      '08/07/2025, 07:30:17',
      '08/07/2025, 07:45:15',
      '08/07/2025, 08:00:22',
      '08/07/2025, 08:15:17',
      '08/07/2025, 08:30:18',
      '08/07/2025, 08:45:14',
      '08/07/2025, 09:00:16',
      '08/07/2025, 09:15:13',
      '08/07/2025, 09:30:16',
      '08/07/2025, 09:45:13',
      '08/07/2025, 10:00:20',
      '08/07/2025, 10:15:12',
      '08/07/2025, 10:30:17',
      '08/07/2025, 10:45:17',
      '08/07/2025, 11:00:16',
      '08/07/2025, 11:15:15',
      '08/07/2025, 11:30:16',
      '08/07/2025, 11:45:16',
      '08/07/2025, 12:00:19',
      '08/07/2025, 12:30:17',
      '08/07/2025, 12:45:13',
      '08/07/2025, 13:00:14',
      '08/07/2025, 13:15:10',
      '08/07/2025, 13:30:17',
      '08/07/2025, 13:45:13',
      '08/07/2025, 14:00:19',
      '08/07/2025, 14:15:15',
      '08/07/2025, 14:30:12',
      '08/07/2025, 14:45:15',
      '08/07/2025, 15:00:22',
      '08/07/2025, 15:15:14',
      '08/07/2025, 15:30:18',
      '08/07/2025, 15:45:15',
      '08/07/2025, 16:00:18',
      '08/07/2025, 16:15:15',
      '08/07/2025, 16:30:19',
      '08/07/2025, 16:45:16',
      '08/07/2025, 17:00:22',
      '08/07/2025, 17:15:16',
      '08/07/2025, 17:30:19',
      '08/07/2025, 17:45:12',
      '08/07/2025, 18:00:19',
      '08/07/2025, 18:15:17',
      '08/07/2025, 18:30:18',
      '08/07/2025, 18:45:17',
      '08/07/2025, 19:00:21',
      '08/07/2025, 19:15:13',
      '08/07/2025, 19:30:22',
      '08/07/2025, 19:45:14',
      '08/07/2025, 20:00:26',
      '08/07/2025, 20:15:16',
      '08/07/2025, 20:30:16',
      '08/07/2025, 20:45:14',
      '08/07/2025, 21:00:23',
      '08/07/2025, 21:15:16',
      '08/07/2025, 21:30:18',
      '08/07/2025, 21:45:18',
      '08/07/2025, 22:00:19',
      '08/07/2025, 22:15:14',
      '08/07/2025, 22:30:18',
      '08/07/2025, 23:00:39',
      '08/07/2025, 23:15:17',
      '08/07/2025, 23:30:16',
      '08/07/2025, 23:45:15',
      '08/08/2025, 24:00:18',
      '08/08/2025, 24:15:20',
      '08/08/2025, 24:30:21',
      '08/08/2025, 24:45:17',
      '08/08/2025, 01:00:22',
      '08/08/2025, 01:15:19',
    ],
    voteGap: [
      -723747, -695946, -675733, -648503, -637727, -611005, -586632,
      -568961, -565012, -548982, -545450, -545896, -542170, -540727,
      -543873, -548363, -560210, -564617, -567664, -574696, -579586,
      -585123, -593960, -599085, -608638, -615637, -618752, -620076,
      -628165, -632160, -635499, -634886, -651226, -662699, -667537,
      -679424, -687911, -700262, -724032, -742280, -765800, -771683,
      -786015, -796403, -814024, -793195, -784801, -761106, -753629,
      -751082, -741718, -743409, -736947, -732608, -731299, -726513,
      -723668, -724155, -732260, -736311, -749946, -754686, -740530,
      -715223, -684642, -671281, -620811, -588081, -568057, -556499,
      -552800, -555176, -552301, -563448, -576071, -577118, -584639,
      -593966, -584354, -526301, -494581, -458945, -437210, -431534,
      -433332, -430387, -460683, -474031, -495886, -536494, -575158,
      -598870, -624338, -646813, -662461, -662461,
    ],
  };

  async function fetchGithubData() {
    try {
      const res = await fetch(
        'https://raw.githubusercontent.com/aroan-v/vpa-gap-cache/main/rollingVotes.json'
      );

      const unsanitizedData = await res.json();
      const rawData = sanitizeRawData(unsanitizedData);
      const lastUpdateTimesPh = rawData.updateTimesPH.at(-1);

      if (lastUpdateTimesPh === lastGithubDate) {
        return;
      }

      lastGithubDate = lastUpdateTimesPh;

      renderChartAndGapTable(rawData);
    } catch (err) {
      console.error('Chart update failed:', err);
    }
  }

  fetchAndDisplayVotes();
  fetchGithubData();
  setInterval(fetchAndDisplayVotes, 1000); // 300000 ms = 5 minutes
  setInterval(fetchGithubData, 1000); // 300000 ms = 5 minutes
});

function displayVotes({ participants, updatedDate }) {
  const tableBody = document.getElementById('tableBody');
  setInterval(updatePHTime, 500);

  const participantNames = {
    Y2hvaWNlbHktZXUvY29udGVzdHMvVEV4RWhYSGhMdDNWVU9odGlISlAvcGFydGljaXBhbnRzL01meENqT254VWpiaENEdnRQQXZD:
      'DUSTBIA',
    Y2hvaWNlbHktZXUvY29udGVzdHMvVEV4RWhYSGhMdDNWVU9odGlISlAvcGFydGljaXBhbnRzL09aMlNGVFpPTmZiZml4Y2N1c1Zp:
      'WILLCA',
    Y2hvaWNlbHktZXUvY29udGVzdHMvVEV4RWhYSGhMdDNWVU9odGlISlAvcGFydGljaXBhbnRzLzlaUzdtZW55ZHNWSWpSekdyQXdB:
      'BREKA',
    Y2hvaWNlbHktZXUvY29udGVzdHMvVEV4RWhYSGhMdDNWVU9odGlISlAvcGFydGljaXBhbnRzL0g3b3R1cTdQYzdjc1MzT2xEaTFk:
      'AZRALPH',
    Y2hvaWNlbHktZXUvY29udGVzdHMvVEV4RWhYSGhMdDNWVU9odGlISlAvcGFydGljaXBhbnRzL3NpNmM2a1JEUlpuQUdVQWhzS201:
      'KISH',
  };

  const results = participants.map(([id, info]) => {
    assignLastVotesToWcAndDb(participantNames[id], info.count);

    return {
      id,
      name: participantNames[id] || id.slice(-6),
      votes: info.count,
      voterCount: info.unique_voter_count,
    };
  });

  results.sort((a, b) => b.votes - a.votes);

  const totalVotes = results.reduce((sum, p) => sum + p.votes, 0);
  const topVotes = results[0]?.votes ?? 0;

  const top = results[0];
  const second = results[1];

  if (results.length >= 2) {
    const gap = top.votes - second.votes;
    const topName = top.name;
    const secondName = second.name;

    const styledWill = `<span class="text-sky-500 font-bold">WILL ASHLEY 🩵</span>`;
    const styledWillca = `<span class="text-sky-500 font-bold">WILLCA 🩵🩷</span>`;
    const styledBianca = `<span class="text-pink-400 font-bold">BIANCA DE VERA 🩷</span>`;
    const styledAndres = `<span class="text-red-700 font-bold">ANDRES MUHLACH</span>`;
    const styledAshtine = `<span class="text-red-700 font-bold">ASHTINE OLVIGA</span>`;

    let labelHTML = `votes needed for <strong>${secondName}</strong> to overtake <strong>${topName}</strong>`;
    let headerLabel = `${styledWillca} is leading against <strong>${secondName}</strong> with:`;
    let isLeading = false;

    if (topName.includes('WILLCA')) {
      labelHTML = `Keep voting and build a strong gap!!!`;
      isLeading = true;
      colors = ['#E95793', '#9AA6B2'];
    } else if (topName.includes('DUSTBIA')) {
      headerLabel = `We're losing! We need:`;
      labelHTML = `votes for <strong>WILLCA</strong> to overtake <strong>DUSTBIA</strong>`;
      isLeading = false;
      colors = ['#9AA6B2', '#E95793'];
    }

    buildRollingCounter(gap, isLeading, labelHTML, headerLabel);
  }

  saveSnapshot(results, updatedDate);

  // Clear previous table rows
  tableBody.innerHTML = '';

  // Render the rows
  results.forEach((participant, index) => {
    const percentage =
      totalVotes > 0
        ? Math.floor((participant.votes / totalVotes) * 10000) / 100
        : '0.00';

    const isTrailing = index !== 0 && !(index >= 2 && index <= 4); // Not 1st or in top 4
    const voteDiff = isTrailing
      ? `-${(topVotes - participant.votes).toLocaleString()}`
      : '-';
    const diffClass = isTrailing ? 'text-red-400 font-extrabold' : '';

    // Create the row
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="text-center px-4 py-2">${index + 1}</td>
      <td class="text-center px-4 py-2">${participant.name}</td>
      <td class="text-center px-4 py-2">${participant.votes.toLocaleString()}</td>
      <td class="text-center px-4 py-2">${percentage}%</td>
      <td class="text-center px-4 py-2 ${diffClass}">${voteDiff}</td>
    `;
    tableBody.appendChild(row);
  });
}

function assignLastVotesToWcAndDb(name, votes) {
  if (name === 'WILLCA') {
    lastVotesWillca = votes;
  } else if (name === 'DUSTBIA') {
    lastVotesDustbia = votes;
  }
}
function formatTime(ts) {
  // Fix invalid "24:" timestamps (which are not valid in JavaScript Date)
  if (ts.includes('24:')) {
    const [datePart, timePart] = ts.split(', ');
    const [month, day, year] = datePart.split('/').map(Number);

    // Bump the date by one day since 24:00 is effectively midnight of the next day
    const newDate = new Date(year, month - 1, day + 1);

    // Replace 24:xx with 00:xx so Date() won't break
    const fixedTime = timePart.replace('24:', '00:');

    // Reconstruct a full date string
    const fixedDateTime = `${month}/${newDate.getDate()}/${year}, ${fixedTime}`;

    // Parse and return in PH time
    return new Date(fixedDateTime).toLocaleTimeString('en-PH', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Manila',
    });
  }

  // Return regular timestamps in PH time
  return new Date(ts).toLocaleTimeString('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila',
  });
}

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  return mins === 0
    ? 'just now'
    : `${mins} min${mins > 1 ? 's' : ''} ago`;
}

function phTime(dateAndTime) {
  const now = new Date(dateAndTime) ?? new Date();
  return now.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function phTimeLabel() {
  // Create a new Date object and format it to 'en-PH' locale and Asia/Manila timezone
  return new Date().toLocaleString('en-PH', {
    timeZone: 'Asia/Manila', // Ensures it uses Philippine Standard Time (PST/PHT)
    hour: 'numeric',
    minute: '2-digit',
    hour12: true, // Shows AM/PM format
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Replaces localStorage version — tracks gap between top 2 candidates
function saveSnapshot(results, time) {
  snapshotHistory.unshift({
    results,
    time,
  });

  // Trim to last 5 entries
  if (snapshotHistory.length > 5) {
    snapshotHistory.pop();
  }

  updateSnapshotHistory();
}

function updateSnapshotHistory() {
  const headerRow = document.getElementById('vote-history-header');
  const body = document.getElementById('vote-history');

  if (!headerRow || !body) return;

  // Grab the latest 5 entries
  const headerEntries = Array.from(
    { length: 5 },
    (_, i) => snapshotHistory[i]
  );

  // === Generate Header ===
  const timeHeaders = headerEntries
    .map((entry) => {
      if (!entry || !entry.time) {
        return `<th class="px-6 py-4 bg-[#EC9B3B] text-center font-bold whitespace-nowrap text-[#EC9B3B]">—</th>`;
      }
      return `<th class="px-6 py-4 text-center bg-[#EC9B3B] font-bold whitespace-nowrap text-sunset-deep">${entry.time}</th>`;
    })
    .join('');

  headerRow.innerHTML = `<th class="px-6 py-4 text-left font-bold whitespace-nowrap text-sunset-deep bg-[#EC9B3B]">Candidate</th>${timeHeaders}`;

  const allCandidates =
    snapshotHistory[0]?.results.map((entry) => entry.name) || [];

  // === Pre-compute diffs for each column (time slot) ===
  const columnDiffs = headerEntries.map((entry, index) => {
    const nextEntry = snapshotHistory[index + 1];
    if (!entry || !nextEntry) return [];

    return entry.results.map((curr) => {
      const prev = nextEntry.results.find(
        (r) => r.name === curr.name
      );
      return prev ? curr.votes - prev.votes : null;
    });
  });

  // === Find max gain per column ===
  const maxDiffs = columnDiffs.map((col) =>
    col.length
      ? Math.max(...col.map((diff) => diff ?? -Infinity))
      : null
  );

  // === Render rows ===
  body.innerHTML = allCandidates
    .map((candidateName, rowIndex) => {
      const row = headerEntries
        .map((entry, colIndex) => {
          const current = entry?.results.find(
            (r) => r.name === candidateName
          );
          const nextEntry = snapshotHistory[colIndex + 1];
          const previous = nextEntry?.results.find(
            (r) => r.name === candidateName
          );

          if (!current || !previous) {
            const isBaseline = headerEntries[colIndex]?.time;
            return isBaseline
              ? '<td class="px-6 py-4 text-center text-sunset-sky italic tracking-wide">BASE</td>'
              : `<td class="px-6 py-4 text-center text-sunset-sky">—</td>`;
          }

          const diff = current.votes - previous.votes;
          const formatted = `${diff >= 0 ? '+' : ''}${formatNumber(diff)}`;

          const isMax = diff === maxDiffs[colIndex];
          const cellClass = isMax
            ? 'px-6 py-4 text-center text-green-600 font-bold'
            : 'px-6 py-4 text-center text-sunset-text';

          return `<td class="${cellClass}">${formatted}</td>`;
        })
        .join('');

      const isWillca = candidateName.includes('WILLCA');
      const displayName = isWillca
        ? `${candidateName} 🩵🩷`
        : candidateName;

      return `<tr><td class="px-6 py-4 font-medium text-sunset-deep">${displayName}</td>${row}</tr>`;
    })
    .join('');
}

// ✅ Function that returns current PH time in readable format
function getPhilippinesTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila',
  });
}

function buildRollingCounter(
  number,
  isLeading,
  message,
  headerLabel
) {
  const section = document.getElementById('voteSection');
  const phTimeElement = document.getElementById('phTime');
  phTimeElement.textContent = `as of ${getPhilippinesTime()}`;

  // Remove old counter wrapper if exists
  const existing = document.getElementById('myVotesWrapper');
  if (existing) existing.remove();

  const wrapper = document.createElement('div');
  wrapper.id = 'myVotesWrapper';
  wrapper.className = `
      flex flex-col items-center justify-center gap-1 p-4 rounded-xl border-4
      ${
        isLeading
          ? 'animate-fade-baby-gradient animate-border-pulse'
          : 'border-red-400 bg-red-200/20'
      }
    `;

  const voteContainer = document.createElement('div');
  voteContainer.className =
    'flex flex-col items-center justify-center gap-1';

  const labelHeader = document.createElement('p');
  labelHeader.className = 'text-s text-gray-800 text-center';
  labelHeader.innerHTML = headerLabel;

  const counter = document.createElement('div');
  counter.className = `
      flex gap-[2px] font-extrabold font-mono overflow-hidden h-[48px]
      ${isLeading ? 'text-sky-400' : 'text-red-400'}
    `;

  const label = document.createElement('p');
  label.className = 'text-s text-gray-700 text-center';
  label.innerHTML = message;

  voteContainer.appendChild(labelHeader);
  voteContainer.appendChild(counter);
  voteContainer.appendChild(label);
  wrapper.appendChild(voteContainer);
  section.appendChild(wrapper);

  // Format number into digits + commas
  const digits = number.toLocaleString().split('');

  // 🛠 If digit structure changes, reset
  const structureChanged = digits.length !== previousDigits.length;
  if (structureChanged) {
    counter.innerHTML = '';
    previousDigits = []; // Reset to avoid mismatch in future
  }

  digits.forEach((char, index) => {
    const isComma = char === ',';
    let digitCol = counter.children[index];
    let scroll;

    if (!digitCol) {
      digitCol = document.createElement('div');
      digitCol.className =
        'relative h-[48px] w-[24px] overflow-hidden';

      if (isComma) {
        const comma = document.createElement('div');
        comma.textContent = ',';
        comma.className = `text-4xl font-mono font-extrabold ${
          isLeading ? 'text-sky-400' : 'text-red-400'
        }`;
        digitCol.appendChild(comma);
      } else {
        scroll = document.createElement('div');
        scroll.className =
          'absolute top-0 left-0 transition-all duration-700 ease-out';

        for (let i = 0; i <= 9; i++) {
          const digit = document.createElement('div');
          digit.textContent = i;
          digit.className = `h-[48px] flex items-center justify-center text-4xl font-mono font-extrabold ${
            isLeading ? 'text-sky-400' : 'text-red-400'
          }`;
          scroll.appendChild(digit);
        }

        digitCol.appendChild(scroll);
      }

      counter.appendChild(digitCol);
    } else {
      if (!isComma) {
        scroll = digitCol.firstChild;
      }
    }

    // 🎯 Always apply transform, even if char matches
    if (!isComma && scroll) {
      requestAnimationFrame(() => {
        scroll.style.transform = `translateY(-${parseInt(char) * 48}px)`;
      });
    }
  });

  previousDigits = digits;
}

function formatNumber(num) {
  return num.toLocaleString('en-US');
}

function renderChartAndGapTable(rawData) {
  voteGaps = rawData.voteGap.slice(-60); // from newest to oldest
  times = rawData.updateTimesPH.slice(-60).map((t) => formatTime(t));

  // Sanitize and extract only the last 8 entries from the raw API response
  const data = {
    // Keep only the last 8 times (e.g., ["11:06 PM", ..., "12:26 AM"])
    times: rawData.times.slice(-8),

    // Loop through each participant and get only their last 8 vote increments
    voteIncrements: Object.fromEntries(
      Object.entries(rawData.voteIncrements).map(
        ([name, increments]) => [
          name,
          increments.slice(-8), // Only keep the last 8 values
        ]
      )
    ),

    // Baseline votes are kept as-is since they're constant
    baselineVotes: rawData.baselineVotes,

    // Only keep the last 8 update times
    updateTimesPH: rawData.updateTimesPH.slice(-8),

    // Only keep the last 8 voteGap entries
    voteGap: rawData.voteGap.slice(-8),
  };

  const timeLabels = data.updateTimesPH.map((t) => formatTime(t));

  const lastVotes = Object.entries(data.voteIncrements)
    .map(([name, votes]) => [name, votes.at(-1)])
    .filter(([_, v]) => v !== null);

  const topTwo = lastVotes
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([name]) => name);

  const series = topTwo.map((name) => {
    const increments = data.voteIncrements[name];

    const dataPoints = increments
      .map((val, idx, arr) => {
        if (val === null || idx === 0 || arr[idx - 1] === null)
          return null;
        const diff = val - arr[idx - 1];
        return {
          x: timeLabels[idx],
          y: val,
          delta: `${val >= 0 ? '+' : ''}${val.toLocaleString()}`,
        };
      })
      .filter(Boolean);

    return {
      name: name,
      data: dataPoints,
    };
  });

  const seriesColors = series.map((s) => colorMap[s.name]);

  // Combine all vote values from both series into one array
  const allVotes = series.flatMap((s) =>
    s.data.map((point) => point.y)
  );

  // Get min and max
  const minVote = Math.min(...allVotes);
  const maxVote = Math.max(...allVotes);
  // Round down to the nearest 10,000 for min, and up for max
  const safeMin = Math.floor((minVote - 10000) / 10000) * 10000;
  const safeMax = Math.ceil((maxVote + 10000) / 10000) * 10000;
  const range = safeMax - safeMin;

  let step;
  if (range > 100000) {
    step = 50000;
  } else if (range > 50000) {
    step = 25000;
  } else if (range > 10000) {
    step = 10000;
  } else {
    step = 5000;
  }

  // Calculate how many ticks we want
  const tickAmount = Math.ceil(range / step);

  const options = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const data = opts.w.config.series[opts.seriesIndex].data;
        const idx = opts.dataPointIndex;
        if (idx >= 1) {
          return `${data[idx].delta.toLocaleString()}`;
        }
      },
      offsetY: -8, // ↑ Higher above dot to prevent blocking
      style: {
        fontSize: '13px',
        fontWeight: 'bold',
      },
      background: {
        enabled: true,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      type: 'category',
      labels: {
        rotate: -45,
        style: {
          fontSize: '11px',
        },
      },
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
      },
    },
    yaxis: {
      min: safeMin,
      max: safeMax,
      tickAmount: 6, // controls how many ticks
      labels: {
        formatter: (val) => val.toLocaleString(), // Add comma separator
      },
      style: {
        fontSize: '11px',
      },
    },
    markers: {
      size: 4, // Smaller size
      hover: {
        size: 7, // Enlarge on hover
      },
    },
    legend: {
      position: 'bottom',
      fontWeight: 600,
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
    },
    grid: {
      padding: {
        top: 20,
        bottom: 10,
      },
    },
  };

  if (window.voteChartInstance) {
    window.voteChartInstance.destroy(); // Destroy previous chart instance properly
  }

  const chart = new ApexCharts(document.querySelector('#voteChart'), {
    ...options,
    colors: seriesColors,
    series,
  });

  window.voteChartInstance = chart; // 🧠 Save for next time
  chart.render();

  buildGapTable();
}

function updatePHTime() {
  document.getElementById('phTime').textContent =
    `as of ${phTimeLabel()}`;
}

function buildGapTable() {
  const gapRow = document.getElementById('gapRow');
  const gapTimeHeaders = document.getElementById('gapTimeHeaders');
  let gapDeltaRow = document.getElementById('gapDeltaRow');

  gapTimeHeaders.innerHTML = '';
  gapRow.innerHTML = '';
  gapDeltaRow.innerHTML = '';

  function getGapColor(
    isWillcaLeading,
    isDeltaFavorableToWillca,
    absDelta
  ) {
    const isGood = isDeltaFavorableToWillca;
    const isBad = !isDeltaFavorableToWillca;

    if (isBad) {
      if (absDelta >= 50000)
        return 'bg-red-900 text-white font-extrabold'; // 💀 Disaster Mode
      if (absDelta >= 35000)
        return 'bg-red-800 text-white font-extrabold'; // 🔴 Huge Crash
      if (absDelta >= 25000) return 'bg-red-700 text-white font-bold'; // 🔴 Major Slip
      if (absDelta >= 18000) return 'bg-red-600 text-white font-bold'; // 🔴 Heavy Loss
      if (absDelta >= 12000)
        return 'bg-red-500 text-white font-medium'; // 🔴 Significant Drop
      if (absDelta >= 8000)
        return 'bg-red-400/80 text-black font-medium'; // 🔴 Noticeable Fall
      if (absDelta >= 4000) return 'bg-red-300/80 text-black'; // 🔴 Mild Slide
      if (absDelta >= 3000) return 'bg-red-200'; // 🔴 Slight
      return 'bg-rose-200'; // 🫥 Tiny Drop
    }

    if (isGood) {
      if (absDelta >= 40000)
        return 'bg-gradient-glow text-white font-extrabold animate-glow text-glow'; // 🔥 Unstoppable Surge
      if (absDelta >= 35000)
        return 'bg-green-800 text-white font-extrabold'; // 🟢 Explosive
      if (absDelta >= 25000)
        return 'bg-green-700 text-white font-bold'; // 🟢 Massive Lead Gain
      if (absDelta >= 18000)
        return 'bg-green-600 text-white font-bold'; // 🟢 Strong Surge
      if (absDelta >= 12000)
        return 'bg-green-500 font-medium text-black'; // 🟢 Solid Climb
      if (absDelta >= 8000)
        return 'bg-green-400 font-medium text-black'; // 🟢 Noticeable Push
      if (absDelta >= 4000) return 'bg-green-300 text-black'; // 🟢 Gentle Rise
      if (absDelta >= 3000) return 'bg-green-200'; // 🟢 Barely noticeable
      return 'bg-green-100'; // ✅ Whisper of Good News
    }

    return 'bg-gray-100'; // Neutral fallback
  }

  // Build the table (from latest to oldest)
  for (let i = voteGaps.length - 1; i > 0; i--) {
    const wasWillcaLeading = voteGaps[i - 1] > 0;
    const isWillcaLeading = voteGaps[i] > 0;
    const leaderChanged = wasWillcaLeading !== isWillcaLeading;

    const currentGap = Math.abs(voteGaps[i]);
    const previousGap = Math.abs(voteGaps[i - 1]);
    const delta = currentGap - previousGap;
    const formattedTime = times[i];
    const absDelta = Math.abs(delta);

    let isDeltaFavorableToWillca;

    if (leaderChanged) {
      // Lead change overrides normal rules
      isDeltaFavorableToWillca = isWillcaLeading;
    } else {
      // Normal gap change rules
      if (isWillcaLeading) {
        isDeltaFavorableToWillca = delta > 0;
      } else {
        isDeltaFavorableToWillca = delta < 0;
      }
    }

    // 🎨 Color handling — rainbow for lead gain, blackout red for lead loss
    const colorForCell = leaderChanged
      ? isWillcaLeading
        ? 'bg-gradient-glow text-white font-extrabold animate-glow text-glow'
        : 'bg-black text-red-500 font-extrabold'
      : getGapColor(
          isWillcaLeading,
          isDeltaFavorableToWillca,
          absDelta
        );

    // 💰 Jackpot if big move or lead change
    const jackpot =
      leaderChanged ||
      (isDeltaFavorableToWillca && absDelta >= 40000);

    // 🕒 Header cell
    const th = document.createElement('th');
    th.className =
      'px-4 py-2 text-[10px] sm:text-xs text-gray-200 font-semibold whitespace-nowrap';
    th.innerHTML = formattedTime;
    gapTimeHeaders.appendChild(th);

    // 📊 Unified Gap + Delta Cell
    const tdGapDelta = document.createElement('td');
    tdGapDelta.className = `px-4 py-3 font-sans rounded-lg text-center ${colorForCell}`;

    // Create inner wrapper for vertical layout
    const gapDeltaWrapper = document.createElement('div');
    gapDeltaWrapper.className =
      'flex flex-col items-center justify-center leading-tight h-12 w-16 text-center whitespace-nowrap';

    const gapValue = document.createElement('div');
    gapValue.className = `text-xs sm:text-sm font-bold ${
      jackpot ? 'text-glow' : ''
    }`;
    gapValue.textContent =
      Math.abs(currentGap).toLocaleString('en-US');

    // ➖ Delta value (smaller text below)
    const deltaValue = document.createElement('div');
    deltaValue.className = `text-[11px] sm:text-xs opacity-80 ${
      jackpot ? 'text-glow' : ''
    }`;

    if (leaderChanged) {
      deltaValue.textContent = isWillcaLeading
        ? `Gained lead!`
        : `Lost lead`;
    } else {
      const deltaSign = delta > 0 ? '+' : delta < 0 ? '−' : '';
      deltaValue.textContent = `${deltaSign}${Math.abs(
        delta
      ).toLocaleString('en-US')}`;
    }

    // Assemble nested structure
    gapDeltaWrapper.appendChild(gapValue);
    gapDeltaWrapper.appendChild(deltaValue);
    tdGapDelta.appendChild(gapDeltaWrapper);

    // Append to the row
    gapRow.appendChild(tdGapDelta);
  }
}
