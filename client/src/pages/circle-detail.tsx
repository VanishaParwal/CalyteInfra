import { Layout } from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useParams, useLocation } from 'wouter';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Users, Lock, Globe, MessageSquare, Heart, Send, ArrowLeft } from 'lucide-react';

export default function CircleDetail() {
  const { isDarkMode } = useTheme();
  const { id } = useParams();
  const [, navigate] = useLocation();
  
  // Mock circle data - in real app, fetch from API
  const mockCircles: Record<string, any> = {
    '1': {
      id: 1,
      name: 'Anxiety Warriors',
      description: 'A supportive community for those managing anxiety disorders',
      topic: 'Anxiety',
      memberCount: 156,
      isPrivate: false,
      createdAt: new Date(),
    },
    '4': {
      id: 4,
      name: 'Meditation Beginners',
      description: 'Learn meditation basics with fellow beginners',
      topic: 'Meditation',
      memberCount: 124,
      isPrivate: false,
      createdAt: new Date(),
    },
  };

  const mockDiscussions: Record<string, any[]> = {
    '1': [
      { id: 1, author: 'Sarah M.', text: 'Just completed my daily meditation. Feeling so much calmer!', likes: 24, timestamp: new Date() },
      { id: 2, author: 'James L.', text: 'Anyone struggling with anxiety in the morning? Would love to share coping strategies.', likes: 18, timestamp: new Date() },
      { id: 3, author: 'Emma R.', text: 'The breathing exercises really help me during panic attacks.', likes: 12, timestamp: new Date() },
      { id: 4, author: 'David K.', text: 'How do you all manage anxiety at work?', likes: 9, timestamp: new Date() },
    ],
    '4': [
      { id: 1, author: 'Maya P.', text: 'Started my meditation journey today! Excited to learn with you all.', likes: 12, timestamp: new Date() },
      { id: 2, author: 'David R.', text: 'Meditation for 5 minutes daily has changed my perspective on stress.', likes: 31, timestamp: new Date() },
      { id: 3, author: 'Lisa T.', text: 'What meditation app do you recommend for beginners?', likes: 15, timestamp: new Date() },
    ],
  };

  const circle = mockCircles[id!];
  const [discussions, setDiscussions] = useState(mockDiscussions[id!] || []);
  const [newMessage, setNewMessage] = useState('');
  const [liked, setLiked] = useState<number[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  if (!circle) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
          <Button variant="outline" onClick={() => navigate('/circles')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Circles
          </Button>
          <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-8 text-center`}>
            <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
              Circle not found
            </p>
          </Card>
        </div>
      </Layout>
    );
  }

  const handlePostMessage = async () => {
    if (!newMessage.trim()) return;

    setIsPosting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/circles/${id}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to post message');
      }

      const data = await response.json();
      
      // Add new discussion to the list
      const newDiscussion = {
        id: data.id || discussions.length + 1,
        author: 'You',
        text: newMessage,
        likes: 0,
        timestamp: new Date(),
      };

      setDiscussions([newDiscussion, ...discussions]);
      setNewMessage('');
    } catch (error) {
      console.error('Error posting message:', error);
      alert('Failed to post message. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = (discussionId: number) => {
    if (liked.includes(discussionId)) {
      setLiked(liked.filter(id => id !== discussionId));
    } else {
      setLiked([...liked, discussionId]);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
        <Button variant="outline" onClick={() => navigate('/circles')} className="mb-6" data-testid="button-back-circles">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Circles
        </Button>

        {/* Circle Header */}
        <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-8 mb-8`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-4xl mb-2`}>
                {circle.name}
              </h1>
              <Badge variant="outline" className="mb-4">
                {circle.topic}
              </Badge>
            </div>
            <div className="text-right">
              {circle.isPrivate ? (
                <Lock className={`w-6 h-6 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`} />
              ) : (
                <Globe className={`w-6 h-6 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`} />
              )}
            </div>
          </div>

          <p className={`${isDarkMode ? 'text-white/80' : 'text-slate-800'} text-lg mb-6`}>
            {circle.description}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Users className={`w-5 h-5 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`} />
              <span className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
                {circle.memberCount} {circle.memberCount === 1 ? 'member' : 'members'}
              </span>
            </div>
          </div>
        </Card>

        {/* Write Discussion */}
        <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-6 mb-8`}>
          <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} text-lg font-medium mb-4`}>
            Share Your Thoughts
          </h3>
          <Textarea
            placeholder="Write a message to the community..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="mb-4 min-h-24"
            data-testid="input-discussion-message"
            disabled={isPosting}
          />
          <Button 
            disabled={!newMessage.trim() || isPosting}
            className="gap-2"
            onClick={handlePostMessage}
            data-testid="button-post-discussion"
          >
            <Send className="w-4 h-4" />
            {isPosting ? 'Posting...' : 'Post Message'}
          </Button>
        </Card>

        {/* Discussions */}
        <div>
          <h2 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} text-2xl font-serif mb-6`}>
            Discussions ({discussions.length})
          </h2>

          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Card 
                key={discussion.id}
                className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-6`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} font-medium`}>
                      {discussion.author}
                    </p>
                    <p className={`${isDarkMode ? 'text-white/60' : 'text-slate-600'} text-sm`}>
                      {discussion.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className={`${isDarkMode ? 'text-white/80' : 'text-slate-800'} mb-4`}>
                  {discussion.text}
                </p>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(discussion.id)}
                  className={`gap-1 ${liked.includes(discussion.id) ? 'text-red-500' : ''}`}
                  data-testid={`button-like-discussion-${discussion.id}`}
                >
                  <Heart 
                    className={`w-4 h-4 ${liked.includes(discussion.id) ? 'fill-current' : ''}`}
                  />
                  {discussion.likes + (liked.includes(discussion.id) ? 1 : 0)}
                </Button>
              </Card>
            ))}

            {discussions.length === 0 && (
              <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-8 text-center`}>
                <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`} />
                <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
                  No discussions yet. Be the first to start a conversation!
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
