import { Layout } from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Music as MusicIcon, Clock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { audioService, type AudioTrack } from '@/services/AudioService';
import * as api from '@/services/api';

import track1 from '@assets/60423014_calm-meditation-of-love-528-hz_1763903818821.mp3';
import track2 from '@assets/639528432hz-attract-love-deep-feeling-300658_1763903858506.mp3';
import track3 from '@assets/angels-lullaby-528-hz-short-391382_1763903867831.mp3';
import track4 from '@assets/meditation-binaural-8-hz-short-396646_1763903879470.mp3';
import track5 from '@assets/meditation-music-528-hz-short-pixabay-379018_1763903888408.mp3';
import track6 from '@assets/meditation-sleep-528hz-396hz-short-394088_1763903896487.mp3';
import track7 from '@assets/pure-theta-4-7hz-with-ambient-music-351341_1763903906303.mp3';
import track8 from '@assets/Relaxing-Music-432-Hz-Free-No-Copyright-Music-by-Liborio-Conti-01-REPLENISH_1763903917543.mp3';
import track9 from '@assets/Relaxing-Music-432-Hz-Free-No-Copyright-Music-by-Liborio-Conti-08-TIMING_1763903925675.mp3';
import track10 from '@assets/Relaxing-Music-432-Hz-Free-No-Copyright-Music-by-Liborio-Conti-16-SANCTUARY_1763903934009.mp3';
import track11 from '@assets/Relaxing-Music-432-Hz-Free-No-Copyright-Music-by-Liborio-Conti-24-MOTION_1763903942369.mp3';
import track12 from '@assets/Relaxing-Music-432-Hz-Free-No-Copyright-Music-by-Liborio-Conti-32-FLOATING_1763903950471.mp3';
import track13 from '@assets/Relaxing-Music-432-Hz-Free-No-Copyright-Music-by-Liborio-Conti-40-EARTH_1763903958812.mp3';
import track14 from '@assets/Relaxing-Music-432-Hz-Free-No-Copyright-Music-by-Liborio-Conti-47-BLOSSOM_1763903971175.mp3';
import track15 from '@assets/Relaxing-Music-432-Hz-Free-No-Copyright-Music-by-Liborio-Conti-63-TUNING_1763903983089.mp3';
import track16 from '@assets/Relaxing-Music-432-Hz-Free-No-Copyright-Music-by-Liborio-Conti-71-THE-DEEP_1763903993763.mp3';
import track17 from '@assets/Relaxing-Music-432-Hz-Free-No-Copyright-Music-by-Liborio-Conti-79-MOVEMENT_1763904003370.mp3';
import track18 from '@assets/528-hz-strings-texture-_1763903733990.mp3';
import track19 from '@assets/sleep-music-beta-range-14-hz-30-hz-binaural-immersive-audio-426675_1763904011204.mp3';

