const dino = document.getElementById('dino');
const obstacle = document.getElementById('obstacle');
const tallObstacle = document.getElementById('tall-obstacle');
const scoreDisplay = document.getElementById('score-display');
const speedDisplay = document.getElementById('speed-display');
const endScreen = document.getElementById('end-screen');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

let isJumping = false;
let score = 0;
let gameRunning = true;
let jumpCount = 0;
let jumpPosition = 0;
let doubleJumpAllowed = true;
let obstaclePassed = false;
let currentObstacle = '';
let speed = 4; // Initial obstacle speed in seconds (slower start)
let speedIncreaseAmount = 0.2; // Amount to increase speed by
let speedIncreaseInterval = 10000; // 10 seconds interval to increase speed
let canJump = true; // Flag to control whether jumping is allowed

// Function to start the game and set a new random obstacle
function startGame() {
  obstacle.style.display = 'none';
  tallObstacle.style.display = 'none';
  
  const obstacleType = Math.random() < 0.5 ? 'obstacle' : 'tall-obstacle';
  
  currentObstacle = obstacleType;
  document.getElementById(obstacleType).style.display = 'block';
  
  // Reset the obstacle speed for the new game
  obstacle.style.animationDuration = `${speed}s`;
  tallObstacle.style.animationDuration = `${speed}s`;
  speedDisplay.textContent = `Speed: ${speed.toFixed(1)}s`;
}

// Initialize the game with a random obstacle
startGame();

document.addEventListener('keydown', function(event) {
  if (!gameRunning) return; // Ignore inputs if the game is not running
  
  if (event.key === 'w' && !event.shiftKey && jumpCount === 0 && canJump) {
    jump(); // Normal jump
  } else if (event.key === 'W' && event.shiftKey && doubleJumpAllowed && canJump) {
    jump(true); // Double jump
  }
});

function jump(isDoubleJump = false) {
  if (isJumping) return;
  isJumping = true;
  jumpCount++;
  doubleJumpAllowed = false;
  canJump = false; // Disable further jumps until landing

  // Adjust these values to balance the jump speed
  const jumpSpeed = Math.max(27, 32 - speed * 2); // Balanced jump speed
  const jumpIncrement = Math.max(7, 12 - speed); // Balanced jump increment

  let jumpHeight = isDoubleJump ? 300 : 150;
  let upInterval = setInterval(() => {
    if (jumpPosition >= jumpHeight) {
      clearInterval(upInterval);

      let downInterval = setInterval(() => {
        if (jumpPosition <= 0) {
          clearInterval(downInterval);
          jumpPosition = 0;
          jumpCount = 0;
          doubleJumpAllowed = true;
          isJumping = false;
          canJump = true; // Re-enable jumping
          dino.style.bottom = jumpPosition + 'px';
        } else {
          jumpPosition -= jumpIncrement;
          dino.style.bottom = jumpPosition + 'px';
        }
      }, jumpSpeed);
    } else {
      jumpPosition += jumpIncrement;
      dino.style.bottom = jumpPosition + 'px';
    }
  }, jumpSpeed);
}

function updateObstacleSpeed() {
  if (speed > 1) {
    speed -= speedIncreaseAmount;
    obstacle.style.animationDuration = `${speed}s`;
    tallObstacle.style.animationDuration = `${speed}s`;
    speedDisplay.textContent = `Speed: ${speed.toFixed(1)}s`;
  }
}

// Increase speed every 10 seconds
setInterval(updateObstacleSpeed, speedIncreaseInterval);

function showEndScreen() {
  endScreen.classList.remove('hidden');
  finalScore.textContent = `Final Score: ${score}`;
  canJump = false; // Disable jumping on the end screen
}

function hideEndScreen() {
  endScreen.classList.add('hidden');
}

// Restart the game when the restart button is clicked
restartButton.addEventListener('click', () => {
  hideEndScreen();
  // Reset the game state
  score = 0;
  speed = 4;
  scoreDisplay.textContent = `Score: ${score}`;
  speedDisplay.textContent = `Speed: ${speed.toFixed(1)}s`;
  startGame();
  gameRunning = true;
  canJump = true; // Re-enable jumping

  // Restart collision and score checks
  checkCollisionInterval = setInterval(checkCollision, 10);
  scoreInterval = setInterval(() => {
    if (gameRunning) {
      score += 1;
      scoreDisplay.textContent = `Score: ${score}`;
    }
  }, 1000);
});

function checkCollision() {
  if (!gameRunning) return;

  let dinoRect = dino.getBoundingClientRect();
  let currentObstacleElement = document.getElementById(currentObstacle);
  let currentObstacleRect = currentObstacleElement.getBoundingClientRect();

  if (
    dinoRect.right > currentObstacleRect.left &&
    dinoRect.left < currentObstacleRect.right &&
    dinoRect.bottom > currentObstacleRect.top &&
    dinoRect.top < currentObstacleRect.bottom
  ) {
    showEndScreen();
    currentObstacleElement.style.animation = 'none';
    gameRunning = false;
    clearInterval(checkCollisionInterval);
    clearInterval(scoreInterval);
  }

  if (currentObstacleRect.right < dinoRect.left && !obstaclePassed) {
    score += 1;
    scoreDisplay.textContent = `Score: ${score}`;
    obstaclePassed = true;
    startGame();
    
    setTimeout(() => {
      obstaclePassed = false;
    }, 2000);
  }

  if (currentObstacleRect.right < 0 && obstaclePassed) {
    obstaclePassed = false;
  }
}

// Initialize intervals
let checkCollisionInterval = setInterval(checkCollision, 10);
let scoreInterval = setInterval(() => {
  if (gameRunning) {
    score += 1;
    scoreDisplay.textContent = `Score: ${score}`;
  }
}, 1000);