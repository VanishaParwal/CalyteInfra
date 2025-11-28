import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import * as api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface TetrisProps {
  onBack: () => void;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 25;

const TETRIMINOS = [
  { shape: [[1, 1, 1, 1]], color: '#06b6d4' },
  { shape: [[1, 0], [1, 0], [1, 1]], color: '#ec4899' },
  { shape: [[0, 1], [0, 1], [1, 1]], color: '#fbbf24' },
  { shape: [[1, 1], [1, 1]], color: '#34d399' },
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#a855f7' },
  { shape: [[1, 1, 1], [0, 1, 0]], color: '#f43f5e' },
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#3b82f6' },
];

export function CalmTetris({ onBack }: TetrisProps) {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<number[][]>(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [startTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);

  const [currentPiece, setCurrentPiece] = useState(() => ({
    ...TETRIMINOS[Math.floor(Math.random() * TETRIMINOS.length)],
    x: 3,
    y: 0,
  }));
  const [nextPiece] = useState(() => TETRIMINOS[Math.floor(Math.random() * TETRIMINOS.length)]);

  const canPlace = (piece: any, x: number, y: number, boardState: number[][]): boolean => {
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const newX = x + col;
          const newY = y + row;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || (newY >= 0 && boardState[newY][newX])) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const mergePiece = (piece: any, x: number, y: number, boardState: number[][]): number[][] => {
    const newBoard = boardState.map(row => [...row]);
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col] && y + row >= 0) {
          newBoard[y + row][x + col] = 1;
        }
      }
    }
    return newBoard;
  };

  const clearLines = (boardState: number[][]): { newBoard: number[][]; linesCleared: number } => {
    let linesCleared = 0;
    const newBoard = boardState.filter(row => {
      if (row.every(cell => cell === 1)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }

    return { newBoard, linesCleared };
  };

  const handleDrop = () => {
    if (isPaused || gameOver) return;

    const newY = currentPiece.y + 1;
    if (canPlace(currentPiece, currentPiece.x, newY, board)) {
      setCurrentPiece({ ...currentPiece, y: newY });
    } else {
      let newBoard = mergePiece(currentPiece, currentPiece.x, currentPiece.y, board);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      if (linesCleared > 0) {
        setScore(score + linesCleared * 100);
        setLevel(Math.floor((score + linesCleared * 100) / 500) + 1);
      }

      const newPiece = {
        ...TETRIMINOS[Math.floor(Math.random() * TETRIMINOS.length)],
        x: 3,
        y: 0,
      };

      if (!canPlace(newPiece, newPiece.x, newPiece.y, clearedBoard)) {
        setGameOver(true);
        toast({ title: 'Game Over!', description: `Final Score: ${score}` });
        return;
      }

      setBoard(clearedBoard);
      setCurrentPiece(newPiece);
    }
  };

  const handleMove = (direction: number) => {
    if (isPaused || gameOver) return;
    const newX = currentPiece.x + direction;
    if (canPlace(currentPiece, newX, currentPiece.y, board)) {
      setCurrentPiece({ ...currentPiece, x: newX });
    }
  };

  const handleRotate = () => {
    if (isPaused || gameOver) return;
    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );
    const rotatedPiece = { ...currentPiece, shape: rotated };
    if (canPlace(rotatedPiece, currentPiece.x, currentPiece.y, board)) {
      setCurrentPiece(rotatedPiece);
    }
  };

  useEffect(() => {
    if (gameOver || isPaused) return;
    const interval = setInterval(handleDrop, Math.max(200, 500 - level * 50));
    return () => clearInterval(interval);
  }, [currentPiece, board, gameOver, isPaused, level, score]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleMove(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleMove(1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleDrop();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleRotate();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPiece, board, gameOver, isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = isDarkMode ? '#1e293b' : '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        if (board[row][col]) {
          ctx.fillStyle = isDarkMode ? '#06b6d4' : '#0891b2';
          ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }
        ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }

    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          ctx.fillStyle = currentPiece.color;
          ctx.fillRect(
            (currentPiece.x + col) * BLOCK_SIZE,
            (currentPiece.y + row) * BLOCK_SIZE,
            BLOCK_SIZE - 1,
            BLOCK_SIZE - 1
          );
        }
      }
    }
  }, [board, currentPiece, isDarkMode]);

  const saveScore = async () => {
    const timePlayed = Math.floor((Date.now() - startTime) / 1000);
    try {
      await api.saveGameScore({
        gameType: 'calm-tetris',
        score,
        timePlayed,
        achievements: level > 3 ? ['tetris-master'] : [],
      });
      toast({ title: 'Score saved!', description: `Score: ${score}` });
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setCurrentPiece({
      ...TETRIMINOS[Math.floor(Math.random() * TETRIMINOS.length)],
      x: 3,
      y: 0,
    });
  };

  return (
    <div className={`w-full h-full flex flex-col gap-4 p-4`}>
      <div className="flex justify-between items-center">
        <h2 className={`font-serif text-2xl ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>
          Calm Tetris
        </h2>
        <div className={`space-x-4 ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>
          <span className="text-lg font-medium">Level: {level}</span>
          <span className="text-lg font-medium">Score: {score}</span>
        </div>
      </div>

      <p className={`text-center text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
        Arrow keys to move/rotate, down to drop
      </p>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={BOARD_WIDTH * BLOCK_SIZE}
          height={BOARD_HEIGHT * BLOCK_SIZE}
          className={`border rounded-lg ${isDarkMode ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white/50'}`}
          data-testid="canvas-tetris"
        />
      </div>

      {gameOver && (
        <p className={`text-center text-lg font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
          Game Over! Final Score: {score}
        </p>
      )}

      <div className="flex gap-2 justify-center">
        <Button onClick={() => setIsPaused(!isPaused)} variant="outline">
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button onClick={resetGame}>New Game</Button>
        <Button onClick={saveScore}>Save Score</Button>
        <Button onClick={onBack} variant="ghost">
          Back
        </Button>
      </div>
    </div>
  );
}
