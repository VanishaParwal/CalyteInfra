import { Layout } from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wind, Heart, Moon, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Meditation() {
  const { isDarkMode } = useTheme();
  const [activeMode, setActiveMode] = useState<'breathe' | 'meditate' | 'sleep'>('breathe');
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(activeMode === 'sleep' ? 8 : 5);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [sleepStartTime, setSleepStartTime] = useState<number | null>(null);
  const [totalSleepTime, setTotalSleepTime] = useState(0);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (!isPlaying) return;

    // Track sleep start time
    if (activeMode === 'sleep' && sleepStartTime === null) {
      setSleepStartTime(Date.now());
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && activeMode !== 'sleep') {
          setIsPlaying(false);
          return duration * 60;
        }
        return activeMode === 'sleep' ? prev + 1 : prev - 1;
      });

      // Update total sleep time for sleep mode
      if (activeMode === 'sleep') {
        setTotalSleepTime((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration, activeMode, sleepStartTime]);

  useEffect(() => {
    if (!isPlaying || activeMode !== 'breathe') return;

    const breathCycle = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        return 'inhale';
      });
    }, 4000);

    return () => clearInterval(breathCycle);
  }, [isPlaying, activeMode]);

  const modes = [
    { id: 'breathe' as const, title: 'Breathe', icon: Wind, description: 'Guided breathing exercises' },
    { id: 'meditate' as const, title: 'Meditate', icon: Heart, description: 'Mindfulness meditation' },
    { id: 'sleep' as const, title: 'Sleep', icon: Moon, description: 'Relaxation for better sleep' },
  ];

  const formatTime = (seconds: number, isSleep: boolean = false) => {
    if (isSleep) {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
        <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-4xl mb-8 text-center`}>
          Meditation Practice
        </h2>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {modes.map((mode) => (
            <Button
              key={mode.id}
              onClick={() => {
                setActiveMode(mode.id);
                setIsPlaying(false);
                if (mode.id === 'sleep') {
                  setTotalSleepTime(0);
                  setSleepStartTime(null);
                } else {
                  setTimeLeft(duration * 60);
                }
              }}
              variant="ghost"
              className={`gap-2 px-6 py-3 ${
                activeMode === mode.id
                  ? isDarkMode ? 'bg-white/20 text-white border-white/20' : 'bg-slate-900/20 text-slate-900 border-slate-900/20'
                  : isDarkMode ? 'bg-white/5 text-white/70 hover:bg-white/10 border-white/10' : 'bg-slate-900/5 text-slate-900/70 hover:bg-slate-900/10 border-slate-900/10'
              } border`}
              data-testid={`button-mode-${mode.id}`}
            >
              <mode.icon className="w-5 h-5" />
              {mode.title}
            </Button>
          ))}
        </div>

        <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-8 mb-8`}>
          <div className="text-center mb-8">
            {modes.find(m => m.id === activeMode)?.icon && (
              <div className="mb-6">
                {(() => {
                  const Icon = modes.find(m => m.id === activeMode)!.icon;
                  return <Icon className={`w-20 h-20 mx-auto ${isDarkMode ? 'text-white/90' : 'text-slate-900/90'}`} />;
                })()}
              </div>
            )}
            <h3 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-3xl mb-2`}>
              {modes.find(m => m.id === activeMode)?.title}
            </h3>
            <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
              {modes.find(m => m.id === activeMode)?.description}
            </p>
          </div>

          {activeMode === 'breathe' && isPlaying && (
            <div className="mb-8 text-center">
              <div className={`text-2xl font-medium mb-4 ${
                breathPhase === 'inhale' ? 'text-blue-400' :
                breathPhase === 'hold' ? 'text-purple-400' :
                'text-green-400'
              }`}>
                {breathPhase === 'inhale' ? 'Breathe In...' :
                 breathPhase === 'hold' ? 'Hold...' :
                 'Breathe Out...'}
              </div>
              <div className={`w-32 h-32 mx-auto rounded-full transition-all duration-4000 ${
                breathPhase === 'inhale' ? 'scale-125' :
                breathPhase === 'hold' ? 'scale-125' :
                'scale-75'
              } ${isDarkMode ? 'bg-white/10' : 'bg-slate-900/10'}`} />
            </div>
          )}

          <div className="text-center mb-8">
            <div className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-6xl font-bold mb-4 font-mono`} data-testid="text-timer">
              {activeMode === 'sleep' ? formatTime(totalSleepTime, true) : formatTime(timeLeft)}
            </div>
            {activeMode !== 'sleep' && <Progress value={progress} className="h-3 mb-6" />}
            {activeMode === 'sleep' && isPlaying && (
              <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-600'} mb-4`}>
                Sleep tracking active
              </p>
            )}
          </div>

          {activeMode !== 'sleep' && (
            <div className="flex items-center justify-center gap-4 mb-8">
              <Button
                onClick={() => setDuration(Math.max(1, duration - 5))}
                variant="outline"
                size="icon"
                disabled={isPlaying}
                data-testid="button-decrease-duration"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} text-lg font-medium w-24 text-center`} data-testid="text-duration">
                {duration} min
              </span>
              <Button
                onClick={() => setDuration(duration + 5)}
                variant="outline"
                size="icon"
                disabled={isPlaying}
                data-testid="button-increase-duration"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 gap-2"
              size="lg"
              data-testid="button-play-pause"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? 'Pause' : 'Start'}
            </Button>
            <Button
              onClick={() => {
                setIsPlaying(false);
                if (activeMode === 'sleep') {
                  setTotalSleepTime(0);
                  setSleepStartTime(null);
                } else {
                  setTimeLeft(duration * 60);
                }
              }}
              variant="outline"
              size="lg"
              className="gap-2"
              data-testid="button-reset"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
