// Leaderboard Functionality

// Initialize leaderboard when the page loads
document.addEventListener("DOMContentLoaded", function () {
  displayLeaderboard();

  // Add event listener for clearing leaderboard
  document
    .getElementById("clear-leaderboard")
    .addEventListener("click", clearLeaderboard);
});

// Display leaderboard data
function displayLeaderboard() {
  const leaderboardTable = document.getElementById("leaderboard-table");

  // Get leaderboard data from local storage
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");

  // Clear existing table content
  leaderboardTable.innerHTML = "";

  // Check if there's any data to display
  if (leaderboard.length === 0) {
    const noDataRow = document.createElement("tr");
    const noDataCell = document.createElement("td");
    noDataCell.colSpan = 4;
    noDataCell.className = "text-center";
    noDataCell.textContent =
      "No scores available yet. Be the first to complete the quiz!";
    noDataRow.appendChild(noDataCell);
    leaderboardTable.appendChild(noDataRow);
    return;
  }

  // Add each score to the table
  leaderboard.forEach((entry, index) => {
    const row = document.createElement("tr");

    // Rank
    const rankCell = document.createElement("td");
    rankCell.textContent = index + 1;

    // Username
    const usernameCell = document.createElement("td");
    usernameCell.textContent = entry.username;

    // Score
    const scoreCell = document.createElement("td");
    scoreCell.textContent = entry.score;

    // Date
    const dateCell = document.createElement("td");
    dateCell.textContent = entry.date;

    // Add cells to row
    row.appendChild(rankCell);
    row.appendChild(usernameCell);
    row.appendChild(scoreCell);
    row.appendChild(dateCell);

    // Add row to table
    leaderboardTable.appendChild(row);
  });
}

// Clear leaderboard data
function clearLeaderboard() {
  if (
    confirm(
      "Are you sure you want to clear the leaderboard? This action cannot be undone."
    )
  ) {
    localStorage.removeItem("leaderboard");
    displayLeaderboard();
    alert("Leaderboard has been cleared.");
  }
}
