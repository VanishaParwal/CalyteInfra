import { Layout } from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Goals() {
  const { isDarkMode } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Daily Meditation',
      description: 'Meditate for 10 minutes every day',
      targetDays: 30,
      currentProgress: 7,
      completed: false,
    },
    {
      id: 2,
      title: 'Join Support Circles',
      description: 'Participate in 3 different support circles',
      targetDays: 14,
      currentProgress: 2,
      completed: false,
    },
    {
      id: 3,
      title: 'Mindful Walking',
      description: 'Take a mindful walk every morning',
      targetDays: 21,
      currentProgress: 21,
      completed: true,
    },
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDays: 7,
  });

  const handleAddGoal = () => {
    if (!newGoal.title) return;
    
    setGoals([
      ...goals,
      {
        id: Date.now(),
        ...newGoal,
        currentProgress: 0,
        completed: false,
      },
    ]);
    setNewGoal({ title: '', description: '', targetDays: 7 });
    setIsDialogOpen(false);
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const handleToggleComplete = (id: number) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, completed: !goal.completed, currentProgress: goal.completed ? 0 : goal.targetDays }
        : goal
    ));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-4xl mb-2`}>
              Your Goals
            </h2>
            <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
              Track your progress and achieve your wellness objectives
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-goal">
                <Plus className="w-5 h-5" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className={`${isDarkMode ? 'bg-slate-900/95 border-white/10 text-white' : 'bg-white/95 border-slate-900/10'} backdrop-blur-xl`}>
              <DialogHeader>
                <DialogTitle className={isDarkMode ? 'text-white/95' : 'text-slate-900'}>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className={isDarkMode ? 'text-white/90' : 'text-slate-900'}>Goal Title</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Daily Meditation"
                    className={`${isDarkMode ? 'bg-white/5 border-white/10 text-white/90' : 'bg-slate-900/5 border-slate-900/10'}`}
                    data-testid="input-goal-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className={isDarkMode ? 'text-white/90' : 'text-slate-900'}>Description</Label>
                  <Textarea
                    id="description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Describe your goal..."
                    className={`${isDarkMode ? 'bg-white/5 border-white/10 text-white/90' : 'bg-slate-900/5 border-slate-900/10'}`}
                    data-testid="textarea-goal-description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetDays" className={isDarkMode ? 'text-white/90' : 'text-slate-900'}>Target Days</Label>
                  <Input
                    id="targetDays"
                    type="number"
                    value={newGoal.targetDays}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDays: parseInt(e.target.value) })}
                    min="1"
                    className={`${isDarkMode ? 'bg-white/5 border-white/10 text-white/90' : 'bg-slate-900/5 border-slate-900/10'}`}
                    data-testid="input-goal-target"
                  />
                </div>
                <Button onClick={handleAddGoal} className="w-full" data-testid="button-save-goal">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {goals.map((goal) => (
            <Card key={goal.id} className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <button
                    onClick={() => handleToggleComplete(goal.id)}
                    className={`mt-1 transition-colors ${goal.completed ? 'text-green-400' : isDarkMode ? 'text-white/30' : 'text-slate-900/30'}`}
                    data-testid={`button-toggle-goal-${goal.id}`}
                  >
                    {goal.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </button>
                  <div className="flex-1">
                    <h3 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-xl font-medium mb-2 ${goal.completed ? 'line-through opacity-60' : ''}`}>
                      {goal.title}
                    </h3>
                    <p className={`${isDarkMode ? 'text-white/70' : 'text-slate-700'} mb-4 ${goal.completed ? 'opacity-60' : ''}`}>
                      {goal.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>
                          Progress: {goal.currentProgress} / {goal.targetDays} days
                        </span>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>
                          {Math.round((goal.currentProgress / goal.targetDays) * 100)}%
                        </span>
                      </div>
                      <Progress value={(goal.currentProgress / goal.targetDays) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleDeleteGoal(goal.id)}
                  variant="ghost"
                  size="icon"
                  className={`${isDarkMode ? 'text-white/60 hover:text-white/90' : 'text-slate-600 hover:text-slate-900'}`}
                  data-testid={`button-delete-goal-${goal.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}

          {goals.length === 0 && (
            <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-12 text-center`}>
              <Target className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-white/30' : 'text-slate-900/30'}`} />
              <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} text-xl mb-2`}>No goals yet</h3>
              <p className={`${isDarkMode ? 'text-white/70' : 'text-slate-700'} mb-6`}>
                Create your first wellness goal to start tracking progress
              </p>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
