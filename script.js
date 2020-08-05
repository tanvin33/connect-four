/* global p5 */

// DO NOT EDIT THE FOLLOWING LINE
const p = new p5(() => {});

let width,
  height,
  winArray,
  turn,
  turnColor,
  n,
  diameter,
  pressed,
  win,
  column,
  rWins = 0,
  yWins = 0;

p.setup = function() {
  // Canvas & color settings
  width = 700;
  height = 800;
  p.createCanvas(width, height);
  p.colorMode(p.HSB, 360, 100, 100); //using HSB colors
  turn = "red";
  turnColor = "red";
  diameter = 75;
  win = false;
  winArray = [];
  column = 10;
  createCircles();
};

p.draw = function() {
  p.background(210, 97, 73);
  drawGrid();
  drawCircles();

  p.noStroke();
  p.fill(turnColor);
  p.ellipse(p.mouseX, p.mouseY, 70);

  // sets all the circles to white (emty) at the beginning
  p.fill("white");
  p.textSize(50);
  //game title
  p.text("Connect Four!", 200, 760);
  p.textSize(25);

  // showcases previous wins
  p.text("red: " + rWins, 40, 60);
  p.text("yellow: " + yWins, 570, 60);

  //calls function to change the color and announce turns
  p.fill(turnColor);
  p.text("It's " + turn + "'s turn!", 295, 785);

  // drops the coins in to the grid
  dropColumn();
  placeCoin();

  // check all the win conditions
  checkVerticalWins();
  checkHorizontalWins();
  checkRightDiagonals();
  checkLeftDiagonals();
  showResults();
};

//draws the grid (Game board)
function drawGrid() {
  p.strokeWeight(5);
  p.stroke("white");
  //vertical lines
  for (let i = 0; i < 7; i++) {
    p.line(i * 100, 100, i * 100, 700);
  }
  //horizontal lines
  for (let i = 0; i < 8; i++) {
    p.line(0, i * 100, 700, i * 100);
  }
}

//creates circles and adds them to the winArray (stores circle positions)
function createCircles() {
  for (let c = 0; c < 7; c++) {
    winArray.push([]);
    for (let r = 0; r < 6; r++) {
      let cir = new Circle(c * 100 + 50, r * 100 + 150, diameter);
      winArray[c].push(cir);
    }
  }
}

//draws 42 white circles for each token space
function drawCircles() {
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
      let c = winArray[i][j]; //saves each of the 42 circle object into the array callled winArray
      c.display();
    }
  }
}

//alternates between red and yellow for each turn
function changeTurn() {
  if (turn == "red") {
    turn = "yellow";
    turnColor = "yellow";
  } else if (turn == "yellow") {
    turn = "red";
    turnColor = "red";
  }
}

// checks if mouse has been released before drawing a circle
p.mousePressed = function() {
  pressed = true;
};

//checks to see if there are four tokens in a row vertically
function checkVerticalWins() {
  for (let c = 0; c < 7; c++) {
    // console.log("hi");
    for (let r = 0; r < 3; r++) {
      if (
        winArray[c][r].getColor() != "white" &&
        winArray[c][r].getColor() === winArray[c][r + 1].getColor() &&
        winArray[c][r + 1].getColor() === winArray[c][r + 2].getColor() &&
        winArray[c][r + 2].getColor() === winArray[c][r + 3].getColor()
      ) {
        win = true;
      }
    }
  }
}

// check to see if there are four tokens in a row horizontally
function checkHorizontalWins() {
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 4; c++) {
      if (
        winArray[c][r].getColor() != "white" &&
        winArray[c][r].getColor() === winArray[c + 1][r].getColor() &&
        winArray[c + 1][r].getColor() === winArray[c + 2][r].getColor() &&
        winArray[c + 2][r].getColor() === winArray[c + 3][r].getColor()
      )
        win = true;
    }
  }
}

//checks to see if there are four tokens in a row diagonally starting from the top left to bottom
function checkRightDiagonals() {
  for (let r = 0; r < 3; r++) {
    // console.log("hi");
    for (let c = 0; c < 4; c++) {
      if (
        winArray[c][r].getColor() != "white" &&
        winArray[c][r].getColor() === winArray[c + 1][r + 1].getColor() &&
        winArray[c + 1][r + 1].getColor() ===
          winArray[c + 2][r + 2].getColor() &&
        winArray[c + 2][r + 2].getColor() === winArray[c + 3][r + 3].getColor()
      )
        win = true;
    }
  }
}

