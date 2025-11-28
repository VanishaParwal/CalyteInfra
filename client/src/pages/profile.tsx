import { Layout } from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Activity, Phone, Volume2, Bell, Lock, History, Ban, FileText, Edit, Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Profile() {
  const { isDarkMode } = useTheme();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emergencyNumbers, setEmergencyNumbers] = useState([
    { id: 1, name: 'Crisis Hotline', number: '988' },
    { id: 2, name: 'Emergency Services', number: '911' },
    { id: 3, name: 'Mental Health Support', number: '1-800-273-8255' },
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');

  const handleAddEmergencyContact = () => {
    if (newContactName && newContactNumber) {
      setEmergencyNumbers([...emergencyNumbers, {
        id: Date.now(),
        name: newContactName,
        number: newContactNumber,
      }]);
      setNewContactName('');
      setNewContactNumber('');
    }
  };

  const handleDeleteContact = (id: number) => {
    setEmergencyNumbers(emergencyNumbers.filter(c => c.id !== id));
  };

  const activityHistory = [
    { id: 1, activity: 'Completed Meditation Session', date: '2 hours ago', type: 'meditation' },
    { id: 2, activity: 'Wellness Assessment', date: '1 day ago', type: 'assessment' },
    { id: 3, activity: 'Joined Support Circle', date: '2 days ago', type: 'community' },
    { id: 4, activity: 'Breathing Exercise', date: '3 days ago', type: 'breathing' },
  ];

  const blockedAccounts = [
    { id: 1, username: 'User123', blockedDate: '5 days ago' },
  ];

  const posts = [
    { id: 1, content: 'Finding peace through daily meditation...', likes: 12, date: '1 day ago' },
    { id: 2, content: 'Grateful for this supportive community.', likes: 24, date: '3 days ago' },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-32">
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className={`text-2xl ${isDarkMode ? 'bg-white/10 text-white/80' : 'bg-slate-900/10 text-slate-800'}`}>
                U
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-3xl mb-2`}>
                Anonymous User
              </h2>
              <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
                Member since November 2024
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="settings" className="gap-2" data-testid="tab-settings">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2" data-testid="tab-activity">
              <Activity className="w-4 h-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-900/10'} backdrop-blur-xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <Volume2 className={`w-5 h-5 ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`} />
                  <h3 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-xl font-medium`}>
                    Voice Options
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className={isDarkMode ? 'text-white/90' : 'text-slate-900'}>Enable Voice Responses</Label>
                      <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                        AI will speak responses in voice chat mode
                      </p>
                    </div>
                    <Switch
                      checked={voiceEnabled}
                      onCheckedChange={setVoiceEnabled}
                      data-testid="switch-voice"
                    />
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <Label className={`block mb-2 ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>Voice Speed</Label>
                    <select className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-white/5 border-white/10 text-white/90' : 'bg-slate-50 border-slate-200'} border`}>
                      <option>Slow</option>
                      <option>Normal</option>
                      <option>Fast</option>
                    </select>
                  </div>
                  <div>
                    <Label className={`block mb-2 ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>Voice Type</Label>
                    <select className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-white/5 border-white/10 text-white/90' : 'bg-slate-50 border-slate-200'} border`}>
                      <option>Female Voice 1</option>
                      <option>Female Voice 2</option>
                      <option>Male Voice 1</option>
                      <option>Male Voice 2</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-900/10'} backdrop-blur-xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <Bell className={`w-5 h-5 ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`} />
                  <h3 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-xl font-medium`}>
                    Notifications
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className={isDarkMode ? 'text-white/90' : 'text-slate-900'}>Push Notifications</Label>
                      <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                        Receive reminders and updates
                      </p>
                    </div>
                    <Switch
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                      data-testid="switch-notifications"
                    />
                  </div>
                </div>
              </Card>

              <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-900/10'} backdrop-blur-xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <Lock className={`w-5 h-5 ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`} />
                  <h3 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-xl font-medium`}>
                    Privacy
                  </h3>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-change-password">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-data-privacy">
                    Data Privacy Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-500" data-testid="button-delete-account">
                    Delete Account
                  </Button>
                </div>
              </Card>

              <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-900/10'} backdrop-blur-xl p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Phone className={`w-5 h-5 ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`} />
                    <h3 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-xl font-medium`}>
                      Emergency Numbers
                    </h3>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2" data-testid="button-add-emergency">
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white'}>
                      <DialogHeader>
                        <DialogTitle>Add Emergency Contact</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label>Contact Name</Label>
                          <Input
                            value={newContactName}
                            onChange={(e) => setNewContactName(e.target.value)}
                            placeholder="e.g., Crisis Hotline"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Phone Number</Label>
                          <Input
                            value={newContactNumber}
                            onChange={(e) => setNewContactNumber(e.target.value)}
                            placeholder="e.g., 988"
                            className="mt-2"
                          />
                        </div>
                        <Button onClick={handleAddEmergencyContact} className="w-full" data-testid="button-save-emergency">
                          Add Contact
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-3">
                  {emergencyNumbers.map((contact) => (
                    <div
                      key={contact.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} border`}
                    >
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>
                          {contact.name}
                        </h4>
                        <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>{contact.number}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" data-testid={`button-edit-${contact.id}`}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteContact(contact.id)}
                          data-testid={`button-delete-${contact.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="space-y-6">
              <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-900/10'} backdrop-blur-xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <History className={`w-5 h-5 ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`} />
                  <h3 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-xl font-medium`}>
                    Activity History
                  </h3>
                </div>
                <div className="space-y-3">
                  {activityHistory.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} border hover-elevate`}
                    >
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>
                          {item.activity}
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                          {item.date}
                        </p>
                      </div>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-900/10'} backdrop-blur-xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <FileText className={`w-5 h-5 ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`} />
                  <h3 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-xl font-medium`}>
                    Things Posted
                  </h3>
                </div>
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className={`p-4 rounded-lg ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} border`}
                    >
                      <p className={isDarkMode ? 'text-white/90' : 'text-slate-900'}>{post.content}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className={isDarkMode ? 'text-white/60' : 'text-slate-600'}>
                          {post.likes} likes
                        </span>
                        <span className={isDarkMode ? 'text-white/60' : 'text-slate-600'}>
                          {post.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-900/10'} backdrop-blur-xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <Ban className={`w-5 h-5 ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`} />
                  <h3 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-xl font-medium`}>
                    Blocked Accounts
                  </h3>
                </div>
                <div className="space-y-3">
                  {blockedAccounts.length === 0 ? (
                    <p className={isDarkMode ? 'text-white/60' : 'text-slate-600'}>
                      No blocked accounts
                    </p>
                  ) : (
                    blockedAccounts.map((account) => (
                      <div
                        key={account.id}
                        className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} border`}
                      >
                        <div>
                          <h4 className={`font-medium ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>
                            {account.username}
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                            Blocked {account.blockedDate}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" data-testid={`button-unblock-${account.id}`}>
                          Unblock
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
