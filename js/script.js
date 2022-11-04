const Player = (sign) => {
    const playerSign = sign;
    const moves = [];

    const setMoves = (index) => {
        moves.push(parseInt(index));
    }

    const getMoves = () => {
        moves.sort();
        return moves;
    }

    const getPlayerSign = () =>{
        return playerSign;
    }

    return {getPlayerSign, getMoves, setMoves};
}

const gameBoard = (()=>{
    const board = ["","","","","","","","",""];

    const setSign = (boardArrayIndex, sign) => {
        board[boardArrayIndex] = sign;
    }

    const getSign = (boardArrayIndex) => {
        return board[boardArrayIndex];
    }
    const clearBoard = () => {
        for(let i = 0; i < board.length; i++){
            board[i] = "";
        }
    }
    return {board, setSign, getSign, clearBoard };
})();

const logicController = (()=>{
    const playerOne = Player("O");
    const playerTwo = Player("X");
    const playerAI = Player("%");
    let turn = 0;

    const playRound = (index) => {
        if(gameBoard.getSign(index) != "") return;
        gameBoard.setSign(index, checkTurn(index));
    }

    const checkWinCondition = () => {
        const winConditions = [[0,1,2],
                            [0,3,6],
                            [0,4,8],
                            [1,4,7],
                            [2,5,7],
                            [2,4,6],
                            [3,4,5],
                            [6,7,8]];
        
        for(let i=0; i < winConditions.length; i++){
            if(JSON.stringify(winConditions[i]) == JSON.stringify(playerOne.getMoves())){
                return true;
            }
        }
        return false;
    }

    const checkTurn = (index) => {
        if(turn%2 === 0){
            playerOne.setMoves(index);
            console.log(playerOne.getMoves());
            turn++;
            checkWinCondition();
            return playerOne.getPlayerSign();
        }else{
            playerAI.setMoves(aiController.findBestTurn());
            console.log(playerTwo.getMoves());
            turn++;
            checkWinCondition();
            return playerTwo.getPlayerSign();
        }

    }

    return {playRound, checkWinCondition};
})();

const displayController = (()=>{
    const gridElements = document.querySelectorAll(".gridElement");


    gridElements.forEach(element => {
        element.addEventListener("click", (e)=>{
            logicController.playRound([].indexOf.call(e.target.parentNode.children, e.target));
            refreshGridDisplay();
            showMessage();
        })
    });

    const refreshGridDisplay = () =>{
        for(let i = 0; i < gridElements.length; i++){
            gridElements[i].innerText = gameBoard.getSign(i);
        }
    }

    const showMessage = () => {
        if(logicController.checkWinCondition()){
            console.log("Player One Wins");
        }
    }


    
    return {refreshGridDisplay};
})();

const aiController = (() => {

    const findBestTurn = () =>{
        let aiArr = []; 
        for (let i = 0; i < gameBoard.board.length; i++) {
            if(gameBoard.board[i] == ""){
                aiArr.push(i);
            }
        }
        return Math.floor(Math.random()*(aiArr.length+1))
    }

    const aiTurn = () => {
        return Math.floor(Math.random()*10);
    }

    return {aiTurn, findBestTurn};

})();

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

function angle(cx,cy,ex,ey){
    const dy = ey - cy;
    const dx = ex - cx;
    const rad = Math.atan2(dx,dy);
    return rad;
};

//END OF MOVING EYES //
