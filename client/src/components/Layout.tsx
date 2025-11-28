import { ReactNode } from 'react';
import { AnimatedBackground } from './AnimatedBackground';
import { Navigation } from './Navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { Flame as FlameIcon, Trophy } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  showStats?: boolean;
}

export function Layout({ children, showStats = false }: LayoutProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#07070a]' : 'bg-blue-50'} overflow-x-hidden font-sans`}>
      <AnimatedBackground />
      <Navigation />
      
      {showStats && (
        <div className={`relative z-10 w-full ${isDarkMode ? 'bg-white/5' : 'bg-slate-900/5'} backdrop-blur-md border-y ${isDarkMode ? 'border-white/10' : 'border-slate-900/10'}`}>
          <div className="max-w-7xl mx-auto py-4 px-6 flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-3">
              <FlameIcon className="w-5 h-5 text-orange-400" />
              <span className={isDarkMode ? 'text-white/90' : 'text-slate-900/90'} data-testid="text-streak">7 day streak</span>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className={isDarkMode ? 'text-white/90' : 'text-slate-900/90'} data-testid="text-minutes">120 minutes of mindfulness</span>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
