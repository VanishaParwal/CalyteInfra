import { Layout } from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { LogIn, UserPlus } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import * as api from '@/services/api';

export default function Login() {
  const { isDarkMode } = useTheme();
  const [, setLocation] = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      return await api.login(data);
    },
    onSuccess: (data) => {
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('username', data.user.username);
      toast({
        title: 'Welcome back!',
        description: 'Successfully logged in.',
      });
      setLocation('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid username or password',
        variant: 'destructive',
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: { username: string; email: string; password: string; fullName: string }) => {
      return await api.register(data);
    },
    onSuccess: (data) => {
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('username', data.user.username);
      toast({
        title: 'Account created!',
        description: 'Welcome to Calyte.',
      });
      setLocation('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Signup failed',
        description: error.message || 'Username may already exist',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (!formData.fullName.trim()) {
        toast({ title: 'Error', description: 'Full name is required', variant: 'destructive' });
        return;
      }
      signupMutation.mutate(formData);
    } else {
      loginMutation.mutate({ username: formData.username, password: formData.password });
    }
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending;

  return (
    <Layout>
      <div className="max-w-md mx-auto px-6 pt-20 pb-32">
        <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-8`}>
          <div className="text-center mb-8">
            <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-4xl mb-3`}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
              {isSignUp ? 'Begin your journey to inner peace' : 'Continue your path to mindfulness'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullname" className={isDarkMode ? 'text-white/90' : 'text-slate-900'}>
                  Full Name
                </Label>
                <Input
                  id="fullname"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`${isDarkMode ? 'bg-white/5 border-white/10 text-white/90 placeholder:text-white/40' : 'bg-slate-900/5 border-slate-900/10 text-slate-900 placeholder:text-slate-500'} backdrop-blur-md`}
                  placeholder="Enter your full name"
                  required={isSignUp}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username" className={isDarkMode ? 'text-white/90' : 'text-slate-900'}>
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`${isDarkMode ? 'bg-white/5 border-white/10 text-white/90 placeholder:text-white/40' : 'bg-slate-900/5 border-slate-900/10 text-slate-900 placeholder:text-slate-500'} backdrop-blur-md`}
                placeholder="Enter your username"
                required
                data-testid="input-username"
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="email" className={isDarkMode ? 'text-white/90' : 'text-slate-900'}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`${isDarkMode ? 'bg-white/5 border-white/10 text-white/90 placeholder:text-white/40' : 'bg-slate-900/5 border-slate-900/10 text-slate-900 placeholder:text-slate-500'} backdrop-blur-md`}
                  placeholder="Enter your email"
                  required
                  data-testid="input-email"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className={isDarkMode ? 'text-white/90' : 'text-slate-900'}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`${isDarkMode ? 'bg-white/5 border-white/10 text-white/90 placeholder:text-white/40' : 'bg-slate-900/5 border-slate-900/10 text-slate-900 placeholder:text-slate-500'} backdrop-blur-md`}
                placeholder="Enter your password"
                required
                data-testid="input-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              disabled={isLoading}
              data-testid="button-submit"
            >
              {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
              {isLoading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className={`${isDarkMode ? 'text-white/70 hover:text-white/90' : 'text-slate-600 hover:text-slate-900'} transition-colors`}
              data-testid="button-toggle-mode"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
