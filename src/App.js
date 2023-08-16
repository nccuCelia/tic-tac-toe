import './App.css';
import React from 'react';
import { useState } from 'react';

const players = ['pika', 'char'];
let gameover = false;

function Square({ value, onSquareClick, xIsNext }) {
  //判斷是哪個 player，設定 cursor
  let handleMouseOver, handleMouseOut;
  if(gameover){
    onSquareClick = null;
  }else if(xIsNext){
    handleMouseOver = (event) => {event.target.classList.add('cursor-'+players[0]);}
    handleMouseOut = (event) => {event.target.classList.remove('cursor-'+players[0]);}
  }else{
    handleMouseOver = (event) => {event.target.classList.add('cursor-'+players[1]);}
    handleMouseOut = (event) => {event.target.classList.remove('cursor-'+players[1]);}
  }
  
  return (
    <div className="square" onClick={onSquareClick} onMouseOver={value ? null : handleMouseOver} onMouseOut={value ? null : handleMouseOut}>
      {value}
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    const nextSquares = squares.slice(); //copy array
    if(xIsNext){
      nextSquares[i] = 'O'
    }else{
      nextSquares[i] = 'X'
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status, clas;
  if (winner) {
    status = 'Winner: ';
    gameover = true;
    if(xIsNext){
      clas = 'status-' + players[1];
    }else{
      clas = 'status-' + players[0];
    }
    //Array(9).keys() = { length: 9 }, (_, index) => index
    return (
      <>
        <div className="board">
          {Array.from(Array(9).keys()).map(index => (
            <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} xIsNext={xIsNext} />
          ))}
        </div>
        <div>
          <div className={clas}>{status}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="board">
        {Array.from({ length: 9 }, (_, index) => index).map(index => (
          <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} xIsNext={xIsNext} />
        ))}
      </div>
    </>
  );
}

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  
  return (
    <div className="game">
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [];
  let size = squares.length;
  
  // 水平線
  for (let i = 0; i < size; i += Math.sqrt(size)) {
    lines.push(Array.from({ length: Math.sqrt(size) }, (_, j) => i + j));
  }
  
  // 垂直線
  for (let i = 0; i < Math.sqrt(size); i++) {
    lines.push(Array.from({ length: Math.sqrt(size) }, (_, j) => i + j * Math.sqrt(size)));
  }
  
  // 對角線
  lines.push(Array.from({ length: Math.sqrt(size) }, (_, i) => i * (Math.sqrt(size) + 1)));
  lines.push(Array.from({ length: Math.sqrt(size) }, (_, i) => (i + 1) * (Math.sqrt(size) - 1)));
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}