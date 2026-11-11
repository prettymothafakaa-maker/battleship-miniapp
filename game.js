// Telegram WebApp initialization
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.ready();
}

// Game state
const BOARD_SIZE = 10;
const SHIPS = [
    { size: 4, count: 1, name: 'Линкор' },
    { size: 3, count: 2, name: 'Крейсер' },
    { size: 2, count: 3, name: 'Эсминец' },
    { size: 1, count: 4, name: 'Катер' }
];

let gameState = {
    phase: 'setup', // setup, playing, gameover
    playerBoard: createEmptyBoard(),
    enemyBoard: createEmptyBoard(),
    playerShips: [],
    enemyShips: [],
    selectedShip: null,
    isHorizontal: true,
    playerTurn: true,
    hits: 0,
    misses: 0,
    shipsToPlace: [...SHIPS]
};

// DOM elements
const playerBoardEl = document.getElementById('playerBoard');
const enemyBoardEl = document.getElementById('enemyBoard');
const enemyBoardWrapper = document.getElementById('enemyBoardWrapper');
const shipSelector = document.getElementById('shipSelector');
const startBtn = document.getElementById('startBtn');
const randomBtn = document.getElementById('randomBtn');
const resetBtn = document.getElementById('resetBtn');
const rotateBtn = document.getElementById('rotateBtn');
const phaseIndicator = document.getElementById('phaseIndicator');
const phaseHint = document.getElementById('phaseHint');
const hitsEl = document.getElementById('hits');
const missesEl = document.getElementById('misses');
const gameOverModal = document.getElementById('gameOverModal');
const newGameBtn = document.getElementById('newGameBtn');

// Initialize game
init();

function init() {
    renderBoard(playerBoardEl, gameState.playerBoard, true);
    renderBoard(enemyBoardEl, gameState.enemyBoard, false);
    setupEventListeners();
    renderShipSelector();
}

function createEmptyBoard() {
    return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
}

function renderBoard(boardEl, board, isPlayer) {
    boardEl.innerHTML = '';
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            const cellValue = board[row][col];
            if (cellValue === 1 && isPlayer) {
                cell.classList.add('ship');
            } else if (cellValue === 2) {
                cell.classList.add('hit');
            } else if (cellValue === 3) {
                cell.classList.add('miss');
            }
            
            boardEl.appendChild(cell);
        }
    }
}

