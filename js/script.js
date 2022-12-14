/*
Need to Improve:
+Design
+Checking Turn
+Needs only one Winner

Need to Add:
+Draw function
+AI!!!!!!!!!!!!!
+Win screens
*/

const Player = (sign) => {
    const playerSign = sign;
    let moves = []; // Example playerOne moves are [0,1,2]. This is for checking the Win Condition.
    
    const setMoves = (index) => {
        moves.push(parseInt(index));
    }

    const clearMoves = () =>{
        moves = [];
    }

    const getMoves = () => {
        //moves.sort();
        return moves;
    }

    const getPlayerSign = () =>{
        return playerSign;
    }

    return {getPlayerSign, getMoves, setMoves, clearMoves};
}

const gameBoard = (()=>{
    const board = ["","","","","","","","",""];

    const setSign = (boardArrayIndex, sign) => {
        board[boardArrayIndex] = sign;
    }

    const getBoard = () => {
        return board;
    }

    const getSign = (boardArrayIndex) => {
        return board[boardArrayIndex];
    }
    const clearBoard = () => {
        for(let i = 0; i < board.length; i++){
            board[i] = "";
        }
    }
    return {getBoard, setSign, getSign, clearBoard};
})();

const logicController = (()=>{
    const playerOne = Player("O");
    const playerTwo = Player("X");
    let currentPlayer;
    var turn;

    const nextPlayer = () => {
        if (currentPlayer == playerOne.getPlayerSign()){
            currentPlayer = playerTwo.getPlayerSign();
        }else if (currentPlayer == playerTwo.getPlayerSign()){
            currentPlayer = playerOne.getPlayerSign();
        }
    }

    const firstPlayer = () =>{
        if (currentPlayer == undefined){
            currentPlayer = playerOne.getPlayerSign();
        }else{
            return currentPlayer;
        }
    }

    const nextTurn = ()=> {
        if (turn == undefined){
            turn = 0 ;
        }
        turn++;
        return turn;
    }

    const playRound = (index) => {
        firstPlayer();
        if(currentPlayer == playerOne.getPlayerSign() && !checkWinner()){
            playerOne.setMoves(index);
            gameBoard.setSign(index,playerOne.getPlayerSign());
            checkWinner();
            nextPlayer();
            nextTurn();
        }
        else if(currentPlayer == playerTwo.getPlayerSign() && !checkWinner()){
            playerTwo.setMoves(index);
            gameBoard.setSign(index, playerTwo.getPlayerSign());
            checkWinner();
            nextPlayer();
            nextTurn();
        }
    }

    const checkWinCondition = () => {
        let result = null;
        const winConditions = [[0,1,2],
                            [0,3,6],
                            [0,4,8],
                            [1,4,7],
                            [2,5,8],
                            [2,4,6],
                            [3,4,5],
                            [6,7,8]];
        for(let i=0; i < winConditions.length; i++){
            if(winConditions[i].every(val => playerTwo.getMoves().includes(val))){
                result = 'X';
            }else if(winConditions[i].every(val => playerOne.getMoves().includes(val))){
                result = 'O';
            }else if(gameBoard.getBoard().indexOf("") === -1){
                result = 'tie';
            }
        }
        return result;
    }

    const checkWinner = () =>{
        let winner = checkWinCondition();
        if(winner == 'X'){
            console.log(playerTwo.getMoves())
            console.log('X wins!')
            displayController.showMessage('X');
            resetLogic();
            winner = null;
            return true;
        }else if(winner == 'O'){
            console.log(playerOne.getMoves())
            console.log('O wins!')
            displayController.showMessage('O');
            resetLogic();
            winner = null;
            return true;
        }else if(winner == 'tie'){
            console.log("It's a Tie!")
            displayController.showMessage('tie');
            resetLogic();
            winner = null;
            return true;
        }else{
            return false;
        }
    }
    
    const resetLogic = () =>{
        gameBoard.clearBoard();
        playerOne.clearMoves();
        playerTwo.clearMoves();
        turn = undefined;
        result = null;
        currentPlayer = undefined;
    }

    return {playerOne,playerTwo,playRound, checkWinCondition,checkWinner};
})();

