const BASE_URL = import.meta.env.VITE_API_URL || '';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export async function apiCall<T = any>(
  method: string,
  endpoint: string,
  body?: any,
  headers?: Record<string, string>
): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: { ...defaultHeaders, ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'API request failed');
  }

  return response.json();
}

// Auth
export async function register(data: { username: string; email: string; password: string; fullName?: string }) {
  return apiCall('/api/auth/register', 'POST', data);
}

export async function login(credentials: { username: string; password: string }) {
  return apiCall('/api/auth/login', 'POST', credentials);
}

export async function refreshToken(refreshToken: string) {
  return apiCall('/api/auth/refresh', 'POST', { refreshToken });
}

// User
export async function getUserProfile() {
  return apiCall('/api/user/profile', 'GET');
}

export async function updateUserProfile(data: any) {
  return apiCall('/api/user/profile', 'PATCH', data);
}

export async function addEmergencyContact(contact: any) {
  return apiCall('/api/user/emergency-contact', 'POST', contact);
}

export async function deleteEmergencyContact(contactId: string) {
  return apiCall(`/api/user/emergency-contact/${contactId}`, 'DELETE');
}

export async function blockUser(userId: string) {
  return apiCall(`/api/user/block/${userId}`, 'POST', {});
}

export async function unblockUser(userId: string) {
  return apiCall(`/api/user/unblock/${userId}`, 'POST', {});
}

// Goals
export async function getGoals() {
  return apiCall('/api/goals', 'GET');
}

export async function createGoal(data: any) {
  return apiCall('/api/goals', 'POST', data);
}

export async function updateGoal(goalId: string, data: any) {
  return apiCall(`/api/goals/${goalId}`, 'PATCH', data);
}

export async function deleteGoal(goalId: string) {
  return apiCall(`/api/goals/${goalId}`, 'DELETE');
}

export async function checkInGoal(goalId: string) {
  return apiCall(`/api/goals/${goalId}/checkin`, 'POST', {});
}

// Assessments
export async function createAssessment(data: any) {
  return apiCall('/api/assessments', 'POST', data);
}

export async function getAssessments() {
  return apiCall('/api/assessments', 'GET');
}

export async function getLatestAssessment() {
  return apiCall('/api/assessments/latest', 'GET');
}

// Chat
export async function getConversations() {
  return apiCall('/api/chat/conversations', 'GET');
}

export async function getConversation(conversationId: string) {
  return apiCall(`/api/chat/conversations/${conversationId}`, 'GET');
}

export async function createMessage(data: any) {
  return apiCall('/api/chat/messages', 'POST', data);
}

// Playlists
export async function getPlaylists() {
  return apiCall('/api/playlists', 'GET');
}

export async function getTracks() {
  return apiCall('/api/tracks', 'GET');
}

export async function trackPlay(trackId: string) {
  return apiCall(`/api/tracks/${trackId}/play`, 'POST', {});
}

export async function likeTrack(trackId: string) {
  return apiCall(`/api/tracks/${trackId}/like`, 'POST', {});
}

export async function unlikeTrack(trackId: string) {
  return apiCall(`/api/tracks/${trackId}/unlike`, 'POST', {});
}

// Games
export async function saveGameScore(data: any) {
  return apiCall('/api/games/scores', 'POST', data);
}

export async function getGameScores(gameType?: string) {
  const params = gameType ? `?gameType=${gameType}` : '';
  return apiCall(`/api/games/scores${params}`, 'GET');
}

export async function getGameHighscores(gameType: string) {
  return apiCall(`/api/games/highscores/${gameType}`, 'GET');
}

// Streak
export async function getStreak() {
  return apiCall('/api/streak', 'GET');
}

export async function updateStreakActivity() {
  return apiCall('/api/streak/activity', 'POST', {});
}

// Health
export async function healthCheck() {
  return apiCall('/api/health', 'GET');
}
