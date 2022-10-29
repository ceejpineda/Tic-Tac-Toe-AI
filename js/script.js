class TicTacToe{


    createGrid(){

    }
    
    checkWin(){

    }
    refreshScreen(){

        
    }
    startGame(){

    }

}




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

//END OF MOVING EYES
