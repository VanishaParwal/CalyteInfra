export interface AudioTrack {
  title: string;
  artist: string;
  src: string;
  duration?: number;
}

export class AudioService {
  private audio: HTMLAudioElement;
  private currentTrackIndex = 0;
  private tracks: AudioTrack[] = [];
  private isPlaying = false;
  private listeners: { [key: string]: Function[] } = {};

  constructor() {
    this.audio = new Audio();
    this.setupAudioListeners();
  }

  private setupAudioListeners() {
    this.audio.addEventListener('timeupdate', () => this.emit('timeupdate', this.audio));
    this.audio.addEventListener('loadedmetadata', () => this.emit('loadedmetadata', this.audio));
    this.audio.addEventListener('ended', () => this.emit('ended', this.audio));
    this.audio.addEventListener('play', () => this.emit('play', this.audio));
    this.audio.addEventListener('pause', () => this.emit('pause', this.audio));
    this.audio.addEventListener('error', () => this.emit('error', this.audio));
  }

  setTracks(tracks: AudioTrack[]) {
    this.tracks = tracks;
  }

  async loadTrack(index: number) {
    if (index < 0 || index >= this.tracks.length) return;
    this.currentTrackIndex = index;
    const track = this.tracks[index];
    this.audio.src = track.src;
    this.audio.load();
  }

  async play() {
    try {
      await this.audio.play();
      this.isPlaying = true;
    } catch (error) {
      console.error('Playback error:', error);
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(volume: number) {
    this.audio.volume = Math.max(0, Math.min(1, volume / 100));
  }

  setCurrentTime(time: number) {
    this.audio.currentTime = time;
  }

  nextTrack() {
    if (this.currentTrackIndex < this.tracks.length - 1) {
      this.loadTrack(this.currentTrackIndex + 1);
    }
  }

  previousTrack() {
    if (this.currentTrackIndex > 0) {
      this.loadTrack(this.currentTrackIndex - 1);
    }
  }

  getCurrentTrackIndex() {
    return this.currentTrackIndex;
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  getDuration() {
    return this.audio.duration;
  }

  isPlayingNow() {
    return this.isPlaying && !this.audio.paused;
  }

  getAudioElement() {
    return this.audio;
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  private emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  destroy() {
    this.audio.pause();
    this.audio.src = '';
  }
}

export const audioService = new AudioService();
