import { Layout } from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gamepad2, Sparkles, Palette, Compass, Flower, Grid3x3 } from 'lucide-react';
import { ZenGarden } from '@/games/ZenGarden';
import { MandalaArt } from '@/games/MandalaArt';
import { ColorFlow } from '@/games/ColorFlow';
import { MindfulMaze } from '@/games/MindfulMaze';
import { CalmTetris } from '@/games/CalmTetris';

export default function Games() {
  const { isDarkMode } = useTheme();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    {
      id: 'zen-garden',
      title: 'Zen Garden',
      description: 'Create and maintain your digital garden',
      duration: '5-15 min',
      icon: Flower,
      color: 'from-green-400/20 to-emerald-500/20'
    },
    {
      id: 'color-flow',
      title: 'Color Flow',
      description: 'Relaxing color matching puzzle',
      duration: '10-20 min',
      icon: Palette,
      color: 'from-purple-400/20 to-pink-500/20'
    },
    {
      id: 'mindful-maze',
      title: 'Mindful Maze',
      description: 'Navigate through peaceful labyrinths',
      duration: '5-10 min',
      icon: Compass,
      color: 'from-blue-400/20 to-cyan-500/20'
    },
    {
      id: 'mandala-art',
      title: 'Mandala Art',
      description: 'Create beautiful symmetrical mandala patterns',
      duration: '10-20 min',
      icon: Sparkles,
      color: 'from-yellow-400/20 to-orange-500/20'
    },
    {
      id: 'tetris',
      title: 'Calm Tetris',
      description: 'Classic block puzzle with relaxing vibes',
      duration: '10-20 min',
      icon: Grid3x3,
      color: 'from-indigo-400/20 to-violet-500/20'
    },
  ];

  const renderGame = () => {
    switch (activeGame) {
      case 'zen-garden':
        return <ZenGarden onBack={() => setActiveGame(null)} />;

      case 'color-flow':
        return <ColorFlow onBack={() => setActiveGame(null)} />;

      case 'mindful-maze':
        return <MindfulMaze onBack={() => setActiveGame(null)} />;

      case 'mandala-art':
        return <MandalaArt onBack={() => setActiveGame(null)} />;

      case 'tetris':
        return <CalmTetris onBack={() => setActiveGame(null)} />;

      default:
        return null;
    }
  };

  if (activeGame) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
          {renderGame()}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-32">
        <div className="text-center mb-12">
          <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-4xl mb-4`}>
            Relaxation Games
          </h2>
          <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
            Calm your mind with interactive, peaceful activities
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-900/10'} backdrop-blur-xl p-6 hover-elevate active-elevate-2 cursor-pointer`}
              data-testid={`game-card-${game.id}`}
            >
              <div className={`w-full aspect-square rounded-lg bg-gradient-to-br ${game.color} flex items-center justify-center mb-4`}>
                <game.icon className={`w-16 h-16 ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`} />
              </div>
              <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} text-xl mb-2 font-medium`}>
                {game.title}
              </h3>
              <p className={`${isDarkMode ? 'text-white/70' : 'text-slate-700'} mb-3 text-sm`}>
                {game.description}
              </p>
              <span className={`text-xs ${isDarkMode ? 'text-white/50' : 'text-slate-600'}`}>
                {game.duration}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
