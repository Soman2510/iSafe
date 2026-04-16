/**
 * Video Storage Utilities
 * Simulates video hosting by storing files in localStorage/sessionStorage
 */

export interface StoredVideo {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  data: string; // base64 encoded data
  uploadedAt: string;
  quizId?: string;
}

const VIDEO_STORAGE_KEY = 'questzania_videos';
const MAX_STORAGE_SIZE = 500 * 1024 * 1024; // 500MB total storage limit

/**
 * Store a video file in localStorage
 */
export const storeVideo = async (file: File, quizId?: string): Promise<StoredVideo> => {
  return new Promise((resolve, reject) => {
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      reject(new Error('Unsupported video format'));
      return;
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      reject(new Error('Video file too large (max 100MB)'));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const base64Data = reader.result as string;

        // Check if we have enough storage space
        const existingVideos = getStoredVideos();
        const totalSize = existingVideos.reduce((sum, v) => sum + v.fileSize, 0) + file.size;

        if (totalSize > MAX_STORAGE_SIZE) {
          reject(new Error('Not enough storage space. Please delete some videos first.'));
          return;
        }

        const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const storedVideo: StoredVideo = {
          id: videoId,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          data: base64Data,
          uploadedAt: new Date().toISOString(),
          quizId
        };

        existingVideos.push(storedVideo);
        localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(existingVideos));

        resolve(storedVideo);
      } catch (error) {
        reject(new Error('Failed to store video: ' + (error as Error).message));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read video file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Get all stored videos
 */
export const getStoredVideos = (): StoredVideo[] => {
  try {
    const stored = localStorage.getItem(VIDEO_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const getStorageInfo = () => {
  const videos = getStoredVideos();
  const totalSize = videos.reduce((sum, video) => sum + video.fileSize, 0);
  const maxSizeMB = Math.round(MAX_STORAGE_SIZE / 1024 / 1024);
  const totalSizeMB = parseFloat((totalSize / 1024 / 1024).toFixed(2));
  const usagePercentage = maxSizeMB === 0 ? 0 : Math.min(100, Math.round((totalSize / MAX_STORAGE_SIZE) * 100));

  return {
    totalSize,
    totalSizeMB,
    maxSizeMB,
    usagePercentage,
  };
};

/**
 * Get a specific video by ID
 */
export const getVideo = (id: string): StoredVideo | null => {
  const videos = getStoredVideos();
  return videos.find(v => v.id === id) || null;
};

/**
 * Get videos for a specific quiz
 */
export const getVideosForQuiz = (quizId: string): StoredVideo[] => {
  const videos = getStoredVideos();
  return videos.filter(v => v.quizId === quizId);
};

/**
 * Delete a video
 */
export const deleteVideo = (id: string): boolean => {
  try {
    const videos = getStoredVideos();
    const filteredVideos = videos.filter(v => v.id !== id);
    localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(filteredVideos));
    return true;
  } catch {
    return false;
  }
};

/**
 * Get video blob URL for playback
 */
export const getVideoBlobUrl = (video: StoredVideo): string => {
  // Convert base64 to blob
  const base64Data = video.data.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: video.mimeType });

  return URL.createObjectURL(blob);
};

/**
 * Clean up blob URLs to prevent memory leaks
 */
export const revokeBlobUrl = (url: string) => {
  URL.revokeObjectURL(url);
};

/**
 * Clear all stored videos (use with caution)
 */
export const clearAllVideos = (): boolean => {
  try {
    localStorage.removeItem(VIDEO_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
};