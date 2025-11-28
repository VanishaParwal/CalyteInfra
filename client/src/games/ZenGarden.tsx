import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import * as api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ZenGardenProps {
  onBack: () => void;
}

export function ZenGarden({ onBack }: ZenGardenProps) {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [strokes, setStrokes] = useState(0);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = isDarkMode ? '#1e293b' : '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid pattern
    ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let i = 0; i <= canvas.width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
  }, [isDarkMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lastPosRef.current = { x, y };
    setIsDrawing(true);
    setStrokes(strokes + 1);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.strokeStyle = isDarkMode ? '#ec4899' : '#db2777';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPosRef.current = { x, y };
    setScore(score + 1);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = isDarkMode ? '#1e293b' : '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw grid
    ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let i = 0; i <= canvas.width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    setScore(0);
    setStrokes(0);
  };

  const saveScore = async () => {
    const timePlayed = Math.floor((Date.now() - startTime) / 1000);
    try {
      await api.saveGameScore({
        gameType: 'zen-garden',
        score,
        timePlayed,
        achievements: strokes > 50 ? ['artist'] : [],
      });
      toast({ title: 'Score saved!', description: `Score: ${score}` });
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  return (
    <div className={`w-full h-full flex flex-col gap-4 p-4`}>
      <div className="flex justify-between items-center">
        <h2 className={`font-serif text-2xl ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>
          Zen Garden
        </h2>
        <div className={`text-lg font-medium ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>
          Score: {score}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className={`flex-1 border rounded-lg cursor-crosshair ${
          isDarkMode ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white/50'
        }`}
        data-testid="canvas-zen-garden"
        style={{ touchAction: 'none' }}
      />

      <div className="flex gap-2 justify-center">
        <Button onClick={clearCanvas} variant="outline" data-testid="button-clear-garden">
          Clear
        </Button>
        <Button onClick={saveScore} data-testid="button-save-garden">Save Score</Button>
        <Button onClick={onBack} variant="ghost" data-testid="button-back-garden">
          Back
        </Button>
      </div>
    </div>
  );
}
