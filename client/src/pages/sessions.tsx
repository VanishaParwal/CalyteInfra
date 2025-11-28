import { Layout } from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Clock, UserPlus } from 'lucide-react';

export default function Sessions() {
  const { isDarkMode } = useTheme();
  const [sessions] = useState([
    {
      id: 1,
      title: 'Morning Mindfulness Circle',
      host: 'Sarah Johnson',
      scheduledTime: '2024-01-20T08:00:00',
      duration: 30,
      participants: 12,
      maxParticipants: 20,
      description: 'Start your day with guided meditation and group reflection',
      category: 'Meditation',
    },
    {
      id: 2,
      title: 'Anxiety Support Session',
      host: 'Dr. Michael Chen',
      scheduledTime: '2024-01-20T18:00:00',
      duration: 60,
      participants: 8,
      maxParticipants: 15,
      description: 'Share experiences and coping strategies in a safe space',
      category: 'Support',
    },
    {
      id: 3,
      title: 'Evening Relaxation',
      host: 'Emma Williams',
      scheduledTime: '2024-01-20T20:00:00',
      duration: 45,
      participants: 15,
      maxParticipants: 25,
      description: 'Wind down with breathing exercises and gentle meditation',
      category: 'Relaxation',
    },
    {
      id: 4,
      title: 'Stress Management Workshop',
      host: 'James Anderson',
      scheduledTime: '2024-01-21T12:00:00',
      duration: 90,
      participants: 6,
      maxParticipants: 12,
      description: 'Learn practical techniques for managing daily stress',
      category: 'Workshop',
    },
  ]);

  const [joined, setJoined] = useState<number[]>([1]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleJoin = (id: number) => {
    if (joined.includes(id)) {
      setJoined(joined.filter(sessionId => sessionId !== id));
    } else {
      setJoined([...joined, id]);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-32">
        <div className="mb-8">
          <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-4xl mb-2`}>
            Group Sessions
          </h2>
          <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
            Join guided meditation sessions and support groups
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {sessions.map((session) => {
            const isJoined = joined.includes(session.id);
            const spotsLeft = session.maxParticipants - session.participants;
            
            return (
              <Card key={session.id} className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-6`}>
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="text-xs">
                    {session.category}
                  </Badge>
                  {isJoined && (
                    <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                      Joined
                    </Badge>
                  )}
                </div>

                <h3 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-xl font-medium mb-2`}>
                  {session.title}
                </h3>
                
                <p className={`${isDarkMode ? 'text-white/70' : 'text-slate-700'} mb-4 text-sm`}>
                  {session.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Users className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`}>
                      Hosted by {session.host}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`}>
                      {formatDateTime(session.scheduledTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`}>
                      {session.duration} minutes
                    </span>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-md rounded-lg p-4 mb-4 border`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>
                      Participants
                    </span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>
                      {session.participants} / {session.maxParticipants}
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-slate-900/10'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${(session.participants / session.maxParticipants) * 100}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                    {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} remaining
                  </p>
                </div>

                <Button
                  onClick={() => handleJoin(session.id)}
                  variant={isJoined ? 'outline' : 'default'}
                  className="w-full gap-2"
                  data-testid={`button-join-session-${session.id}`}
                >
                  <UserPlus className="w-4 h-4" />
                  {isJoined ? 'Leave Session' : 'Join Session'}
                </Button>
              </Card>
            );
          })}
        </div>

        <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-8 text-center mt-12`}>
          <Users className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`} />
          <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} text-xl font-medium mb-2`}>
            Want to host a session?
          </h3>
          <p className={`${isDarkMode ? 'text-white/70' : 'text-slate-700'} mb-6`}>
            Share your expertise and help others on their wellness journey
          </p>
          <Button variant="outline" data-testid="button-host-session">
            Become a Host
          </Button>
        </Card>
      </div>
    </Layout>
  );
}
