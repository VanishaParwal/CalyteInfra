import { Moon, Sun, Volume2, VolumeX, User, Menu, Home, Heart, ClipboardList, Brain, Target, MessageSquare, Users, Flame as FlameIcon, Music } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Link, useLocation } from 'wouter';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const { isDarkMode, setIsDarkMode, isAudioPlaying, setIsAudioPlaying } = useTheme();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/meditation', icon: Heart, label: 'Meditate' },
    { path: '/assessment', icon: ClipboardList, label: 'Assessment' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/sessions', icon: Users, label: 'Sessions' },
    { path: '/circles', icon: Brain, label: 'Circles' },
    { path: '/streaks', icon: FlameIcon, label: 'Streaks' },
    { path: '/playlist', icon: Music, label: 'Music' },
  ];

  return (
    <nav className="relative z-10 w-full p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" data-testid="link-home">
          <h1 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-2xl md:text-3xl cursor-pointer hover:opacity-80 transition-opacity`}>
            Calyte
          </h1>
        </Link>

        <div className="hidden lg:flex items-center gap-3">
          {navItems.slice(1).map((item) => (
            <Link key={item.path} href={item.path} data-testid={`link-${item.label.toLowerCase()}`}>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${
                  location === item.path
                    ? isDarkMode ? 'bg-white/20 text-white' : 'bg-slate-900/20 text-slate-900'
                    : isDarkMode ? 'text-white/70' : 'text-slate-900/70'
                }`}
                data-testid={`button-nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden xl:inline">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAudioPlaying(!isAudioPlaying)} 
            className={`p-2 rounded-lg transition-all hover-elevate active-elevate-2 ${isDarkMode ? 'bg-white/10 text-white/90' : 'bg-slate-900/10 text-slate-900/90'}`}
            data-testid="button-audio-toggle"
          >
            {isAudioPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`p-2 rounded-lg transition-all hover-elevate active-elevate-2 ${isDarkMode ? 'bg-white/10 text-white/90' : 'bg-slate-900/10 text-slate-900/90'}`}
            data-testid="button-theme-toggle"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link href="/profile" data-testid="link-profile">
            <button 
              className={`p-2 rounded-lg transition-all hover-elevate active-elevate-2 ${
                location === '/profile'
                  ? isDarkMode ? 'bg-white/20 text-white/90' : 'bg-slate-900/20 text-slate-900/90'
                  : isDarkMode ? 'bg-white/10 text-white/90' : 'bg-slate-900/10 text-slate-900/90'
              }`}
              data-testid="button-profile"
            >
              <User className="w-5 h-5" />
            </button>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all hover-elevate active-elevate-2 ${isDarkMode ? 'bg-white/10 text-white/90' : 'bg-slate-900/10 text-slate-900/90'}`}
            data-testid="button-mobile-menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={`lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl border backdrop-blur-xl ${
          isDarkMode ? 'bg-slate-900/95 border-white/10' : 'bg-white/95 border-slate-900/10'
        }`}>
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`link-mobile-${item.label.toLowerCase()}`}>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover-elevate ${
                    location === item.path
                      ? isDarkMode ? 'bg-white/20 text-white' : 'bg-slate-900/20 text-slate-900'
                      : isDarkMode ? 'text-white/70' : 'text-slate-900/70'
                  }`}
                  data-testid={`button-mobile-${item.label.toLowerCase()}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
