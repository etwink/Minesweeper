document.addEventListener("DOMContentLoaded", () => {
    const difficulty = document.getElementById("difficulty").getAttribute("data");
    let isGameOver = false;
    let firstClick = false;
    let startTime = 0;
    let bombs = [];
    let valid = [];
    let numValidChecked = 0;
    let sqSize = 40;

    function click(board, square) {
        if (square.classList.contains("flag")) { return; }
        let currentId = square.getAttribute("id");
        if (!firstClick) {
            let coords = currentId.split(",");
            let i = parseInt(coords[0]);
            let j = parseInt(coords[1]);
            firstClick = true;
            var _board = moveMines(board, j, i);
        }
        if (isGameOver) { return; }
        if (square.classList.contains("checked")) { return; }
        elapsedTime();
        if (square.classList.contains("bomb")) { gameOver(); }
        else {
            ++numValidChecked;
            let total = square.getAttribute("data");
            square.classList.add("checked");
            if (numValidChecked === valid.length) { gameOver(); }
            updateNeighbors(board, square);
            if (total != 0 && total != 9) {
                square.innerHTML = total;
                square.classList.add("checked" + total);
                setEffectiveLabel(board, square);
                return;
            }
            checkSquare(board, square, currentId);
        }   
    }

    function rightClick(board, square) {
        if (square.classList.contains("checked") || isGameOver || !firstClick) { return; }
        if (square.classList.contains("flag")) {
            square.classList.remove("flag");
            square.innerHTML = "";
            let coords = square.getAttribute("id").split(",");
            let i = parseInt(coords[0]);
            let j = parseInt(coords[1]);
            let neighbors = [[i - 1, j + 1], [i, j + 1], [i + 1, j + 1], [i + 1, j], [i + 1, j - 1], [i, j - 1], [i - 1, j - 1], [i - 1, j]];
            for (let z = 0; z < neighbors.length; ++z) {
                let n = neighbors[z];
                let r = n[0];
                let c = n[1];
                if (r >= 0 && c >= 0 && c < board.length && r < (board[0]).length) {
                    var curr = document.getElementById(r + "," + c);
                    curr.setAttribute("markedNeighbors", parseInt(curr.getAttribute("markedNeighbors")) - 1);
                    setEffectiveLabel(board, curr);
                }
            }
            return;
        }
        square.classList.add("flag");
        square.innerHTML = "&#128681";
        updateNeighbors(board, square);
        let coords = square.getAttribute("id").split(",");
        let i = parseInt(coords[0]);
        let j = parseInt(coords[1]);
        let neighbors = [[i - 1, j + 1], [i, j + 1], [i + 1, j + 1], [i + 1, j], [i + 1, j - 1], [i, j - 1], [i - 1, j - 1], [i - 1, j]];
        for (let z = 0; z < neighbors.length; ++z) {
            let n = neighbors[z];
            let r = n[0];
            let c = n[1];
            if (r >= 0 && c >= 0 && c < board.length && r < (board[0]).length) {
                var curr = document.getElementById(r + "," + c);
                setEffectiveLabel(board, curr);
            }
        }
    }

    function checkSquare(board, square, currentId) {
        let coords = currentId.split(",");
        let i = parseInt(coords[0]);
        let j = parseInt(coords[1]);
        let neighbors = [[i - 1, j + 1], [i, j + 1], [i + 1, j + 1], [i + 1, j], [i + 1, j - 1], [i, j - 1], [i - 1, j - 1], [i - 1, j]];
        let s = [];
        for (let z = 0; z < neighbors.length; ++z) {
            let n = neighbors[z];
            let r = n[0];
            let c = n[1];
            if (r >= 0 && c >= 0 && c < board.length && r < (board[0]).length) { s.push(n); }
        }
        while (s.length != 0) {
            let n = s.pop();
            let newSquare = document.getElementById(n[0] + "," + n[1]);
            if (!newSquare.classList.contains('checked')) { click(board, newSquare); }
        }
    }

    function setEffectiveLabel(board, square) {
        var coords = square.getAttribute("id").split(",");
        var i = parseInt(coords[0]);
        var j = parseInt(coords[1]);
        var neighbors = [[i - 1, j + 1], [i, j + 1], [i + 1, j + 1], [i + 1, j], [i + 1, j - 1], [i, j - 1], [i - 1, j - 1], [i - 1, j]];
        let elabel = parseInt(square.getAttribute("data"));
        let coveredNeighbors = [];
        for (let z = 0; z < neighbors.length; ++z) {
            let n = neighbors[z];
            let r = n[0];
            let c = n[1];
            if (r >= 0 && c >= 0 && c < board.length && r < (board[0]).length) {
                let curr = document.getElementById(r + "," + c);
                if (curr.classList.contains("flag")) {
                    --elabel;
                }
                else if (!curr.classList.contains("checked")) {
                    coveredNeighbors.push(curr);
                }
            }
        }
        square.setAttribute("elabel", elabel);
        if (elabel === 0 && coveredNeighbors.length === 0) { square.setAttribute("elabelComplete", "1"); }
        else { square.setAttribute("elabelComplete", "0"); }
        if (document.getElementById("effectiveLabelCheck").checked && square.classList.contains("checked")) {
            if (!square.classList.contains("effective-label") && !square.classList.contains("effective-label0") && !square.classList.contains("effective-label-negative")) { !square.classList.add("effective-label") }
            square.innerHTML = elabel;
            if (elabel === 0) {
                if (coveredNeighbors.length === 0) {
                    square.classList.replace("effective-label", "effective-label0");
                    square.classList.replace("effective-label-negative", "effective-label0");
                }
                else {
                    square.classList.replace("effective-label-negative", "effective-label");
                    square.setAttribute("elabelComplete", "0");
                }
            }
            else if (elabel < 0) {
                square.classList.replace("effective-label0", "effective-label-negative");
                square.classList.replace("effective-label", "effective-label-negative");
                square.setAttribute("elabelComplete", "0");
            }
            else {
                square.classList.replace("effective-label0", "effective-label");
                square.classList.replace("effective-label-negative", "effective-label");
                square.setAttribute("elabelComplete", "0");
            }
        }
    }

    function updateNeighbors(board, square) {
        var coords = square.getAttribute("id").split(",");
        var i = parseInt(coords[0]);
        var j = parseInt(coords[1]);
        var neighbors = [[i - 1, j + 1], [i, j + 1], [i + 1, j + 1], [i + 1, j], [i + 1, j - 1], [i, j - 1], [i - 1, j - 1], [i - 1, j]];
        for (let z = 0; z < neighbors.length; ++z) {
            let n = neighbors[z];
            let r = n[0];
            let c = n[1];
            if (r >= 0 && c >= 0 && c < board.length && r < (board[0]).length) {
                let curr = document.getElementById(r + "," + c);
                let markedNeighbors = parseInt(curr.getAttribute("markedNeighbors")) + 1;
                curr.setAttribute("markedNeighbors", markedNeighbors);
                if (markedNeighbors === 8 && curr.getAttribute("elabel") === "0" && curr.classList.contains("effective-label")) {
                    curr.classList.replace("effective-label", "effective-label0");
                }
            }
        }
    }

    function elapsedTime() {
        var t = Math.floor((Date.now() - startTime) / 1000);
        if (!isGameOver) {
            document.getElementById("timeElapsed").innerHTML = t + " seconds";
            setTimeout(() => {
                elapsedTime();
            }, 1000);
        }
        return t;
    }

    function drawBoardInit(board) {
        const height = board.length;
        const width = board[0].length;
        const grid = document.querySelector('.grid');
        document.getElementById("msBoard").style.height = (sqSize * height) + "px";
        document.getElementById("msBoard").style.width = (sqSize * width) + "px";
        for (var i = 0; i < height; ++i) {
            for (var j = 0; j < width; ++j) {
                const square = document.createElement('div');
                square.setAttribute('id', j + "," + i);
                square.setAttribute('elabel', "0");
                square.setAttribute("elabelComplete", "0");
                square.setAttribute("markedNeighbors", "0");
                square.style.width = sqSize + "px";
                square.style.height = sqSize + "px";
                if (board[i][j] === 9) { square.classList.add("bomb"); }
                else { square.classList.add("valid"); }
                grid.appendChild(square);
                square.addEventListener('click', function (e) {
                    click(board, square);
                })
                square.addEventListener('contextmenu', function (e) {
                    e.preventDefault();
                    rightClick(board, square);
                }, false);
            }
        }
    }

    function createBoard(difficulty) {
        var boardWidth = 10;
        var boardHeight = 10;
        var numOfMines = 10;
        if (difficulty === "Intermediate") {
            boardWidth = 16;
            boardHeight = 16;
            numOfMines = 40;
            sqSize = 30;
        }
        if (difficulty === "Expert") {
            boardWidth = 30;
            boardHeight = 16;
            numOfMines = 99;
            sqSize = 30;
        }

        let board = new Array(boardHeight);
        for (var i = 0; i < boardHeight; ++i) {
            board[i] = new Array(boardWidth).fill(0);
        }

        var minesPlaced = 0;
        while (minesPlaced < numOfMines) {
            var bombX = Math.floor(Math.random() * board.length);
            var bombY = Math.floor(Math.random() * (board[0]).length);
            if (board[bombX][bombY] !== 9) {
                board[bombX][bombY] = 9;
                ++minesPlaced;
            }
        }
        drawBoardInit(board);
        _board = board;
        return board;
    }

    function updateBoard(board) {
        const height = board.length;
        const width = board[0].length;
        const isRevealed = document.getElementById("revealBombsCheckbox").checked;
        for (let i = 0; i < height; ++i) {
            for (let j = 0; j < width; ++j) {
                const square = document.getElementById(j + "," + i);
                if (board[i][j] === 9) {
                    square.classList.replace("valid", "bomb");
                    bombs.push(square);
                    if (isRevealed) { square.classList.add("revealed"); }
                }
                else {
                    square.classList.replace("bomb", "valid");
                    square.setAttribute("data", board[i][j]);
                    valid.push(square);
                }
            }
        }
    }

    function moveMines(board, initRow, initCol) {
        var boardRows = board.length;
        var boardCols = board[0].length;
        const safeSquares = [[initRow, initCol], [initRow - 1, initCol + 1], [initRow, initCol + 1], [initRow + 1, initCol + 1], [initRow + 1, initCol], [initRow + 1, initCol - 1], [initRow, initCol - 1], [initRow - 1, initCol - 1], [initRow - 1, initCol], [initRow, initCol - 2], [initRow + 2, initCol], [initRow, initCol + 2], [initRow - 2, initCol]];
        let minesToMove = 0;
        for (var i = 0; i < safeSquares.length; ++i) {
            var r = safeSquares[i][0];
            var c = safeSquares[i][1];
            if (r >= 0 && c >= 0 && r < boardRows && c < boardCols && board[r][c] === 9) {
                board[r][c] = 0;
                ++minesToMove;
            }
        }

        while (minesToMove != 0) {
            var bombRow = Math.floor(Math.random() * board.length);
            var bombY = Math.floor(Math.random() * (board[0]).length);
            var readyToPlace = true;
            if (board[bombRow][bombY] !== 9) {
                for (var i = 0; i < safeSquares.length; ++i) {
                    var r = safeSquares[i][0];
                    var c = safeSquares[i][1];
                    if (bombRow === r && bombY === c) {
                        readyToPlace = false;
                        break;
                    }
                }
                if (readyToPlace) {
                    board[bombRow][bombY] = 9;
                    --minesToMove;
                }
            }
        }

        for (var i = 0; i < board.length; ++i) {
            for (var j = 0; j < (board[i]).length; ++j) {
                if (board[i][j] === 9) {
                    var neighbors = [[i - 1, j + 1], [i, j + 1], [i + 1, j + 1], [i + 1, j], [i + 1, j - 1], [i, j - 1], [i - 1, j - 1], [i - 1, j]];
                    for (var n = 0; n < neighbors.length; ++n) {
                        var r = neighbors[n][0];
                        var c = neighbors[n][1];
                        if ((r >= 0 && c >= 0 && r < board.length && c < (board[i]).length) && board[r][c] != 9) {
                            board[r][c] += 1;
                        }
                    }
                }
            }
        }

        updateBoard(board);
        startTime = Date.now();
        return board;
    }

    function gameOver() {
        isGameOver = true;
        for (var i = 0; i < bombs.length; ++i) {
            bombs[i].classList.remove("revealed");
            bombs[i].classList.add("game-over");
            bombs[i].innerHTML = "&#128163";
        }
        let endScore = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("difficultyLabel").innerHTML = "Difficulty: " + difficulty;
        if (numValidChecked === valid.length) {
            document.getElementById("gameStatus").innerHTML = "Winner!";
            document.getElementById("scoreLabel").innerHTML = "Score: " + endScore;
            document.getElementById("Score").value = endScore;
            if (document.getElementById("hsEnabled").innerHTML === "False") { document.getElementById("scoreSubmit").remove() }
        }
        else {
            document.getElementById("gameStatus").innerHTML = "Loser :(";
            document.getElementById("scoreLabel").innerHTML = "Score: --";
            document.getElementById("scoreSubmit").remove();
        }
        document.getElementById("overlay").style.display = "block";
    }

    createBoard(difficulty);
});