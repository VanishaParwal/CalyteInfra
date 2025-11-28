import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import * as api from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MindfulMazeProps {
  onBack: () => void;
}

interface MazeCell {
  x: number;
  y: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
}

export function MindfulMaze({ onBack }: MindfulMazeProps) {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [mazeComplete, setMazeComplete] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [mazeIndex, setMazeIndex] = useState(0);
  const [mazes, setMazes] = useState<MazeCell[][]>([]);

  const MAZE_SIZE = 8;
  const CELL_SIZE = 40;
  const NUM_MAZES = 10;
  const EXIT_POS = { x: MAZE_SIZE - 1, y: MAZE_SIZE - 1 };

  const generateMaze = (): MazeCell[] => {
    // Create empty maze
    const maze: MazeCell[] = [];
    for (let y = 0; y < MAZE_SIZE; y++) {
      for (let x = 0; x < MAZE_SIZE; x++) {
        maze.push({
          x,
          y,
          walls: { top: x === 0 || y === 0 ? false : true, right: true, bottom: true, left: x === 0 ? false : true },
        });
      }
    }

    // Simple recursive backtracking maze generation
    const visited = new Array(MAZE_SIZE * MAZE_SIZE).fill(false);
    
    const getIdx = (x: number, y: number) => y * MAZE_SIZE + x;
    
    const carve = (x: number, y: number) => {
      visited[getIdx(x, y)] = true;

      // Random directions: up, right, down, left
      const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]].sort(() => Math.random() - 0.5);

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < MAZE_SIZE && ny >= 0 && ny < MAZE_SIZE && !visited[getIdx(nx, ny)]) {
          const current = maze[getIdx(x, y)];
          const next = maze[getIdx(nx, ny)];

          // Remove walls between cells
          if (dx === 1) {
            current.walls.right = false;
            next.walls.left = false;
          } else if (dx === -1) {
            current.walls.left = false;
            next.walls.right = false;
          } else if (dy === 1) {
            current.walls.bottom = false;
            next.walls.top = false;
          } else if (dy === -1) {
            current.walls.top = false;
            next.walls.bottom = false;
          }

          carve(nx, ny);
        }
      }
    };

    // Start carving from top-left
    carve(0, 0);

    // Open boundary walls for start and exit
    maze[0].walls.top = false;
    maze[0].walls.left = false;
    maze[getIdx(EXIT_POS.x, EXIT_POS.y)].walls.right = false;
    maze[getIdx(EXIT_POS.x, EXIT_POS.y)].walls.bottom = false;

    return maze;
  };

  // Generate all 10 mazes on component mount
  useEffect(() => {
    const generatedMazes: MazeCell[][] = [];
    for (let i = 0; i < NUM_MAZES; i++) {
      generatedMazes.push(generateMaze());
    }
    setMazes(generatedMazes);
  }, []);

  const currentMaze = mazes[mazeIndex] || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathingPhase((p) => (p + 1) % 4);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || currentMaze.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = isDarkMode ? '#1e293b' : '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 2;

    // Draw maze walls
    for (let y = 0; y < MAZE_SIZE; y++) {
      for (let x = 0; x < MAZE_SIZE; x++) {
        const cell = currentMaze[y * MAZE_SIZE + x];
        const px = x * CELL_SIZE + 10;
        const py = y * CELL_SIZE + 10;

        // Top wall
        if (cell.walls.top) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + CELL_SIZE, py);
          ctx.stroke();
        }

        // Right wall
        if (cell.walls.right) {
          ctx.beginPath();
          ctx.moveTo(px + CELL_SIZE, py);
          ctx.lineTo(px + CELL_SIZE, py + CELL_SIZE);
          ctx.stroke();
        }

        // Bottom wall
        if (cell.walls.bottom) {
          ctx.beginPath();
          ctx.moveTo(px, py + CELL_SIZE);
          ctx.lineTo(px + CELL_SIZE, py + CELL_SIZE);
          ctx.stroke();
        }

        // Left wall
        if (cell.walls.left) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, py + CELL_SIZE);
          ctx.stroke();
        }
      }
    }

    // Draw exit (green square at bottom-right)
    const exitX = EXIT_POS.x * CELL_SIZE + 10;
    const exitY = EXIT_POS.y * CELL_SIZE + 10;
    ctx.fillStyle = isDarkMode ? '#34d399' : '#10b981';
    ctx.fillRect(exitX, exitY, CELL_SIZE, CELL_SIZE);
    ctx.fillStyle = isDarkMode ? '#1e293b' : '#f8fafc';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('EXIT', exitX + CELL_SIZE / 2, exitY + CELL_SIZE / 2);

    // Draw player (pink circle)
    const playerX = playerPos.x * CELL_SIZE + 10 + CELL_SIZE / 2;
    const playerY = playerPos.y * CELL_SIZE + 10 + CELL_SIZE / 2;
    const breathSize = 8 + breathingPhase;
    ctx.fillStyle = isDarkMode ? '#ec4899' : '#db2777';
    ctx.beginPath();
    ctx.arc(playerX, playerY, breathSize, 0, Math.PI * 2);
    ctx.fill();
  }, [currentMaze, playerPos, isDarkMode, breathingPhase]);

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      setPlayerPos((prev) => {
        if (mazeComplete) return prev;

        const newX = prev.x + dx;
        const newY = prev.y + dy;

        // Bounds check
        if (newX < 0 || newX >= MAZE_SIZE || newY < 0 || newY >= MAZE_SIZE) return prev;

        // Wall check - check current cell's walls
        const currentCell = currentMaze[prev.y * MAZE_SIZE + prev.x];
        if (!currentCell) return prev;

        if (dx === -1 && currentCell.walls.left) return prev;
        if (dx === 1 && currentCell.walls.right) return prev;
        if (dy === -1 && currentCell.walls.top) return prev;
        if (dy === 1 && currentCell.walls.bottom) return prev;

        setScore((s) => s + 1);

        // Check if reached exit
        if (newX === EXIT_POS.x && newY === EXIT_POS.y) {
          setMazeComplete(true);
          toast({ title: 'Maze Complete!', description: `Completed in ${score + 1} steps` });
        }

        return { x: newX, y: newY };
      });
    },
    [currentMaze, mazeComplete, score, toast]
  );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  const saveScore = async () => {
    const timePlayed = Math.floor((Date.now() - startTime) / 1000);
    try {
      await api.saveGameScore({
        gameType: 'mindful-maze',
        score,
        timePlayed,
        achievements: mazeComplete ? ['explorer'] : [],
      });
      toast({ title: 'Score saved!', description: `Pattern ${mazeIndex + 1}: ${score} steps` });
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  const switchMaze = (direction: number) => {
    let newIndex = mazeIndex + direction;
    if (newIndex < 0) newIndex = NUM_MAZES - 1;
    if (newIndex >= NUM_MAZES) newIndex = 0;

    setMazeIndex(newIndex);
    setPlayerPos({ x: 0, y: 0 });
    setScore(0);
    setMazeComplete(false);
  };

  const resetMaze = () => {
    setPlayerPos({ x: 0, y: 0 });
    setScore(0);
    setMazeComplete(false);
  };

  return (
    <div className={`w-full h-full flex flex-col gap-4 p-4`}>
      <div className="flex justify-between items-center">
        <h2 className={`font-serif text-2xl ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>
          Mindful Maze
        </h2>
        <div className={`text-sm font-medium ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>
          Pattern {mazeIndex + 1}/{NUM_MAZES} | Steps: {score}
        </div>
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          className={`border-2 rounded-lg ${
            isDarkMode ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white/50'
          }`}
          data-testid="canvas-maze"
        />
      </div>

      <div className={`text-center text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
        Use arrow keys to navigate from start (pink) to goal (green) ⬆️ ⬇️ ⬅️ ➡️
      </div>

      <div className="grid grid-cols-3 gap-2 px-4">
        <Button onClick={() => switchMaze(-1)} variant="outline" size="sm" data-testid="button-maze-prev">
          <ChevronLeft className="w-4 h-4" /> Prev
        </Button>

        <Button onClick={resetMaze} variant="outline" size="sm" data-testid="button-maze-reset">
          Reset
        </Button>

        <Button onClick={() => switchMaze(1)} variant="outline" size="sm" data-testid="button-maze-next">
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={saveScore} data-testid="button-maze-save">
          Save Score
        </Button>
        <Button onClick={onBack} variant="ghost" data-testid="button-maze-back">
          Back
        </Button>
      </div>

      {mazeComplete && (
        <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
          <div className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
            ✓ Completed! Try another pattern.
          </div>
        </div>
      )}
    </div>
  );
}