export default function Playlist() {
  const { isDarkMode, isAudioPlaying } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [likedTracks, setLikedTracks] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);

  const fallbackTracks: AudioTrack[] = [
    { title: 'Calm Meditation of Love 528 Hz', artist: 'Healing Frequencies', src: track1 },
    { title: '639/528/432Hz Attract Love', artist: 'Deep Feeling', src: track2 },
    { title: 'Angels Lullaby 528 Hz', artist: 'Peaceful Sleep', src: track3 },
    { title: 'Meditation Binaural 8 Hz', artist: 'Theta Waves', src: track4 },
    { title: 'Meditation Music 528 Hz', artist: 'Healing Tones', src: track5 },
    { title: 'Meditation Sleep 528Hz/396Hz', artist: 'Deep Relaxation', src: track6 },
    { title: 'Pure Theta 4-7Hz', artist: 'Ambient Music', src: track7 },
    { title: 'Replenish 432 Hz', artist: 'Liborio Conti', src: track8 },
    { title: 'Timing 432 Hz', artist: 'Liborio Conti', src: track9 },
    { title: 'Sanctuary 432 Hz', artist: 'Liborio Conti', src: track10 },
    { title: 'Motion 432 Hz', artist: 'Liborio Conti', src: track11 },
    { title: 'Floating 432 Hz', artist: 'Liborio Conti', src: track12 },
    { title: 'Earth 432 Hz', artist: 'Liborio Conti', src: track13 },
    { title: 'Blossom 432 Hz', artist: 'Liborio Conti', src: track14 },
    { title: 'Tuning 432 Hz', artist: 'Liborio Conti', src: track15 },
    { title: 'The Deep 432 Hz', artist: 'Liborio Conti', src: track16 },
    { title: 'Movement 432 Hz', artist: 'Liborio Conti', src: track17 },
    { title: '528 Hz Strings Texture', artist: 'Frequency Healing', src: track18 },
    { title: 'Sleep Music Beta 14-30 Hz', artist: 'Binaural Beats', src: track19 },
  ];

  const fallbackPlaylists = [
    { id: 1, title: 'Deep Sleep Sounds', description: 'Peaceful ambient sounds for restful sleep', trackCount: 12, duration: 360, category: 'Sleep' },
    { id: 2, title: 'Focus & Concentration', description: 'Instrumental music to enhance productivity', trackCount: 15, duration: 420, category: 'Focus' },
    { id: 3, title: 'Meditation Essentials', description: 'Calming tracks for meditation practice', trackCount: 18, duration: 540, category: 'Meditation' },
    { id: 4, title: 'Nature Soundscapes', description: 'Immerse yourself in natural environments', trackCount: 10, duration: 300, category: 'Nature' },
  ];

  // Fetch playlists and tracks on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [playlistsData, tracksData] = await Promise.all([
          api.getPlaylists().catch(() => fallbackPlaylists),
          api.getTracks().catch(() => fallbackTracks),
        ]);
        setPlaylists(playlistsData);
        const formattedTracks = tracksData.map((t: any) => ({
          title: t.title,
          artist: t.artist,
          src: t.audioUrl || t.src,
        }));
        setTracks(formattedTracks);
        audioService.setTracks(formattedTracks);
      } catch (error) {
        setTracks(fallbackTracks);
        setPlaylists(fallbackPlaylists);
        audioService.setTracks(fallbackTracks);
      }
    }
    fetchData();
  }, []);

  // Audio listeners
  useEffect(() => {
    const handleTimeUpdate = (audio: HTMLAudioElement) => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleLoadedMetadata = (audio: HTMLAudioElement) => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (currentTrack < tracks.length - 1) {
        setCurrentTrack(currentTrack + 1);
      } else {
        setIsPlaying(false);
        setCurrentTrack(0);
      }
    };

    audioService.on('timeupdate', handleTimeUpdate);
    audioService.on('loadedmetadata', handleLoadedMetadata);
    audioService.on('ended', handleEnded);

    return () => {
      audioService.off('timeupdate', handleTimeUpdate);
      audioService.off('loadedmetadata', handleLoadedMetadata);
      audioService.off('ended', handleEnded);
    };
  }, [currentTrack, tracks.length]);

  useEffect(() => {
    audioService.setVolume(volume[0]);
  }, [volume]);

  useEffect(() => {
    if (tracks.length > 0) {
      audioService.loadTrack(currentTrack);
      if (isPlaying) {
        audioService.play();
      }
    }
  }, [currentTrack, tracks]);

  useEffect(() => {
    if (isPlaying) {
      audioService.play();
    } else {
      audioService.pause();
    }
  }, [isPlaying]);

  // Respect global audio mute toggle
  useEffect(() => {
    if (!isAudioPlaying && isPlaying) {
      audioService.pause();
    } else if (isAudioPlaying && isPlaying) {
      audioService.play();
    }
  }, [isAudioPlaying, isPlaying]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleLike = async (index: number, trackId?: string) => {
    const trackIdToUse = trackId || `track-${index}`;
    if (likedTracks.includes(trackIdToUse)) {
      setLikedTracks(likedTracks.filter(i => i !== trackIdToUse));
      if (trackId) {
        try {
          await api.unlikeTrack(trackId);
        } catch (error) {
          console.error('Error unliking track:', error);
        }
      }
    } else {
      setLikedTracks([...likedTracks, trackIdToUse]);
      if (trackId) {
        try {
          await api.likeTrack(trackId);
        } catch (error) {
          console.error('Error liking track:', error);
        }
      }
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentTrack > 0) {
      setCurrentTrack(currentTrack - 1);
    }
  };

  const handleNext = () => {
    if (currentTrack < tracks.length - 1) {
      setCurrentTrack(currentTrack + 1);
    }
  };

  return (
    <Layout>
      
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-32">
        <div className="mb-8">
          <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-4xl mb-2`}>
            Calming Music
          </h2>
          <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
            Curated playlists for meditation, focus, and relaxation
          </p>
        </div>

        <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl p-6 mb-8`}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className={`w-full md:w-48 h-48 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30' : 'bg-gradient-to-br from-blue-500/30 to-purple-500/30'}`}>
              <MusicIcon className={`w-20 h-20 ${isDarkMode ? 'text-white/90' : 'text-slate-900/90'}`} />
            </div>

            <div className="flex-1">
              <Badge variant="outline" className="mb-2">Now Playing</Badge>
              <h3 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} text-2xl font-medium mb-2`} data-testid="text-current-track">
                {tracks.length > 0 ? tracks[currentTrack]?.title : 'No tracks available'}
              </h3>
              <p className={`${isDarkMode ? 'text-white/70' : 'text-slate-700'} mb-6`}>
                {tracks.length > 0 ? tracks[currentTrack]?.artist : ''}
              </p>

              <div className="mb-6">
                <Progress value={progress} className="h-2 mb-2" />
                <div className="flex justify-between text-sm">
                  <span className={isDarkMode ? 'text-white/60' : 'text-slate-600'}>{formatTime(currentTime)}</span>
                  <span className={isDarkMode ? 'text-white/60' : 'text-slate-600'}>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={handlePrevious} disabled={currentTrack === 0} data-testid="button-previous">
                  <SkipBack className="w-5 h-5" />
                </Button>
                <Button size="lg" className="rounded-full w-14 h-14" onClick={handlePlayPause} data-testid="button-play-pause">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNext} disabled={currentTrack === tracks.length - 1} data-testid="button-next">
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => handleLike(currentTrack)} className={likedTracks.includes(currentTrack) ? 'text-pink-400' : ''} data-testid="button-like">
                  <Heart className={`w-5 h-5 ${likedTracks.includes(currentTrack) ? 'fill-current' : ''}`} />
                </Button>
                <Volume2 className={`w-5 h-5 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`} />
                <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-32" data-testid="slider-volume" />
                <span className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-600'} w-10`}>{volume[0]}%</span>
              </div>
            </div>
          </div>
        </Card>

        <h3 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} font-serif text-2xl mb-6`}>Tracks</h3>
        <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'} backdrop-blur-xl overflow-hidden`}>
          {(tracks && tracks.length > 0 ? tracks : fallbackTracks).map((track, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 transition-all hover-elevate cursor-pointer ${
                currentTrack === index ? isDarkMode ? 'bg-white/10' : 'bg-slate-900/10' : ''
              } ${index !== tracks.length - 1 ? isDarkMode ? 'border-b border-white/10' : 'border-b border-slate-900/10' : ''}`}
              onClick={() => {
                setCurrentTrack(index);
                setIsPlaying(true);
              }}
              data-testid={`track-${index}`}
            >
              <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={(e) => {
                e.stopPropagation();
                setCurrentTrack(index);
                if (currentTrack === index) {
                  setIsPlaying(!isPlaying);
                } else {
                  setIsPlaying(true);
                }
              }} data-testid={`button-play-track-${index}`}>
                {currentTrack === index && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <div className="flex-1 min-w-0">
                <h4 className={`${isDarkMode ? 'text-white/90' : 'text-slate-900'} font-medium truncate`}>{track.title}</h4>
                <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-600'} truncate`}>{track.artist}</p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleLike(index); }} className={likedTracks.includes(index) ? 'text-pink-400' : ''} data-testid={`button-like-track-${index}`}>
                  <Heart className={`w-4 h-4 ${likedTracks.includes(index) ? 'fill-current' : ''}`} />
                </Button>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`} />
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </Layout>
  );
}
