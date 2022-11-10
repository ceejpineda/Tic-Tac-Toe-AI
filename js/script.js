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

    const refreshLogic = () => {
        turn = 0;
        playerOne.clearMoves();
        playerTwo.clearMoves();
        gameBoard.clearBoard();
    }

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
        if(currentPlayer == playerOne.getPlayerSign()){
            playerOne.setMoves(index);
            gameBoard.setSign(index,playerOne.getPlayerSign());
            nextPlayer();
            nextTurn();
        }
        else if(currentPlayer == playerTwo.getPlayerSign()){
            playerTwo.setMoves(index);
            gameBoard.setSign(index, playerTwo.getPlayerSign());
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
                            [2,5,7],
                            [2,4,6],
                            [3,4,5],
                            [6,7,8]];
        for(let i=0; i < winConditions.length; i++){
            if(winConditions[i].every(val => playerTwo.getMoves().includes(val))){
                result = 'X';
            }else if(winConditions[i].every(val => playerOne.getMoves().includes(val))){
                result = 'O';
            }else if(turn == 8 && result == null){
                result = 'tie';
            }
        }
        return result;
    }

    return {playerOne,playerTwo,playRound, checkWinCondition, refreshLogic};
})();

const displayController = (()=>{
    const gridElements = document.querySelectorAll(".gridElement");
    const resetButton = document.querySelector("#nextRound");

    resetButton.addEventListener("click", ()=>{
        gameBoard.clearBoard();
        logicController.refreshLogic();
        refreshGridDisplay();
    })

    gridElements.forEach(element => {
        element.addEventListener("click", (e)=> {
            if(e.target.innerText != "") return;
            logicController.playRound(e.target.dataset.index);
            refreshGridDisplay();
        })
    });

    const refreshGridDisplay = () =>{
        for(let i = 0; i < gridElements.length; i++){
            gridElements[i].innerText = gameBoard.getSign(i);
        }
    }

    const showMessage = () => {
    }
    
    return {refreshGridDisplay};
})();

const aiController = (() => {
    // Right now my AI turn is based on pure randomness of Math.random()
    // 
    const findBestTurn = (board) => {
        let newBoard = board.slice(0);
        
        let aiArr = []; 
        
        for (let i = 0; i < newBoard.length; i++) {
            if(newBoard[i] == ""){
                aiArr.push(i);
            }
        }
        return aiArr[Math.floor(Math.random()*(aiArr.length))];
   }
   return {findBestTurn}
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

