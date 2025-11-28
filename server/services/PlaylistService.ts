import { Track } from '../models/Track';
import mongoose from 'mongoose';

export class PlaylistService {
  
  // NOTE: getSystemPlaylists removed because the Playlist model was deleted.
  // If you re-add the Playlist model later, you can uncomment/restore logic here.

  /**
   * Get all active tracks, sorted by popularity (most played first)
   */
  async getTracks(): Promise<any[]> {
    return Track.find({ isActive: true }).sort({ playCount: -1 });
  }

  /**
   * Increment the play count when a user listens to a track
   */
  async incrementTrackPlayCount(trackId: string): Promise<void> {
    await Track.findByIdAndUpdate(trackId, { $inc: { playCount: 1 } });
  }

  /**
   * Add a user to the track's "likedBy" list (Prevent duplicates with $addToSet)
   */
  async likeTrack(userId: string, trackId: string): Promise<any> {
    return Track.findByIdAndUpdate(
      trackId,
      { $addToSet: { likedBy: new mongoose.Types.ObjectId(userId) } },
      { new: true }
    );
  }

  /**
   * Remove a user from the track's "likedBy" list
   */
  async unlikeTrack(userId: string, trackId: string): Promise<any> {
    return Track.findByIdAndUpdate(
      trackId,
      { $pull: { likedBy: new mongoose.Types.ObjectId(userId) } },
      { new: true }
    );
  }
}

export const playlistService = new PlaylistService();