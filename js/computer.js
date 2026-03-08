/*jshint esnext: true */
/* @flow */

var POSITION_WEIGHTS = [
  [120, -20, 20, 5, 5, 20, -20, 120],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [120, -20, 20, 5, 5, 20, -20, 120]
];
var PIECE_DRAW_OFFSET = 7.375;
var COMPUTER_MOVE_ANIMATION_DURATION = 450;
var computerMoveAnimationInProgress = false;
var computerMoveAnimationFrame = null;
var computerMoveAnimationVersion = 0;

function isComputerMoveAnimating() {
  return computerMoveAnimationInProgress;
}

function cancelComputerMoveAnimation() {
  computerMoveAnimationVersion += 1;
  computerMoveAnimationInProgress = false;
  if (computerMoveAnimationFrame !== null) {
    window.cancelAnimationFrame(computerMoveAnimationFrame);
    computerMoveAnimationFrame = null;
  }
}

function getAnimationStartPoint(targetX, targetY) {
  var offBoardStart = 80;
  var leftDistance = targetX;
  var rightDistance = WIDTH - targetX;
  var topDistance = targetY;
  var bottomDistance = HEIGHT - targetY;
  var nearestEdge = Math.min(leftDistance, rightDistance, topDistance, bottomDistance);

  if (nearestEdge === leftDistance) {
    return [-offBoardStart, targetY];
  } else if (nearestEdge === rightDistance) {
    return [WIDTH + offBoardStart, targetY];
  } else if (nearestEdge === topDistance) {
    return [targetX, -offBoardStart];
  }
  return [targetX, HEIGHT + offBoardStart];
}

function animateComputerPieceToSquare(player, targetSquare, onComplete) {
  var squareSize = WIDTH / GRIDSIZE;
  var targetX = (targetSquare[0] * squareSize) + PIECE_DRAW_OFFSET;
  var targetY = (targetSquare[1] * squareSize) + PIECE_DRAW_OFFSET;
  var animationStart = getAnimationStartPoint(targetX, targetY);
  var startX = animationStart[0];
  var startY = animationStart[1];
  var startTime = null;
  var version = computerMoveAnimationVersion;

  function step(timestamp) {
    if (version !== computerMoveAnimationVersion) {
      return;
    }

    if (startTime === null) {
      startTime = timestamp;
    }

    var elapsed = timestamp - startTime;
    var progress = Math.min(elapsed / COMPUTER_MOVE_ANIMATION_DURATION, 1);
    var currentX = startX + (targetX - startX) * progress;
    var currentY = startY + (targetY - startY) * progress;

    drawBoard();
    context.globalAlpha = 0.95;
    context.drawImage(player.piece, currentX, currentY);
    context.globalAlpha = 1;

    if (progress < 1) {
      computerMoveAnimationFrame = window.requestAnimationFrame(step);
    } else {
      computerMoveAnimationFrame = null;
      onComplete();
    }
  }

  computerMoveAnimationFrame = window.requestAnimationFrame(step);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function computerMove(player) {
  if (!state || computerMoveAnimationInProgress) {
    return;
  }

  var move = [];
  var possibleMoves = [];

  for (var i = 0; i < board.length; i++) {

    for (var j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        move = traverse(i, j, turn);
        if (move[0]) {
          possibleMoves.push([i, j]);
        }
      }
    }

  }

  if (possibleMoves.length === 0) {
    return;
  }

  var bestWeight = Math.max.apply(Math, possibleMoves.map(function (value) {
    var x = value[0];
    var y = value[1];
    return POSITION_WEIGHTS[x][y];
  }));
  possibleMoves = possibleMoves.filter(function (value) {
    var x = value[0];
    var y = value[1];
    return POSITION_WEIGHTS[x][y] === bestWeight;
  });

  var randomMoveIndex = randomNumber(0, possibleMoves.length - 1);
  var selectedSquare = possibleMoves[randomMoveIndex];
  computerMoveAnimationInProgress = true;
  animateComputerPieceToSquare(player, selectedSquare, function () {
    computerMoveAnimationInProgress = false;
    if (!state) {
      return;
    }
    makeMove(selectedSquare[0], selectedSquare[1]);
    drawBoard();
  });
}