function renderShipSelector() {
    const shipItems = document.querySelectorAll('.ship-item');
    shipItems.forEach(item => {
        const size = parseInt(item.dataset.size);
        const shipType = gameState.shipsToPlace.find(s => s.size === size);
        
        if (shipType && shipType.count > 0) {
            item.classList.remove('placed');
        } else {
            item.classList.add('placed');
        }
        
        if (gameState.selectedShip && gameState.selectedShip.size === size) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    // Check if all ships are placed
    const allPlaced = gameState.shipsToPlace.every(s => s.count === 0);
    startBtn.disabled = !allPlaced;
}

function setupEventListeners() {
    // Ship selection
    document.querySelectorAll('.ship-item').forEach(item => {
        item.addEventListener('click', () => {
            const size = parseInt(item.dataset.size);
            const shipType = gameState.shipsToPlace.find(s => s.size === size);
            if (shipType && shipType.count > 0) {
                gameState.selectedShip = { ...shipType };
                renderShipSelector();
            }
        });
    });
    
    // Rotate button
    rotateBtn.addEventListener('click', () => {
        gameState.isHorizontal = !gameState.isHorizontal;
    });
    
    // Random placement
    randomBtn.addEventListener('click', () => {
        resetPlayerBoard();
        placeShipsRandomly(gameState.playerBoard, gameState.playerShips);
        gameState.shipsToPlace = SHIPS.map(s => ({ ...s, count: 0 }));
        renderBoard(playerBoardEl, gameState.playerBoard, true);
        renderShipSelector();
    });
    
    // Start game
    startBtn.addEventListener('click', startGame);
    
    // Reset game
    resetBtn.addEventListener('click', resetGame);
    newGameBtn.addEventListener('click', resetGame);
    
    // Player board cell hover and click (setup phase)
    playerBoardEl.addEventListener('mouseover', handlePlayerCellHover);
    playerBoardEl.addEventListener('mouseout', clearPreview);
    playerBoardEl.addEventListener('click', handlePlayerCellClick);
    
    // Enemy board cell click (playing phase)
    enemyBoardEl.addEventListener('click', handleEnemyCellClick);
}

function handlePlayerCellHover(e) {
    if (gameState.phase !== 'setup' || !gameState.selectedShip) return;
    
    const cell = e.target.closest('.cell');
    if (!cell) return;
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    clearPreview();
    showShipPreview(row, col, gameState.selectedShip.size, gameState.isHorizontal);
}

function clearPreview() {
    document.querySelectorAll('.preview, .invalid-preview').forEach(cell => {
        cell.classList.remove('preview', 'invalid-preview');
    });
}

function showShipPreview(row, col, size, isHorizontal) {
    const isValid = canPlaceShip(gameState.playerBoard, row, col, size, isHorizontal);
    const className = isValid ? 'preview' : 'invalid-preview';
    
    for (let i = 0; i < size; i++) {
        const r = isHorizontal ? row : row + i;
        const c = isHorizontal ? col + i : col;
        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
            const cell = playerBoardEl.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            if (cell) cell.classList.add(className);
        }
    }
}

function handlePlayerCellClick(e) {
    if (gameState.phase !== 'setup' || !gameState.selectedShip) return;
    
    const cell = e.target.closest('.cell');
    if (!cell) return;
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    if (canPlaceShip(gameState.playerBoard, row, col, gameState.selectedShip.size, gameState.isHorizontal)) {
        placeShip(gameState.playerBoard, gameState.playerShips, row, col, gameState.selectedShip.size, gameState.isHorizontal);
        
        const shipType = gameState.shipsToPlace.find(s => s.size === gameState.selectedShip.size);
        if (shipType) {
            shipType.count--;
        }
        
        gameState.selectedShip = null;
        renderBoard(playerBoardEl, gameState.playerBoard, true);
        renderShipSelector();
    }
}

function canPlaceShip(board, row, col, size, isHorizontal) {
    // Check if ship fits on board
    if (isHorizontal && col + size > BOARD_SIZE) return false;
    if (!isHorizontal && row + size > BOARD_SIZE) return false;
    
    // Check if cells are free and no adjacent ships
    for (let i = -1; i <= size; i++) {
        for (let j = -1; j <= 1; j++) {
            const r = isHorizontal ? row + j : row + i;
            const c = isHorizontal ? col + i : col + j;
            
            if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
                if (board[r][c] === 1) return false;
            }
        }
    }
    
    return true;
}

function placeShip(board, ships, row, col, size, isHorizontal) {
    const shipCells = [];
    for (let i = 0; i < size; i++) {
        const r = isHorizontal ? row : row + i;
        const c = isHorizontal ? col + i : col;
        board[r][c] = 1;
        shipCells.push({ row: r, col: c, hit: false });
    }
    ships.push({ cells: shipCells, sunk: false });
}

function placeShipsRandomly(board, ships) {
    for (const shipType of SHIPS) {
        for (let i = 0; i < shipType.count; i++) {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 100) {
                const row = Math.floor(Math.random() * BOARD_SIZE);
                const col = Math.floor(Math.random() * BOARD_SIZE);
                const isHorizontal = Math.random() < 0.5;
                
                if (canPlaceShip(board, row, col, shipType.size, isHorizontal)) {
                    placeShip(board, ships, row, col, shipType.size, isHorizontal);
                    placed = true;
                }
                attempts++;
            }
        }
    }
}

function resetPlayerBoard() {
    gameState.playerBoard = createEmptyBoard();
    gameState.playerShips = [];
    gameState.shipsToPlace = SHIPS.map(s => ({ ...s }));
}

function startGame() {
    gameState.phase = 'playing';
    
    // Setup enemy board
    placeShipsRandomly(gameState.enemyBoard, gameState.enemyShips);
    
    // Update UI
    shipSelector.style.display = 'none';
    enemyBoardWrapper.style.display = 'block';
    startBtn.style.display = 'none';
    randomBtn.style.display = 'none';
    resetBtn.style.display = 'block';
    
    phaseIndicator.querySelector('.phase-badge').textContent = 'Игра началась';
    phaseHint.textContent = 'Ваш ход — выберите клетку на поле противника';
    
    renderBoard(enemyBoardEl, gameState.enemyBoard, false);
}

function handleEnemyCellClick(e) {
    if (gameState.phase !== 'playing' || !gameState.playerTurn) return;
    
    const cell = e.target.closest('.cell');
    if (!cell) return;
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    if (gameState.enemyBoard[row][col] === 2 || gameState.enemyBoard[row][col] === 3) {
        return; // Already shot here
    }
    
    processPlayerShot(row, col);
}

