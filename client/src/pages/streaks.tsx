import { Layout } from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/card';
import { Flame, Calendar, Trophy, Target, TrendingUp } from 'lucide-react';

export default function Streaks() {
  const { isDarkMode } = useTheme();

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentStreak = 7;
  const longestStreak = 21;
  const totalDays = 45;

  const streakCalendar = [
    [true, true, true, true, true, true, true],
    [true, true, true, false, true, true, true],
    [true, true, true, true, true, true, false],
    [true, true, false, false, true, true, true],
  ];

  const achievements = [
    { title: 'First Week', description: 'Complete your first 7-day streak', achieved: true, icon: Flame },
    { title: 'Steady Sailor', description: 'Maintain a 14-day streak', achieved: true, icon: TrendingUp },
    { title: 'Month Master', description: 'Complete a 30-day streak', achieved: false, icon: Calendar },
    { title: 'Century Star', description: 'Complete 100 days of mindfulness', achieved: false, icon: Trophy },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
        <div className="text-center mb-12">
          <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-4xl mb-4`}>
            Your Streak
          </h2>
          <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
            Track your daily mindfulness journey
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-6 text-center`}>
            <Flame className="w-12 h-12 mx-auto mb-4 text-orange-400" />
            <div className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-4xl font-bold mb-2`} data-testid="text-current-streak">
              {currentStreak}
            </div>
            <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>Current Streak</p>
          </Card>

          <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-6 text-center`}>
            <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <div className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-4xl font-bold mb-2`} data-testid="text-longest-streak">
              {longestStreak}
            </div>
            <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>Longest Streak</p>
          </Card>

          <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-6 text-center`}>
            <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <div className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-4xl font-bold mb-2`} data-testid="text-total-days">
              {totalDays}
            </div>
            <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>Total Days</p>
          </Card>
        </div>

        <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-8 mb-12`}>
          <h3 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-xl font-medium mb-6`}>
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {weekDays.map((day) => (
                <span key={day} className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                  {day}
                </span>
              ))}
            </div>
            {streakCalendar.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-2">
                {week.map((completed, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                      completed
                        ? 'bg-gradient-to-br from-orange-400 to-red-500'
                        : isDarkMode ? 'bg-white/5' : 'bg-slate-900/5'
                    }`}
                  >
                    {completed && <Flame className="w-4 h-4 text-white" />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>

        <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} font-serif text-2xl mb-6`}>Achievements</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => (
            <Card key={index} className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-6 ${!achievement.achieved ? 'opacity-50' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  achievement.achieved
                    ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20'
                    : isDarkMode ? 'bg-white/5' : 'bg-slate-900/5'
                }`}>
                  <achievement.icon className={`w-6 h-6 ${achievement.achieved ? 'text-yellow-400' : isDarkMode ? 'text-white/30' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h4 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} font-medium mb-1`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                    {achievement.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
