import { Layout } from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, BookOpen, Trash2 } from 'lucide-react';

interface JournalEntry {
  id: string;
  feeling: string;
  mood: string;
  notes: string;
  createdAt: string;
  date?: string;
}

export default function Journal() {
  const { isDarkMode } = useTheme();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [journalInput, setJournalInput] = useState({ feeling: '', mood: '', notes: '' });
  const [isSubmittingJournal, setIsSubmittingJournal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      const response = await fetch('/api/journal');
      if (response.ok) {
        const entries = await response.json();
        const formattedEntries = entries.map((entry: JournalEntry) => ({
          ...entry,
          date: new Date(entry.createdAt).toLocaleDateString(),
        }));
        setJournalEntries(formattedEntries);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJournalSubmit = async () => {
    if (!journalInput.feeling.trim() || !journalInput.mood.trim() || !journalInput.notes.trim()) {
      return;
    }

    setIsSubmittingJournal(true);
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(journalInput),
      });

      if (response.ok) {
        const entry = await response.json();
        setJournalEntries([
          { ...entry, date: new Date(entry.createdAt).toLocaleDateString() },
          ...journalEntries,
        ]);
        setJournalInput({ feeling: '', mood: '', notes: '' });
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setIsSubmittingJournal(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setJournalEntries(journalEntries.filter(entry => entry.id !== id));
      }
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8" />
            <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-4xl`}>
              My Journal
            </h2>
          </div>
          <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
            Write down your daily feelings and thoughts. This is your private space for self-reflection and personal growth.
          </p>
        </div>

        <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-8 mb-12`}>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`}>
                Today's Feeling
              </label>
              <input
                type="text"
                placeholder="e.g., Grateful, Anxious, Hopeful"
                value={journalInput.feeling}
                onChange={(e) => setJournalInput({ ...journalInput, feeling: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-slate-900/10 border-slate-900/20 text-slate-900 placeholder-slate-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                data-testid="input-journal-feeling"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`}>
                Mood
              </label>
              <select
                value={journalInput.mood}
                onChange={(e) => setJournalInput({ ...journalInput, mood: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-900/10 border-slate-900/20 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                data-testid="select-journal-mood"
              >
                <option value="">Select a mood...</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="anxious">Anxious</option>
                <option value="calm">Calm</option>
                <option value="grateful">Grateful</option>
                <option value="stressed">Stressed</option>
                <option value="motivated">Motivated</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`}>
                Journal Entry
              </label>
              <Textarea
                placeholder="Write your thoughts, feelings, and reflections here..."
                value={journalInput.notes}
                onChange={(e) => setJournalInput({ ...journalInput, notes: e.target.value })}
                className={`w-full rounded-lg border ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-slate-900/10 border-slate-900/20 text-slate-900 placeholder-slate-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-40`}
                data-testid="textarea-journal-notes"
              />
            </div>

            <Button
              onClick={handleJournalSubmit}
              disabled={isSubmittingJournal || !journalInput.feeling.trim() || !journalInput.mood.trim() || !journalInput.notes.trim()}
              className="w-full gap-2"
              data-testid="button-save-journal"
            >
              <Send className="w-4 h-4" />
              {isSubmittingJournal ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </Card>

        {isLoading ? (
          <div className={`text-center py-12 ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>
            Loading entries...
          </div>
        ) : journalEntries.length > 0 ? (
          <div>
            <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} font-serif text-2xl mb-6`}>
              Recent Entries ({journalEntries.length})
            </h3>
            <div className="space-y-4">
              {journalEntries.map((entry) => (
                <Card 
                  key={entry.id} 
                  className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-md p-6`} 
                  data-testid={`card-journal-${entry.id}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{entry.date}</Badge>
                        <Badge className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                        </Badge>
                      </div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>
                        {entry.feeling}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDeleteEntry(entry.id)}
                      size="icon"
                      variant="ghost"
                      className="ml-2"
                      data-testid={`button-delete-journal-${entry.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-red-500/70" />
                    </Button>
                  </div>
                  <p className={`${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>
                    {entry.notes}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-12 text-center`}>
            <BookOpen className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`} />
            <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} text-xl font-medium mb-2`}>
              Your Journal is Empty
            </h3>
            <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
              Start your journaling journey by writing your first entry above. Your thoughts and feelings matter.
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
}