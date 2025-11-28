import { Layout } from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { Wind, Music, Heart, Clock, Gamepad2, Bot, Users, Shield, MessageSquare, Trophy, Calendar } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  const { isDarkMode, isBreathing, setIsBreathing } = useTheme();

  const features = [
    { icon: Wind, title: "Breathing Exercises", description: "Guided breathing patterns for stress relief", link: "/meditation" },
    { icon: Music, title: "Ambient Sounds", description: "Calming nature and meditation sounds", link: "/playlist" },
    { icon: Heart, title: "Mood Tracking", description: "Monitor your emotional well-being", link: "/assessment" },
    { icon: Clock, title: "Timer Sessions", description: "Customizable meditation timers", link: "/meditation" }
  ];

  const games = [
    { title: "Zen Garden", description: "Create and maintain your digital garden", duration: "5-15 min" },
    { title: "Mandala Art", description: "Create calming mandala patterns with brush controls", duration: "15-30 min" },
    { title: "Color Flow", description: "Relaxing color matching puzzle", duration: "10-20 min" },
    { title: "Mindful Maze", description: "Navigate through 10 peaceful maze patterns", duration: "5-10 min" },
    { title: "Calm Tetris", description: "Meditative block-stacking game", duration: "10-15 min" }
  ];

  const communityFeatures = [
    { icon: Bot, title: "AI Therapy Chat", description: "24/7 support from our AI counselor", link: "/chat" },
    { icon: Users, title: "Support Circles", description: "Connect with others on similar journeys", link: "/circles" },
    { icon: Shield, title: "Dear Diary", description: "your safe journaling haven", link: "/journal" },
    { icon: MessageSquare, title: "Group Sessions", description: "Guided group meditation and discussions", link: "/sessions" }
  ];

  return (
    <Layout showStats>
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-32">
        <div className="text-center mb-20">
          <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-4xl md:text-6xl mb-6`}>
            Find Your Inner Peace
          </h2>
          <p className={`${isDarkMode ? 'text-white/80' : 'text-slate-700'} text-lg md:text-xl mb-12 max-w-2xl mx-auto`}>
            Experience tranquility through meditation, games, and community support.
          </p>
          <Button
            onClick={() => setIsBreathing(!isBreathing)}
            size="lg"
            className={`${isDarkMode ? 'bg-white/10 text-white/90 hover:bg-white/20 border-white/10' : 'bg-slate-900/10 text-slate-900/90 hover:bg-slate-900/20 border-slate-900/10'} px-8 py-6 text-lg tracking-wide transition-all duration-300 hover:-translate-y-0.5 border`}
            data-testid="button-toggle-breathing"
          >
            Begin Your Journey
          </Button>
        </div>

        <div className="flex justify-center gap-4 mb-20 flex-wrap">
          {[
            { path: '/meditation', title: 'Breathe', icon: Wind },
            { path: '/meditation', title: 'Meditate', icon: Heart },
            { path: '/goals', title: 'Focus', icon: Clock },
          ].map((mode) => (
            <Link key={mode.title} href={mode.path}>
              <Button
                variant="ghost"
                className={`gap-2 px-6 py-3 ${isDarkMode ? 'bg-white/5 text-white/70 hover:bg-white/10 border-white/10' : 'bg-slate-900/5 text-slate-900/70 hover:bg-slate-900/10 border-slate-900/10'} border`}
                data-testid={`button-mode-${mode.title.toLowerCase()}`}
              >
                <mode.icon className="w-5 h-5" />
                {mode.title}
              </Button>
            </Link>
          ))}
        </div>

        <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} font-serif text-3xl mb-8`}>Core Features</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20">
          {features.map((feature, index) => (
            <Link key={index} href={feature.link} data-testid={`link-feature-${index}`}>
              <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-md p-6 hover-elevate active-elevate-2 cursor-pointer transition-all h-full`} data-testid={`card-feature-${index}`}>
                <feature.icon className={`w-6 h-6 ${isDarkMode ? 'text-white/90' : 'text-slate-900/90'}`} />
                <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} text-xl mb-2 mt-4`} data-testid={`text-feature-title-${index}`}>{feature.title}</h3>
                <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>{feature.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="flex justify-between items-center mb-8">
          <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} font-serif text-3xl`}>Relaxation Games</h3>
          <Link href="/games">
            <Button variant="outline" className="gap-2" data-testid="button-all-games">
              View All Games
              <Gamepad2 className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20">
          {games.map((game, index) => (
            <Link key={index} href="/games" data-testid={`link-game-${index}`}>
              <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-md p-6 hover-elevate active-elevate-2 cursor-pointer transition-all h-full`} data-testid={`card-game-${index}`}>
                <Gamepad2 className={`w-6 h-6 ${isDarkMode ? 'text-white/90' : 'text-slate-900/90'}`} />
                <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} text-xl mb-2 mt-4`} data-testid={`text-game-title-${index}`}>{game.title}</h3>
                <p className={`${isDarkMode ? 'text-white/70' : 'text-slate-700'} mb-3`}>{game.description}</p>
                <span className={`text-sm ${isDarkMode ? 'text-white/50' : 'text-slate-600'}`}>{game.duration}</span>
              </Card>
            </Link>
          ))}
        </div>

        <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} font-serif text-3xl mb-8`}>Community & Support</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20">
          {communityFeatures.map((feature, index) => (
            <Link key={index} href={feature.link} data-testid={`link-community-${index}`}>
              <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-md p-6 hover-elevate active-elevate-2 cursor-pointer transition-all h-full`} data-testid={`card-community-${index}`}>
                <feature.icon className={`w-6 h-6 ${isDarkMode ? 'text-white/90' : 'text-slate-900/90'}`} />
                <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} text-xl mb-2 mt-4`} data-testid={`text-community-title-${index}`}>{feature.title}</h3>
                <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>{feature.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className={`text-center py-12 rounded-2xl ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-md border`}>
          <Trophy className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-white/90' : 'text-slate-900/90'}`} />
          <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} font-serif text-2xl mb-3`}>Join Our Community</h3>
          <p className={`${isDarkMode ? 'text-white/70' : 'text-slate-700'} mb-6 max-w-md mx-auto`}>
            Over 50,000 members finding peace and support together
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2" data-testid="button-get-started">
              <Calendar className="w-5 h-5" />
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
