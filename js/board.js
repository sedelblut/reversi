/*jshint esnext: true */
/* @flow */

const GRIDSIZE = 8;
const SQUARES = GRIDSIZE * GRIDSIZE;
const WIDTH = 500;
const HEIGHT = 500;
const LINEWIDTH = 2;
const RADIUS = 35;
const RETRO_FUTURE_BACKGROUND_COUNT = 10;

var board = Array.matrix(GRIDSIZE, GRIDSIZE, 0);
var grid = new Image();
grid.src = "img/grid.svg";
var background = new Image();
var randomBackgroundIndex = Math.floor(Math.random() * RETRO_FUTURE_BACKGROUND_COUNT) + 1;
var randomBackgroundSuffix = (randomBackgroundIndex < 10 ? "0" : "") + randomBackgroundIndex;
background.src = "img/retro-future-" + randomBackgroundSuffix + ".svg";

function drawBoard() {
  var piece = null;
  var squareWidth = canvas.width / GRIDSIZE;
  var squareHeight = canvas.height / GRIDSIZE;
  var piecePadding = squareWidth * 0.118;
  var pieceSize = squareWidth - (piecePadding * 2);
  context.globalAlpha = 1;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(background, 0, 0, canvas.width, canvas.height);
  context.drawImage(grid, 0, 0, canvas.width, canvas.height);

  for (var i = 0; i < GRIDSIZE; i++) {

    for (var j = 0; j < GRIDSIZE; j++) {
      if (board[i][j] > 0) {
        var x = i * squareWidth;
        var y = j * squareHeight;
        if (board[i][j] == 1) {
          piece = player1.piece;
        } else if (board[i][j] == 2) {
          piece = player2.piece;
        }
        context.drawImage(piece, x + piecePadding, y + piecePadding, pieceSize, pieceSize);
      }
    }

  }

  player1score.innerHTML = player1.score;
  player2score.innerHTML = player2.score;
}

function addPieceWithMouse(event) {
  if (state === true) {
    if (event.cancelable) {
      event.preventDefault();
    }
    var rect = canvas.getBoundingClientRect();
    var clientX = event.clientX;
    var clientY = event.clientY;

    if (event.touches && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if (event.changedTouches && event.changedTouches.length > 0) {
      clientX = event.changedTouches[0].clientX;
      clientY = event.changedTouches[0].clientY;
    }

    var x = ((clientX - rect.left) / rect.width) * canvas.width;
    var y = ((clientY - rect.top) / rect.height) * canvas.height;
    var squareX = Math.floor(x / (canvas.width / GRIDSIZE));
    var squareY = Math.floor(y / (canvas.height / GRIDSIZE));

    if (squareX >= 0 && squareX < GRIDSIZE && squareY >= 0 && squareY < GRIDSIZE) {
      makeMove(squareX, squareY);
    }
  }
}
