const dino = document.getElementById('dino');
const obstacle = document.getElementById('obstacle');
const tallObstacle = document.getElementById('tall-obstacle');
const scoreDisplay = document.getElementById('score');
let isJumping = false;
let score = 0;
let gameRunning = true;
let jumpCount = 0; // Counter to track jumps
let jumpPosition = 0; // Track the current height of the jump
let doubleJumpAllowed = true; // Flag to allow double jump
let obstaclePassed = false; // Flag to track if obstacle has been passed
let currentObstacle = ''; // Track which obstacle is currently visible

// Function to start the game and set a new random obstacle
function startGame() {
  // Hide both obstacles initially
  obstacle.style.display = 'none';
  tallObstacle.style.display = 'none';

  // Randomly select an obstacle type
  const obstacleType = Math.random() < 0.5 ? 'obstacle' : 'tall-obstacle';
  
  // Show the selected obstacle
  currentObstacle = obstacleType;
  document.getElementById(obstacleType).style.display = 'block';
}

// Initialize the game with a random obstacle
startGame();

document.addEventListener('keydown', function(event) {
  // Check for normal jump (lowercase 'w')
  if (event.key === 'w' && !event.shiftKey && jumpCount === 0) {
    jump(150); // Normal jump height
  } 
  // Check for double jump (Shift + lowercase 'w')
  else if (event.key === 'W' && event.shiftKey && doubleJumpAllowed) {
    jump(300); // Double jump height (2x normal)
  }
});

function jump(jumpHeight) {
  if (isJumping) return; // Prevent multiple jumps if already jumping
  isJumping = true;
  jumpCount++; // Increase jump count when jump is triggered
  doubleJumpAllowed = false; // Disable double jump until the first jump is completed

  let upInterval = setInterval(() => {
    if (jumpPosition >= jumpHeight) {
      clearInterval(upInterval);

      let downInterval = setInterval(() => {
        if (jumpPosition <= 0) {
          clearInterval(downInterval);
          jumpPosition = 0; // Reset jump position when the dino hits the ground
          jumpCount = 0; // Reset jump count when the dino hits the ground
          doubleJumpAllowed = true; // Allow double jump after landing
          isJumping = false;
        } else {
          jumpPosition -= 20;
          dino.style.bottom = jumpPosition + 'px';
        }
      }, 20);
    } else {
      jumpPosition += 20;
      dino.style.bottom = jumpPosition + 'px';
    }
  }, 20);
}

let checkCollision = setInterval(function () {
  let dinoRect = dino.getBoundingClientRect();
  let currentObstacleElement = document.getElementById(currentObstacle);
  let currentObstacleRect = currentObstacleElement.getBoundingClientRect();

  // Check for collision with the current obstacle
  if (
    dinoRect.right > currentObstacleRect.left &&
    dinoRect.left < currentObstacleRect.right &&
    dinoRect.bottom > currentObstacleRect.top &&
    dinoRect.top < currentObstacleRect.bottom
  ) {
    alert('Game Over!');
    currentObstacleElement.style.animation = 'none';
    gameRunning = false;
    clearInterval(checkCollision); // Stop the game after collision
    clearInterval(scoreInterval); // Stop the score increment
  }

  // Check if the current obstacle has passed the dino successfully
  if (currentObstacleRect.right < dinoRect.left && !obstaclePassed) {
    score += 1;
    scoreDisplay.textContent = `Score: ${score}`;
    obstaclePassed = true; // Mark that the obstacle has been passed
    startGame(); // Hide the passed obstacle and show a new random one
    
    // Reset the obstaclePassed flag after 5 seconds
    setTimeout(() => {
      obstaclePassed = false;
    }, 4000);
  }

  // Reset the flag once the obstacle leaves the screen (to the left)
  if (currentObstacleRect.right < 0 && obstaclePassed) {
    obstaclePassed = false; // Ready for the next obstacle
  }
}, 10);

// Increment the score by 1 every second
let scoreInterval = setInterval(() => {
  if (gameRunning) {
    score += 1;
    scoreDisplay.textContent = `Score: ${score}`;
  }
}, 1000); // Increment score every 1 second