const displayController = (()=>{
    const gridElements = document.querySelectorAll(".gridElement");
    const resetButton = document.querySelector("#nextRound");
    const winScreen = document.querySelector(".winScreen");
    const nextRoundButton = document.querySelector("#resetBoard");

    resetButton.addEventListener("click", ()=>{;
        winScreen.style.visibility = "visible"
    })

    nextRoundButton.addEventListener("click", ()=>{
        winScreen.style.visibility = "hidden";
    })

    gridElements.forEach(element => {
        element.addEventListener("click", (e)=> {
            if(e.target.innerText != "") return;
            logicController.playRound(e.target.dataset.index);
            refreshGridDisplay();
            if(logicController.checkWinner()) return;
            logicController.playRound(aiController.findBestTurn(gameBoard.getBoard()));
            refreshGridDisplay();
        })
    });

    const refreshGridDisplay = () =>{
        for(let i = 0; i < gridElements.length; i++){
            gridElements[i].innerText = gameBoard.getSign(i);
        }
    }

    const showMessage = (whoWon) => {
        const text = document.querySelector(".winLoseText");
        if(whoWon == 'X'){
            text.innerText = "You Lose!"
            winScreen.style.visibility = "visible";
            refreshGridDisplay();
        }else if(whoWon == 'O'){
            text.innerText = "You Won!"
            winScreen.style.visibility = "visible";
            refreshGridDisplay();
        }else if(whoWon == 'tie'){
            text.innerText = "It's a tie!"
            winScreen.style.visibility = "visible";
            refreshGridDisplay();
        }
    }
    
    return {refreshGridDisplay, showMessage};
})();

const aiController = (() => {
    // Right now my AI turn is based on pure randomness of Math.random()
//     const findBestTurn = (board) => {
//         let newBoard = board.slice(0);
        
//         let aiArr = []; 
        
//         for (let i = 0; i < newBoard.length; i++) {
//             if(newBoard[i] == ""){
//                 aiArr.push(i);
//             }
//         }
//         return aiArr[Math.floor(Math.random()*(aiArr.length))];
//    }
    // END OF RANDOM

    const findBestTurn = (board) =>{

        let bestScore = -Infinity;
        let move;
        for(let i = 0; i<board.length; i++){
            if (board[i] == ""){
                board[i] = "X";
                logicController.playerTwo.setMoves(i);
                let score = minimax(board, 0, false);
                board[i] = "";
                logicController.playerTwo.getMoves().pop();
                if(score>bestScore){
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    let scores ={
        X: 100,
        O: 50,
        tie: 100,
    };

    const minimax = (board, depth, isMaximizing) =>{
        let result = logicController.checkWinCondition();
        if(result !== null){
            return scores[result];
        }

        if(isMaximizing){
            let bestScore = -Infinity;
            for(let i = 0; i<board.length; i++){
                if (board[i] == ""){
                    board[i] = "X";
                    logicController.playerTwo.setMoves(i);
                    let score = minimax(board, depth+1, false);
                    logicController.playerTwo.getMoves().pop();
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        }else{
            let bestScore = Infinity;
            for(let i = 0; i<board.length; i++){
                if(board[i] == ""){
                    board[i] = "O";
                    logicController.playerOne.setMoves(i);
                    let score = minimax(board, depth+1, true);
                    logicController.playerOne.getMoves().pop();
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
        
    }

   return {findBestTurn}
})();

const startPage = (() => {
    const readyButton = document.querySelector("#ready");
    const header = document.querySelector(".header");
    const body = document.querySelector(".body");
    const round = document.querySelector(".round");
    const footer = document.querySelector(".footer");
    readyButton.addEventListener("click", ()=>{
        document.querySelector(".startPage").remove();
        header.style.visibility = "visible";
        body.style.visibility = "visible";
        round.style.visibility = "visible";
        footer.style.visibility = "visible";
    });
})();

const pageEffects = (() => {
    
    const eyeEffect = () => {
    // MOVING EYES // 
        const eyes1 = document.querySelectorAll('.eye1');
        const eyes2 = document.querySelectorAll('.eye2');

        document.addEventListener('mousemove', (e)=>{

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const anchor1 = document.getElementById('char1');
            const rekt1 = anchor1.getBoundingClientRect();
            const anchor2 = document.getElementById('char2');
            const rekt2 = anchor2.getBoundingClientRect();

            const anchorX1 = rekt1.left + rekt1.width / 2;
            const anchorY1 = rekt1.top + rekt1.height / 2;

            const anchorX2 = rekt2.left + rekt2.width / 2;
            const anchorY2 = rekt2.top + rekt2.width / 2;
            
            const angleDeg1 = angle(mouseX, mouseY, anchorX1, anchorY1);
            const angleDeg2 = angle(mouseX, mouseY, anchorX2, anchorY2)

            
            eyes1.forEach(eye => {
                eye.style.transform = `rotate(${135 + angleDeg1 * -1}rad)`;
            })

            eyes2.forEach(eye => {
                eye.style.transform = `rotate(${135 + angleDeg2 * -1}rad)`; 
            })
        })
    };

    const angle = (cx,cy,ex,ey) => {
        const dy = ey - cy;
        const dx = ex - cx;
        const rad = Math.atan2(dx,dy);
        return rad;
    };

    return {eyeEffect}

//END OF MOVING EYES //
})();

pageEffects.eyeEffect();

