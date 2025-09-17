document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------
  // Levels & constants - FIXED PATHS
  // ---------------------------
  const LEVELS = [
    { id: 1, size: 3, timeLimit: 60, image: "images/image1.jpg" },  // Matches your actual files
    { id: 2, size: 4, timeLimit: 120, image: "images/image2.jpg" }, // Matches your actual files
    { id: 3, size: 5, timeLimit: 180, image: "images/image3.jpg" }  // Matches your actual files
  ];

  const MAX_PER_LEVEL = 1000;
  const MOVE_PENALTY = 2;

  // ---------------------------
  // Screens
  // ---------------------------
  const welcomeScreen     = document.getElementById('welcome-screen');
  const puzzleScreen      = document.getElementById('puzzle-screen');
  const resultsScreen     = document.getElementById('results-screen');
  const leaderboardScreen = document.getElementById('leaderboard-screen');

  // Buttons
  const startBtn        = document.getElementById('start-btn');
  const leaderboardBtn  = document.getElementById('leaderboard-btn');
  const backToQuizBtn   = document.getElementById('back-to-quiz-btn');

  // Puzzle UI
  const puzzleTitle   = document.getElementById('puzzle-title');
  const puzzleLevelEl = document.getElementById('puzzle-level');
  const puzzleTimeEl  = document.getElementById('puzzle-time');
  const puzzleMovesEl = document.getElementById('puzzle-moves');
  const puzzleBoardEl = document.getElementById('puzzle-board');
  const originalImgEl = document.getElementById('original-image');

  // Results UI
  const finalScoreElement   = document.getElementById('final-score');
  const performanceComment  = document.getElementById('performance-comment');
  const usernameInput       = document.getElementById('username');

  const API_BASE_URL = window.location.hostname.includes("localhost")
    ? "http://localhost:4000/api"
    : "/api";

  // ---------------------------
  // Game state
  // ---------------------------
  let currentLevelIndex = 0;
  let totalScore = 0;
  let levelMoves = 0;
  let levelTimer = null;
  let levelTimeLeft = 0;
  let grid = [];
  let size = 3;
  let firstSelected = null;
  let username = '';

  // ---------------------------
  // Event listeners
  // ---------------------------
  startBtn.addEventListener('click', startGame);
  leaderboardBtn.addEventListener('click', showLeaderboard);
  backToQuizBtn.addEventListener('click', resetToWelcome);

  // ---------------------------
  // Functions
  // ---------------------------
  // function startGame() {
  //   username = usernameInput.value.trim() || 'Anonymous Player';
  //   totalScore = 0;
  //   currentLevelIndex = 0;
  //   welcomeScreen.classList.add('hidden');
  //   resultsScreen.classList.add('hidden');
  //   leaderboardScreen.classList.add('hidden');
  //   puzzleScreen.classList.remove('hidden');
  //   startLevel(0);
  // }
  async function startGame() {
  username = usernameInput.value.trim();
  if (!username) {
    alert("Please enter your name");
    return;
  }

  try {
    // Try to login/register automatically
    const res = await fetch(`${API_BASE_URL}/auth/login-or-register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    });

    const data = await res.json();
    if (res.ok) {
      authToken = data.token; // ✅ store JWT
    } else {
      alert(data.message || "Login/Register failed");
      return;
    }
  } catch (err) {
    console.error("Auth failed:", err);
    return;
  }

  totalScore = 0;
  currentLevelIndex = 0;
  welcomeScreen.classList.add('hidden');
  resultsScreen.classList.add('hidden');
  leaderboardScreen.classList.add('hidden');
  puzzleScreen.classList.remove('hidden');
  startLevel(0);
}


  function startLevel(index) {
    stopLevelTimer();
    firstSelected = null;
    levelMoves = 0;
    currentLevelIndex = index;
    const lvl = LEVELS[index];
    size = lvl.size;
    levelTimeLeft = lvl.timeLimit;

    puzzleLevelEl.textContent = lvl.id;
    puzzleTimeEl.textContent  = levelTimeLeft;
    puzzleMovesEl.textContent = levelMoves;
    puzzleTitle.textContent   = `Level ${lvl.id} — ${size}×${size}`;

    originalImgEl.src = lvl.image;
    originalImgEl.onerror = () => {
      console.error("Image not found:", lvl.image);
      // Fallback to a working placeholder
      originalImgEl.src = "https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=Puzzle+" + lvl.id;
    };

    buildBoard(size);
    shuffleBoard();
    renderBoard();
    startLevelTimer();
  }

  function buildBoard(n) {
    grid = [];
    for (let i = 1; i <= n * n; i++) grid.push(i);
  }

  function shuffleBoard() {
    do {
      for (let i = grid.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [grid[i], grid[j]] = [grid[j], grid[i]];
      }
    } while (isSolved());
    levelMoves = 0;
  }

  function renderBoard() {
    puzzleBoardEl.innerHTML = '';
    puzzleBoardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    puzzleBoardEl.style.gridTemplateRows    = `repeat(${size}, 1fr)`;

    grid.forEach((value, i) => {
      const tile = document.createElement('div');
      tile.classList.add('puzzle-tile');
      tile.dataset.index = i;
      tile.dataset.value = value;

      const r = Math.floor((value - 1) / size);
      const c = (value - 1) % size;
      const x = size === 1 ? 0 : (c / (size - 1)) * 100;
      const y = size === 1 ? 0 : (r / (size - 1)) * 100;

      const imageUrl = LEVELS[currentLevelIndex].image;
      tile.style.backgroundImage = `url(${imageUrl})`;
      tile.style.backgroundSize = `${size * 100}% ${size * 100}%`;
      tile.style.backgroundPosition = `${x}% ${y}%`;
      
      // Fallback for missing images
      tile.onerror = () => {
        tile.style.backgroundImage = `url(https://via.placeholder.com/100x100/4A90E2/FFFFFF?text=${value})`;
      };
      
      tile.addEventListener('click', () => onTileClick(i));
      puzzleBoardEl.appendChild(tile);
    });
    puzzleMovesEl.textContent = levelMoves;
  }

  function onTileClick(idx) {
    if (firstSelected === null) {
      firstSelected = idx;
      puzzleBoardEl.children[idx].classList.add('selected');
    } else if (firstSelected === idx) {
      puzzleBoardEl.children[idx].classList.remove('selected');
      firstSelected = null;
    } else {
      [grid[firstSelected], grid[idx]] = [grid[idx], grid[firstSelected]];
      puzzleBoardEl.children[firstSelected].classList.remove('selected');
      firstSelected = null;
      levelMoves++;
      renderBoard();
      if (isSolved()) onLevelCleared();
    }
  }

  function isSolved() {
    return grid.every((v, i) => v === i + 1);
  }

  function startLevelTimer() {
    stopLevelTimer();
    levelTimer = setInterval(() => {
      levelTimeLeft--;
      puzzleTimeEl.textContent = levelTimeLeft;
      if (levelTimeLeft <= 0) {
        stopLevelTimer();
        onLevelFailed();
      }
    }, 1000);
  }

  function stopLevelTimer() {
    if (levelTimer) clearInterval(levelTimer);
    levelTimer = null;
  }

  function onLevelCleared() {
    stopLevelTimer();
    let levelScore = MAX_PER_LEVEL - levelMoves * MOVE_PENALTY;
    if (levelScore < 0) levelScore = 0;
    totalScore += levelScore;
    if (currentLevelIndex + 1 < LEVELS.length) {
      currentLevelIndex++;
      startLevel(currentLevelIndex);
    } else {
      finishGame();
    }
  }

  function onLevelFailed() {
    stopLevelTimer();
    let correctTiles = grid.filter((v, i) => v === i + 1).length;
    let levelScore = Math.round((correctTiles / (size * size)) * MAX_PER_LEVEL) - levelMoves * MOVE_PENALTY;
    if (levelScore < 0) levelScore = 0;
    totalScore += levelScore;
    finishGame();
  }

  async function finishGame() {
    puzzleScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    finalScoreElement.textContent = totalScore;
    const pct = (totalScore / (MAX_PER_LEVEL * LEVELS.length)) * 100;
    performanceComment.textContent =
      pct >= 90 ? "Legendary!" :
      pct >= 70 ? "Great job!" :
      pct >= 50 ? "Nice effort!" : "Keep practicing!";

    try {
      await fetch(`${API_BASE_URL}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ name: username, score: totalScore })
      });
    } catch (err) {
      console.error("Save failed", err);
    }

    setTimeout(showLeaderboard, 2000);
  }

  function resetToWelcome() {
    welcomeScreen.classList.remove('hidden');
    puzzleScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    leaderboardScreen.classList.add('hidden');
  }

  async function showLeaderboard() {
    resultsScreen.classList.add('hidden');
    welcomeScreen.classList.add('hidden');
    puzzleScreen.classList.add('hidden');
    leaderboardScreen.classList.remove('hidden');
    try {
      const res = await fetch(`${API_BASE_URL}/leaderboard`);
      const data = await res.json();
      const list = document.getElementById('leaderboard-list');
      list.innerHTML = '';
      data.forEach((entry, i) => {
        const div = document.createElement('div');
        div.className = "flex justify-between bg-gray-800 p-2 rounded";
        div.textContent = `${i + 1}. ${entry.name} - ${entry.score}`;
        list.appendChild(div);
      });
    } catch (error) {
      console.error('Leaderboard fetch failed:', error);
      const list = document.getElementById('leaderboard-list');
      list.innerHTML = '<div class="text-red-400 text-center">Failed to load leaderboard</div>';
    }
  }

  // ---------------------------
  // Init
  // ---------------------------
  resetToWelcome();
});