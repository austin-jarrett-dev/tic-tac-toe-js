document.addEventListener('DOMContentLoaded', () => {
    console.log('Hello from tic-tac-toe.js');

    // Get body element and create game structure
    const body = document.querySelector('body');

    const title = createElement('h1', { textContent: 'Tic Tac Toe' });
    const game = createElement('div', { id: 'game' });
    const board = createElement('div', { id: 'board' });
    const status = createElement('div', { id: 'status', textContent: "X's turn" });
    const reset = createElement('button', { id: 'reset', textContent: 'Reset' });
    const winnerDiv = createElement('div', { id: 'winner' });
    const drawDiv = createElement('div', { id: 'draw' });

    body.append(title, game);
    game.append(board, status, reset, winnerDiv, drawDiv);

    // Create the board cells
    const state = Array(9).fill('');
    let currentPlayer = 'X';
    let winner = null;
    let draw = false;

    for (let i = 0; i < 3; i++) {
        const row = createElement('div', { className: 'row' });
        board.appendChild(row);

        for (let j = 0; j < 3; j++) {
            const cell = createElement('div', {
                className: `cell cell-${i}-${j}`,
            });
            row.appendChild(cell);
        }
    }

    // Handle board click event
    board.addEventListener('click', (event) => {
        const cell = event.target;
        if (!cell.classList.contains('cell') || cell.textContent || winner || draw) return;

        const cellIndex = getCellIndex(cell);

        cell.textContent = currentPlayer;
        cell.classList.add(`player-${currentPlayer}`);
        state[cellIndex] = currentPlayer;

        winner = checkWinner();
        draw = checkDraw();

        if (winner) {
            console.log(`Winner: ${currentPlayer}`);
            status.textContent = `${currentPlayer} wins!`;
        } else if (draw) {
            console.log('Draw!');
            status.textContent = 'Draw!';
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `${currentPlayer}'s turn`;
        }
    });

    // Handle reset button click
    reset.addEventListener('click', resetGame);

    function resetGame() {
        state.fill('');
        currentPlayer = 'X';
        winner = null;
        draw = false;

        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('player-X', 'player-O');
            cell.classList.remove('winning-cell');
            cell.removeAttribute('data-preview');
        });

        status.textContent = "X's turn";
    }

    // Check for winner
    function checkWinner() {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (const [a, b, c] of winningCombos) {
            if (state[a] && state[a] === state[b] && state[a] === state[c]) {
                highlightWinningCells([a, b, c]);
                return state[a];
            }
        }
        return null;
    }

    function highlightWinningCells(indices) {
        indices.forEach(index => {
            document.querySelectorAll('.cell')[index].classList.add('winning-cell');
        });
    }

    // Check for draw
    function checkDraw() {
        return state.every(cell => cell !== '');
    }

    // Helper function to get cell index
    function getCellIndex(cell) {
        const [, row, col] = cell.classList[1].split('-').map(Number);
        return row * 3 + col;
    }

    // Utility function to create an element with attributes
    function createElement(tag, attributes = {}) {
        const element = document.createElement(tag);
        Object.assign(element, attributes);
        return element;
    }

    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            if (!cell.textContent && !winner) {
                cell.setAttribute('data-preview', currentPlayer);
            }
        });

        cell.addEventListener('mouseleave', () => {
            cell.removeAttribute('data-preview');
        });
    });

});
