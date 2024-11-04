import React, { useState, useEffect } from 'react';
import './App.css';

const gridSize = 3;
const emptyIndex = gridSize * gridSize - 1;

function App() {
  const [tiles, setTiles] = useState([]);
  const [shuffled, setShuffled] = useState(false);
  const [steps, setSteps] = useState(0);
  const [time, setTime] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [showTargetImage, setShowTargetImage] = useState(false);
  const [buttonText, setButtonText] = useState('開始遊戲');

  useEffect(() => {
    const initialTiles = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    setTiles(initialTiles);
  }, []);

  useEffect(() => {
    let timer;
    if (shuffled && !isSolved) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (isSolved) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [shuffled, isSolved]);

  const shuffleTiles = () => {
    let shuffledTiles;
    do {
      shuffledTiles = [...tiles];
      for (let i = shuffledTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledTiles[i], shuffledTiles[j]] = [shuffledTiles[j], shuffledTiles[i]];
      }
    } while (!isSolvable(shuffledTiles) || isPuzzleSolved(shuffledTiles));

    setTiles(shuffledTiles);
    setShuffled(true);
    setSteps(0);
    setTime(0);
    setIsSolved(false);
    setButtonText('重新挑戰');
  };

  const resetGame = () => {
    setTiles(Array.from({ length: gridSize * gridSize }, (_, i) => i));
    setShuffled(false);
    setSteps(0);
    setTime(0);
    setIsSolved(false);
    setButtonText('開始遊戲');
  };

  const isSolvable = (tiles) => {
    let inversions = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i] !== emptyIndex && tiles[j] !== emptyIndex && tiles[i] > tiles[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };

  const moveTile = (index) => {
    if (!shuffled || isSolved) return;
    const newTiles = [...tiles];
    const emptyPos = tiles.indexOf(emptyIndex);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyPos / gridSize);
    const emptyCol = emptyPos % gridSize;

    if ((Math.abs(row - emptyRow) + Math.abs(col - emptyCol)) === 1) {
      [newTiles[index], newTiles[emptyPos]] = [newTiles[emptyPos], newTiles[index]];
      setTiles(newTiles);
      setSteps(steps + 1);
      if (isPuzzleSolved(newTiles)) {
        setIsSolved(true);
        setButtonText('開始遊戲');
      }
    }
  };

  const isPuzzleSolved = (tiles) => tiles.every((tile, index) => tile === index);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isMovable = (index) => {
    const emptyPos = tiles.indexOf(emptyIndex);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyPos / gridSize);
    const emptyCol = emptyPos % gridSize;

    return (Math.abs(row - emptyRow) + Math.abs(col - emptyCol)) === 1;
  };

  return (
    <div className="App">
      <div className="controls">
        <div className="button-container">
          <button className="button" onClick={shuffled ? resetGame : shuffleTiles}>{buttonText}</button>
          <button className="button" onClick={() => setShowTargetImage(!showTargetImage)}>
            {showTargetImage ? '隱藏目標圖片' : '查看目標圖片'}
          </button>
        </div>
        <div className="status">
          <span>3x3</span>
          <span> | </span>
          <span>時間: {formatTime(time)}</span>
          <span> | </span>
          <span>步數: {steps}步</span>
        </div>
      </div>
      {showTargetImage ? (
        <div className="target-image">
          <img src="logo2.png" alt="目標圖片" />
        </div>
      ) : (
        <div className="puzzle-container">
          <div className="puzzle">
            {tiles.map((tile, index) => (
              <div
                key={index}
                className={`tile ${tile === emptyIndex ? 'empty' : ''} ${isMovable(index) ? 'movable' : ''}`}
                onClick={() => moveTile(index)}
                style={{
                  backgroundPosition: `${(tile % gridSize) * -150}px ${(Math.floor(tile / gridSize)) * -150}px`,
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
      {isSolved && <p className="congrats-message">恭喜！你完成了拼圖！</p>}
    </div>
  );
}

export default App;