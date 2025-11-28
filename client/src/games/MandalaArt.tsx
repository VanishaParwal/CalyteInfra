import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';
import * as api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface MandalaArtProps {
  onBack: () => void;
}

export function MandalaArt({ onBack }: MandalaArtProps) {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [segments, setSegments] = useState(8);
  const [radius, setRadius] = useState(150);
  const [layers, setLayers] = useState(4);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [colorScheme, setColorScheme] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingEnabled, setDrawingEnabled] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState('#ec4899');
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);

  const brushColorOptions = [
    '#ec4899', // Pink
    '#db2777', // Dark Pink
    '#fbbf24', // Amber
    '#06b6d4', // Cyan
    '#10b981', // Green
    '#a855f7', // Purple
    '#f43f5e', // Rose
    '#3b82f6', // Blue
    '#ffffff', // White
    '#000000', // Black
  ];

  const colorSchemes = [
    ['#ec4899', '#f43f5e', '#fbbf24'],
    ['#06b6d4', '#0891b2', '#164e63'],
    ['#a855f7', '#9333ea', '#581c87'],
    ['#10b981', '#059669', '#064e3b'],
  ];

  const drawMandala = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = isDarkMode ? '#1e293b' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    const colors = colorSchemes[colorScheme];

    for (let layer = 0; layer < layers; layer++) {
      const currentRadius = (radius / layers) * (layer + 1);
      const color = colors[layer % colors.length];

      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const nextAngle = ((i + 1) / segments) * Math.PI * 2;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * currentRadius, centerY + Math.sin(angle) * currentRadius);
        ctx.arc(centerX, centerY, currentRadius, angle, nextAngle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fillStyle = colors[0];
    ctx.fill();
    ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    setScore(segments * layers * 10);
  };

  useEffect(() => {
    drawMandala();
  }, [segments, radius, layers, colorScheme, isDarkMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingEnabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lastXRef.current = x;
    lastYRef.current = y;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawingEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.strokeStyle = brushColor;

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const lastRotX = centerX + (lastXRef.current - centerX) * cos - (lastYRef.current - centerY) * sin;
      const lastRotY = centerY + (lastXRef.current - centerX) * sin + (lastYRef.current - centerY) * cos;
      const rotX = centerX + (x - centerX) * cos - (y - centerY) * sin;
      const rotY = centerY + (x - centerX) * sin + (y - centerY) * cos;

      ctx.beginPath();
      ctx.moveTo(lastRotX, lastRotY);
      ctx.lineTo(rotX, rotY);
      ctx.lineWidth = brushSize * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    lastXRef.current = x;
    lastYRef.current = y;
    setScore(score + 1);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const randomize = () => {
    setSegments(Math.floor(Math.random() * 12) + 6);
    setRadius(Math.floor(Math.random() * 100) + 100);
    setLayers(Math.floor(Math.random() * 4) + 3);
    setColorScheme(Math.floor(Math.random() * colorSchemes.length));
  };

  const clearDrawing = () => {
    drawMandala();
    setScore(segments * layers * 10);
  };

  const saveScore = async () => {
    const timePlayed = Math.floor((Date.now() - startTime) / 1000);
    try {
      await api.saveGameScore({
        gameType: 'mandala-art',
        score,
        timePlayed,
        achievements: drawingEnabled && score > 100 ? ['artist'] : layers > 5 ? ['master-artist'] : [],
      });
      toast({ title: 'Mandala saved!', description: `Complexity: ${score}` });
    } catch (error) {
      console.error('Failed to save mandala:', error);
    }
  };

  return (
    <div className={`w-full h-full flex flex-col gap-4 p-4`}>
      <div className="flex justify-between items-center">
        <h2 className={`font-serif text-2xl ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>
          Mandala Art
        </h2>
        <div className={`text-lg font-medium ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>
          Score: {score}
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <Button 
          onClick={() => { setDrawingEnabled(false); drawMandala(); }} 
          variant={!drawingEnabled ? "default" : "outline"}
        >
          Generate Pattern
        </Button>
        <Button 
          onClick={() => setDrawingEnabled(true)} 
          variant={drawingEnabled ? "default" : "outline"}
        >
          Draw on Pattern
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className={`self-center border rounded-lg ${
          isDarkMode ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white/50'
        } ${drawingEnabled ? 'cursor-crosshair' : 'cursor-default'}`}
        data-testid="canvas-mandala"
        style={{ display: 'block' }}
      />

      {!drawingEnabled && (
        <div className={`grid grid-cols-3 gap-4 px-4 text-sm`}>
          <div className={`space-y-2 ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`}>
            <label>Segments</label>
            <Slider value={[segments]} onValueChange={(v) => setSegments(v[0])} min={4} max={24} step={1} />
            <div className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>{segments}</div>
          </div>

          <div className={`space-y-2 ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`}>
            <label>Radius</label>
            <Slider value={[radius]} onValueChange={(v) => setRadius(v[0])} min={80} max={200} step={10} />
            <div className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>{radius}</div>
          </div>

          <div className={`space-y-2 ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`}>
            <label>Layers</label>
            <Slider value={[layers]} onValueChange={(v) => setLayers(v[0])} min={2} max={8} step={1} />
            <div className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>{layers}</div>
          </div>
        </div>
      )}

      {drawingEnabled && (
        <div className={`space-y-3 px-4`}>
          <div className={`space-y-2 ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`}>
            <label>Brush Size</label>
            <Slider value={[brushSize]} onValueChange={(v) => setBrushSize(v[0])} min={1} max={10} step={1} />
            <div className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'} text-center`}>{brushSize}px</div>
          </div>

          <div className={`space-y-2 ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`}>
            <label>Brush Color</label>
            <div className="grid grid-cols-5 gap-2">
              {brushColorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setBrushColor(color)}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    brushColor === color
                      ? 'border-white ring-2 ring-offset-2 ring-offset-slate-900'
                      : 'border-transparent hover:border-white/50'
                  }`}
                  style={{ 
                    backgroundColor: color,
                    ringOffset: isDarkMode ? '#1e293b' : '#f8fafc'
                  }}
                  data-testid={`button-brush-color-${color.replace('#', '')}`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
              Current: Size {brushSize}px | Color {brushColor}
            </div>
          </div>
        </div>
      )}

      <div className={`flex gap-2 justify-center flex-wrap`}>
        {!drawingEnabled && (
          <>
            <Button onClick={() => setColorScheme((c) => (c + 1) % colorSchemes.length)} variant="outline">
              Change Colors
            </Button>
            <Button onClick={randomize} variant="outline">
              Randomize
            </Button>
          </>
        )}
        {drawingEnabled && (
          <Button onClick={clearDrawing} variant="outline">
            Clear Drawings
          </Button>
        )}
        <Button onClick={saveScore}>Save</Button>
        <Button onClick={onBack} variant="ghost">
          Back
        </Button>
      </div>
    </div>
  );
}
