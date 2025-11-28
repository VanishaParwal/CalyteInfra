import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import * as api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ColorFlowProps {
  onBack: () => void;
}

export function ColorFlow({ onBack }: ColorFlowProps) {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const [colors, setColors] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [level, setLevel] = useState(1);
  const [matches, setMatches] = useState(0);

  const colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
  ];

  const generateColors = (gridSize: number = 6) => {
    // Ensure even number of colors for pairs
    const evenSize = gridSize % 2 === 0 ? gridSize : gridSize + 1;
    const pairCount = evenSize / 2;
    
    // Create pairs
    const newColors: string[] = [];
    for (let i = 0; i < pairCount; i++) {
      const color = colorPalette[i % colorPalette.length];
      newColors.push(color, color);
    }
    
    // Shuffle
    for (let i = newColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newColors[i], newColors[j]] = [newColors[j], newColors[i]];
    }
    
    setColors(newColors);
    setSelectedColors([]);
    setMatches(0);
  };

  useEffect(() => {
    generateColors(6 + level);
  }, [level]);

  const handleColorClick = (index: number) => {
    // Don't allow clicking on already matched colors
    if (!colors[index]) return;

    if (selectedColors.includes(index)) {
      setSelectedColors(selectedColors.filter((i) => i !== index));
      setScore(Math.max(0, score - 1));
      return;
    }

    const newSelected = [...selectedColors, index];
    setSelectedColors(newSelected);
    setScore(score + 1);

    if (newSelected.length >= 2) {
      const lastTwo = newSelected.slice(-2);
      if (colors[lastTwo[0]] === colors[lastTwo[1]]) {
        const newMatches = matches + 1;
        setMatches(newMatches);
        setScore(score + 6);
        toast({ title: 'Match!', description: `${newMatches} pairs matched` });

        // Remove matched colors from board
        const newColors = [...colors];
        newColors[lastTwo[0]] = '';
        newColors[lastTwo[1]] = '';
        setColors(newColors);

        const totalPairs = Math.floor((6 + level) / 2);
        if (newMatches >= totalPairs) {
          setLevel(level + 1);
          toast({ title: 'Level Up!', description: `Level ${level + 1}` });
          setTimeout(() => {
            generateColors(6 + level + 1);
          }, 800);
        }

        setTimeout(() => {
          setSelectedColors([]);
        }, 500);
      } else {
        setScore(Math.max(0, score - 2));
        setTimeout(() => {
          setSelectedColors([]);
        }, 800);
      }
    }
  };

  const saveScore = async () => {
    const timePlayed = Math.floor((Date.now() - startTime) / 1000);
    try {
      await api.saveGameScore({
        gameType: 'color-flow',
        score,
        timePlayed,
        achievements: level > 5 ? ['color-master'] : [],
      });
      toast({ title: 'Score saved!', description: `Score: ${score}` });
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setMatches(0);
    generateColors(6);
  };

  return (
    <div className={`w-full h-full flex flex-col gap-4 p-4`}>
      <div className="flex justify-between items-center">
        <h2 className={`font-serif text-2xl ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>
          Color Flow
        </h2>
        <div className={`space-x-4 ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>
          <span className="text-lg font-medium">Level: {level}</span>
          <span className="text-lg font-medium">Score: {score}</span>
        </div>
      </div>

      <p className={`text-center text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
        Match pairs of the same color to advance
      </p>

      <div className={`flex-1 flex justify-center items-center`}>
        <div className={`grid gap-3 ${colors.length === 6 ? 'grid-cols-3' : colors.length <= 9 ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {colors.map((color, index) => (
            color && (
              <button
                key={index}
                onClick={() => handleColorClick(index)}
                className={`w-16 h-16 rounded-lg transition-all duration-200 hover-elevate active-elevate-2 border-2 ${
                  selectedColors.includes(index)
                    ? `border-white scale-110 ${isDarkMode ? 'ring-2 ring-white/50' : 'ring-2 ring-black/50'}`
                    : `border-transparent ${isDarkMode ? 'hover:border-white/30' : 'hover:border-black/30'}`
                }`}
                style={{ backgroundColor: color }}
                data-testid={`button-color-${index}`}
              />
            )
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={resetGame} variant="outline">
          New Game
        </Button>
        <Button onClick={saveScore}>Save Score</Button>
        <Button onClick={onBack} variant="ghost">
          Back
        </Button>
      </div>
    </div>
  );
}
