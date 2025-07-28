//CONSTANTS AND VARIABLES
let direction = {x: 0 , y: 0};
const foodSound = new Audio('snake-hiss-95241.mp3');
const gameOverSound = new Audio('');
const moveSound = new Audio('');
const musicSound = new Audio(''); 
let speed = 2;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13 , y: 15}
]

//GAME FUNCTIONS
function main(ctime){
    window.requestAnimationFrame(main);
    console.log(ctime);
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();

}
function gameEngine(){
    //part1 : updating the snake array and food;


    //part2 : display the snake and food;

}










//MAIN LOGIC STARTS HERE
window.requestAnimationFrame(main);
