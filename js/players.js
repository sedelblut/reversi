/*jshint esnext: true */
/* @flow */

var whiteCursor = "url(./img/white.svg) 25 25, auto";
var blackCursor = "url(./img/black.svg) 25 25, auto";
var blackPiece = new Image();
blackPiece.src = "img/black.svg";
var whitePiece = new Image();
whitePiece.src = "img/white.svg";

var humanPlayer = function () {
  this.score = 2;
  this.piece = blackPiece;
  this.cursor = blackCursor;
  this.name = "Human";
  this.isHuman = true;
  this.isComputer = false;
  this.acceptMove = function (event) {
    addPieceWithMouse(event);
  };
};

var computerPlayer = function () {
  this.score = 2;
  this.piece = whitePiece;
  this.name = "Computer";
  this.isHuman = false;
  this.isComputer = true;
  this.strategies = {
    cornerMoves: true,
    positionalWeights: true,
    mostCaptures: true,
    randomMoves: false
  };
  this.acceptMove = function (player) {
    computerMove(player);
  };
};
