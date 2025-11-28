import { Layout } from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Lock, Globe, UserPlus, MessageSquare, Heart } from 'lucide-react';

export default function Circles() {
  const { isDarkMode } = useTheme();
  const [, navigate] = useLocation();
  const [circles] = useState([
    {
      id: 1,
      name: 'Anxiety Warriors',
      description: 'A supportive community for those managing anxiety disorders',
      topic: 'Anxiety',
      memberCount: 156,
      isPrivate: false,
    },
    {
      id: 2,
      name: 'Mindful Parents',
      description: 'Parents practicing mindfulness while raising children',
      topic: 'Parenting',
      memberCount: 89,
      isPrivate: false,
    },
    {
      id: 3,
      name: 'Depression Support',
      description: 'Safe space for sharing experiences with depression',
      topic: 'Depression',
      memberCount: 203,
      isPrivate: true,
    },
    {
      id: 4,
      name: 'Meditation Beginners',
      description: 'Learn meditation basics with fellow beginners',
      topic: 'Meditation',
      memberCount: 124,
      isPrivate: false,
    },
    {
      id: 5,
      name: 'Work-Life Balance',
      description: 'Professionals seeking harmony between work and personal life',
      topic: 'Lifestyle',
      memberCount: 92,
      isPrivate: false,
    },
    {
      id: 6,
      name: 'Grief & Loss',
      description: 'Compassionate support for those experiencing loss',
      topic: 'Grief',
      memberCount: 67,
      isPrivate: true,
    },
  ]);

  const [joined, setJoined] = useState<number[]>([1, 4]);

  const handleJoin = (id: number) => {
    if (joined.includes(id)) {
      setJoined(joined.filter(circleId => circleId !== id));
    } else {
      setJoined([...joined, id]);
    }
  };

  const getJoinedCircles = () => circles.filter(c => joined.includes(c.id));

  const mockDiscussions: Record<number, { author: string; text: string; likes: number }[]> = {
    1: [
      { author: 'Sarah M.', text: 'Just completed my daily meditation. Feeling so much calmer!', likes: 24 },
      { author: 'James L.', text: 'Anyone struggling with anxiety in the morning? Would love to share coping strategies.', likes: 18 },
    ],
    4: [
      { author: 'Maya P.', text: 'Started my meditation journey today! Excited to learn with you all.', likes: 12 },
      { author: 'David R.', text: 'Meditation for 5 minutes daily has changed my perspective on stress.', likes: 31 },
    ],
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-32">
        <div className="mb-8">
          <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-4xl mb-2`}>
            Support Circles
          </h2>
          <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
            Find your community and connect with others on similar journeys
          </p>
        </div>

        {/* My Circles Section */}
        {getJoinedCircles().length > 0 && (
          <div className="mb-12">
            <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} text-2xl font-serif mb-6`}>
              My Circles ({getJoinedCircles().length})
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
              {getJoinedCircles().map((circle) => (
                <Card key={`my-${circle.id}`} className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-lg font-medium`}>
                        {circle.name}
                      </h4>
                      <Badge variant="outline" className="text-xs mt-2">
                        {circle.topic}
                      </Badge>
                    </div>
                  </div>

                  <div className={`${isDarkMode ? 'bg-white/5' : 'bg-slate-900/5'} rounded-lg p-4 mb-4 space-y-3`}>
                    <p className={`${isDarkMode ? 'text-white/70' : 'text-slate-700'} text-sm font-medium flex items-center gap-2`}>
                      <MessageSquare className="w-4 h-4" /> Recent Discussions
                    </p>
                    {mockDiscussions[circle.id]?.map((discussion, idx) => (
                      <div key={idx} className={`${isDarkMode ? 'border-white/10' : 'border-slate-200'} border-t pt-3`}>
                        <p className={`${isDarkMode ? 'text-white/60' : 'text-slate-600'} text-xs font-medium`}>
                          {discussion.author}
                        </p>
                        <p className={`${isDarkMode ? 'text-white/80' : 'text-slate-800'} text-sm my-1`}>
                          {discussion.text}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-red-500/70">
                          <Heart className="w-3 h-3" /> {discussion.likes}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm mb-4">
                    <Users className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`} />
                    <span className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
                      {circle.memberCount} members
                    </span>
                  </div>

                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate(`/circles/${circle.id}`)}
                    data-testid={`button-view-circle-${circle.id}`}
                  >
                    View Full Circle
                  </Button>
                </Card>
              ))}
            </div>
            <div className={`h-px ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'} mb-12`}></div>
          </div>
        )}

        {/* Discover Circles */}
        <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} text-2xl font-serif mb-6`}>
          Discover Circles
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {circles.map((circle) => {
            const isJoined = joined.includes(circle.id);
            
            return (
              <Card key={circle.id} className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-6 flex flex-col`}>
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline" className="text-xs">
                    {circle.topic}
                  </Badge>
                  <div className="flex gap-2">
                    {circle.isPrivate ? (
                      <Lock className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`} />
                    ) : (
                      <Globe className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`} />
                    )}
                    {isJoined && (
                      <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                        Joined
                      </Badge>
                    )}
                  </div>
                </div>

                <h3 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-xl font-medium mb-3`}>
                  {circle.name}
                </h3>
                
                <p className={`${isDarkMode ? 'text-white/70' : 'text-slate-700'} mb-6 text-sm flex-1`}>
                  {circle.description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <Users className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`}>
                    {circle.memberCount} {circle.memberCount === 1 ? 'member' : 'members'}
                  </span>
                </div>

                <Button
                  onClick={() => handleJoin(circle.id)}
                  variant={isJoined ? 'outline' : 'default'}
                  className="w-full gap-2"
                  data-testid={`button-join-circle-${circle.id}`}
                >
                  <UserPlus className="w-4 h-4" />
                  {isJoined ? 'Leave Circle' : circle.isPrivate ? 'Request to Join' : 'Join Circle'}
                </Button>
              </Card>
            );
          })}
        </div>

      </div>
    </Layout>
  );
}