function processPlayerShot(row, col) {
    const isHit = gameState.enemyBoard[row][col] === 1;
    
    if (isHit) {
        gameState.enemyBoard[row][col] = 2;
        gameState.hits++;
        hitsEl.textContent = gameState.hits;
        
        // Check if ship is sunk
        updateShipStatus(gameState.enemyShips, row, col);
        
        // Check win condition
        if (checkAllShipsSunk(gameState.enemyShips)) {
            endGame(true);
            return;
        }
        
        phaseHint.textContent = 'Попадание! Стреляйте ещё раз';
    } else {
        gameState.enemyBoard[row][col] = 3;
        gameState.misses++;
        missesEl.textContent = gameState.misses;
        
        gameState.playerTurn = false;
        phaseHint.textContent = 'Промах. Ход противника...';
        
        setTimeout(enemyTurn, 1000);
    }
    
    renderBoard(enemyBoardEl, gameState.enemyBoard, false);
}

function enemyTurn() {
    let row, col;
    let attempts = 0;
    
    do {
        row = Math.floor(Math.random() * BOARD_SIZE);
        col = Math.floor(Math.random() * BOARD_SIZE);
        attempts++;
    } while ((gameState.playerBoard[row][col] === 2 || gameState.playerBoard[row][col] === 3) && attempts < 100);
    
    const isHit = gameState.playerBoard[row][col] === 1;
    
    if (isHit) {
        gameState.playerBoard[row][col] = 2;
        updateShipStatus(gameState.playerShips, row, col);
        
        if (checkAllShipsSunk(gameState.playerShips)) {
            endGame(false);
            return;
        }
        
        phaseHint.textContent = 'Противник попал! Он стреляет ещё раз...';
        setTimeout(enemyTurn, 1000);
    } else {
        gameState.playerBoard[row][col] = 3;
        gameState.playerTurn = true;
        phaseHint.textContent = 'Противник промахнулся. Ваш ход!';
    }
    
    renderBoard(playerBoardEl, gameState.playerBoard, true);
}

function updateShipStatus(ships, row, col) {
    for (const ship of ships) {
        for (const cell of ship.cells) {
            if (cell.row === row && cell.col === col) {
                cell.hit = true;
                
                // Check if all cells are hit
                if (ship.cells.every(c => c.hit)) {
                    ship.sunk = true;
                }
                return;
            }
        }
    }
}

function checkAllShipsSunk(ships) {
    return ships.every(ship => ship.sunk);
}

function endGame(playerWon) {
    gameState.phase = 'gameover';
    
    const modal = gameOverModal;
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const modalStats = document.getElementById('modalStats');
    
    if (playerWon) {
        modalIcon.textContent = '🎉';
        modalTitle.textContent = 'Победа!';
        modalText.textContent = 'Вы потопили все корабли противника';
    } else {
        modalIcon.textContent = '💥';
        modalTitle.textContent = 'Поражение';
        modalText.textContent = 'Противник потопил все ваши корабли';
    }
    
    modalStats.innerHTML = `
        <div class="modal-stat">
            <div class="modal-stat-label">Попадания</div>
            <div class="modal-stat-value">${gameState.hits}</div>
        </div>
        <div class="modal-stat">
            <div class="modal-stat-label">Промахи</div>
            <div class="modal-stat-value">${gameState.misses}</div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Send result to Telegram
    if (tg) {
        tg.sendData(JSON.stringify({
            result: playerWon ? 'win' : 'lose',
            hits: gameState.hits,
            misses: gameState.misses
        }));
    }
}

function resetGame() {
    gameState = {
        phase: 'setup',
        playerBoard: createEmptyBoard(),
        enemyBoard: createEmptyBoard(),
        playerShips: [],
        enemyShips: [],
        selectedShip: null,
        isHorizontal: true,
        playerTurn: true,
        hits: 0,
        misses: 0,
        shipsToPlace: [...SHIPS]
    };
    
    hitsEl.textContent = '0';
    missesEl.textContent = '0';
    
    shipSelector.style.display = 'block';
    enemyBoardWrapper.style.display = 'none';
    startBtn.style.display = 'block';
    randomBtn.style.display = 'block';
    resetBtn.style.display = 'none';
    
    phaseIndicator.querySelector('.phase-badge').textContent = 'Расстановка кораблей';
    phaseHint.textContent = 'Расставьте корабли на своём поле';
    
    gameOverModal.classList.remove('active');
    
    renderBoard(playerBoardEl, gameState.playerBoard, true);
    renderBoard(enemyBoardEl, gameState.enemyBoard, false);
    renderShipSelector();
}
