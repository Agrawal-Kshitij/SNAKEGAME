//CONSTANTS AND VARIABLES
let direction = {x: 0 , y: 0};
const foodSound = new Audio('snake-hiss-95241.mp3');
const gameOverSound = new Audio('');
const moveSound = new Audio('snake-hiss-95241.mp3');
const musicSound = new Audio(''); 
let speed = 2;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13 , y: 15}
]
food = {x: 6 , y: 7};

//GAME FUNCTIONS
function main(ctime){
    window.requestAnimationFrame(main);
    //console.log(ctime);
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();

}
function gameEngine(){
    //part1 : updating the snake array and food;


    //part2 : display the snake;
    
    board.innerHTML = "";
    snakeArr.forEach((e , index)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        
        if(index === 0){
            snakeElement.classList.add('head');
        }
        else{
            snakeElement.classList.add('snake');

        }
        board.appendChild(snakeElement);

    })
    ////Display the Food;
        foodElement = document.createElement('div');
        foodElement.style.gridRowStart = food.y;
        foodElement.style.gridColumnStart = food.x;
        foodElement.classList.add('food');
        board.appendChild(foodElement);
}












//MAIN LOGIC STARTS HERE
window.requestAnimationFrame(main);
window.addEventListener('keydown' , e =>{
  InputDir = {x: 0 , y: 1}//Start the Game;
  moveSound.play();
  switch(e.key){
    case "ArrowUp":
        console.log("ArrowUp");
        inputDir.x = 0;
        inputDir.y = -1
        break;

    case "ArrowDown":
        console.log("ArrowDown");
        inputDir.x = 0;
        inputDir.y = 1
        break;

    case "ArrowLeft":
        console.log("ArrowLeft");
        inputDir.x = -1;
        inputDir.y = 0;
        break;

    case "ArrowRight":
        console.log("ArrowRight");
        inputDir.x = 1;
        inputDir.y = 0;
        break;

    default:
        break;
  }   
});