//checks to see if there are four tokens in a row diagonally starting from the top right to bottom left
function checkLeftDiagonals() {
  for (let r = 0; r < 3; r++) {
    for (let c = 6; c > 2; c--) {
      if (
        winArray[c][r].getColor() != "white" &&
        winArray[c][r].getColor() === winArray[c - 1][r + 1].getColor() &&
        winArray[c - 1][r + 1].getColor() ===
          winArray[c - 2][r + 2].getColor() &&
        winArray[c - 2][r + 2].getColor() === winArray[c - 3][r + 3].getColor()
      )
        win = true;
    }
  }
}

//if the boolean win is true then background and text will appear displaying the winnning color
function showResults() {
  if (win == true) {
    changeTurn();
    p.fill(turnColor);
    p.background("grey");
    p.textSize(100);
    p.text(turnColor + " wins", 130, 340);
    if (turnColor == "red") {
      rWins++;
    }
    if (turnColor == "yellow") {
      yWins++;
    }
    // showcases wins
    p.fill("white");
    p.textSize(30);
    p.text("red: " + rWins, 40, 60);
    p.text("yellow: " + yWins, 570, 60);
    p.text("press any key to play again", 180, 400);

    p.noLoop();
  }
}

// restarts game if key is pressed

p.keyPressed = function() {
  p.setup();
  p.loop();
};

//checks to see which column the token will drop into depending on where the mouse clicks on above the game board
function dropColumn() {
  if (pressed == true && p.mouseY < 100) {
    // check to see that the mouse is at the top of the screen and is pressed
    for (let i = 1; i < 8; i++) {
      // iterate through each column section
      if (p.mouseX < i * 100 && p.mouseX > i * 100 - 100) {
        column = i - 1; // set the column equal to the right index for c that can then be used in placeCoin
        //console.log(column);
        pressed = false;
      }
    }
  }
}

//this function determines which space should change color
function placeCoin() {
  if (column < 10) {
    // checks if the column is within the range of the board
    // this conditional changes the color of the bottom row for the given column if it is empty i.e. color == white
    if (winArray[column][0].getColor() != "white") {
      // check whether the top of the column is full. If full, do not place a coin.
      console.log("this column is full");
    } else if (winArray[column][5].getColor() === "white") {
      winArray[column][5].color = turnColor;
      changeTurn(); // change who's turn it is and what the color of the cursor cirlce is
      column = 10;
    } else {
      // if the bottom row is not empty do this
      let done = false; // done is a boolean to check whether or not the program has found an empty spot for the circle
      let r = 0; // r is used to iterate through the rows
      while (done == false) {
        if (
          winArray[column][r].getColor() === "white" && // check that the position is empty
          winArray[column][r + 1].getColor() != "white" // check that the position one below is full
        ) {
          winArray[column][r].color = turnColor; // fill the square with the given color
          changeTurn();
          column = 10;
          done = true; // indicate that the spot has been found
        }
        r++; // iterator
      }
    }
  }
}

// creates a class for the cirlces in connect four
// they all start out white which is equivalent to empty
// but their color can change
// to check whether a circle is full or empty check the color

class Circle {
  //constructor for circle with x coordinate, y coordinate, and diameter
  constructor(x, y, d) {
    this.x = x;
    this.y = y;
    this.d = d;
    this.color = "white";
  }

  //accessor functions
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getD() {
    return this.d;
  }
  getColor() {
    return this.color;
  }

  // draws the circle on the screen using the ellipse tool
  display() {
    p.fill(this.color);
    p.ellipse(this.x, this.y, this.d);
  }

  // old method that used to check whether the mouse clicked on a circle to change the color
  //  now we use the dropColumn and placeCoin functions to simulate a real connect four game
  /*

  // check whether the mouse is colliding with a circle
  checkCollision() {
    let hit = p.collideCircleCircle(
      this.x,
      this.y,
      this.d,
      p.mouseX,
      p.mouseY,
      70
    );

  // if the mouse is colliding and the mouse is pressed down change the color and reset press
    if (hit && pressed && this.color == "white") {
      this.color = turnColor;
      changeTurn();
      pressed = false;
    } else if (hit && pressed) {
      pressed = false;
    }
  }
  */
}
