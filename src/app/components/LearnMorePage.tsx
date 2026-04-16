import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, X, ChevronRight, Star } from "lucide-react";
import { Navigation } from "./Navigation";

interface Video {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  color: string;
}

const videos: Video[] = [
  {
    id: 1,
    title: "Creating Strong Passwords",
    duration: "3:45",
    thumbnail: "https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "from-purple-400 to-pink-400"
  },
  {
    id: 2,
    title: "Spot the Phishing Email",
    duration: "2:30",
    thumbnail: "https://images.unsplash.com/photo-1643822308530-533d7d11a8d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "from-blue-400 to-cyan-400"
  },
  {
    id: 3,
    title: "Safe Internet Browsing",
    duration: "4:15",
    thumbnail: "https://images.unsplash.com/photo-1633219664502-f7c0ad898f29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "from-green-400 to-emerald-400"
  },
  {
    id: 4,
    title: "Stranger Danger Online",
    duration: "1:50",
    thumbnail: "https://images.unsplash.com/photo-1539632346654-dd4c3cffad8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "from-orange-400 to-yellow-400"
  },
  {
    id: 5,
    title: "What is Cyberbullying?",
    duration: "5:20",
    thumbnail: "https://images.unsplash.com/photo-1760009229725-7ef1990e585f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "from-red-400 to-pink-400"
  },
  {
    id: 6,
    title: "Computer Viruses Explained",
    duration: "3:10",
    thumbnail: "https://images.unsplash.com/photo-1723473163879-12eb911895a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "from-indigo-400 to-purple-400"
  },
  {
    id: 7,
    title: "Protecting Your Privacy",
    duration: "2:45",
    thumbnail: "https://images.unsplash.com/photo-1588763714140-ab422a5f36bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "from-teal-400 to-green-400"
  },
  {
    id: 8,
    title: "Social Media Safety",
    duration: "6:00",
    thumbnail: "https://images.unsplash.com/photo-1741894785509-d87c84bdc275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "from-fuchsia-400 to-pink-400"
  },
  {
    id: 9,
    title: "Gaming Safety Tips",
    duration: "3:30",
    thumbnail: "https://images.unsplash.com/photo-1725282256353-8a2b604d70bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "from-amber-400 to-orange-400"
  },
  {
    id: 10,
    title: "Being a Digital Citizen",
    duration: "4:00",
    thumbnail: "https://images.unsplash.com/photo-1720293315630-42f6894d484e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "from-violet-400 to-purple-400"
  },
  {
    id: 11,
    title: "What Are Cookies?",
    duration: "3:15",
    thumbnail: "https://images.unsplash.com/photo-1658786335126-6e00866428ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "from-lime-400 to-green-400"
  },
  {
    id: 12,
    title: "Keep Your Info Safe",
    duration: "2:20",
    thumbnail: "https://images.unsplash.com/photo-1658786335153-b4035c0e09da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "from-sky-400 to-blue-400"
  }
];

export function LearnMorePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const openVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  const playNextVideo = () => {
    if (selectedVideo) {
      const currentIndex = videos.findIndex(v => v.id === selectedVideo.id);
      const nextIndex = (currentIndex + 1) % videos.length;
      setSelectedVideo(videos[nextIndex]);
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navigation currentPage="learn-more" onNavigate={onNavigate} userRole="student" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Cyber Safety Videos! 🛡️
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Learn How to Stay Safe Online!
          </h2>
          <p className="text-xl text-gray-600">
            Click any video to become a cyber hero
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ rotate: 0, scale: 0 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
              >
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openVideo(video)}
              className="cursor-pointer group"
            >
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                {/* Thumbnail */}
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${video.color} opacity-30 group-hover:opacity-40 transition-opacity`} />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl"
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Play className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" />
                    </motion.div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-bold">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className={`p-5 bg-gradient-to-r ${video.color}`}>
                  <h3 className="text-white font-black text-xl text-center drop-shadow-lg">
                    {video.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeVideo}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full"
            >
              {/* Modal Header */}
              <div className={`bg-gradient-to-r ${selectedVideo.color} p-6 relative`}>
                <motion.button
                  onClick={closeVideo}
                  className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-gray-800" />
                </motion.button>
                <h2 className="text-3xl font-black text-white drop-shadow-lg pr-16">
                  {selectedVideo.title}
                </h2>
              </div>

              {/* Video Player Area */}
              <div className="relative bg-gray-900 aspect-video">
                <img
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedVideo.color} ${isPlaying ? 'opacity-0' : 'opacity-40'} transition-opacity`} />

                {/* Play/Pause Control */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                    transition={isPlaying ? { repeat: Infinity, duration: 1.5 } : {}}
                  >
                    {isPlaying ? (
                      <Pause className="w-12 h-12 text-purple-600" fill="currentColor" />
                    ) : (
                      <Play className="w-12 h-12 text-purple-600 ml-2" fill="currentColor" />
                    )}
                  </motion.button>
                </div>

                {/* Duration Display */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-lg">
                  {selectedVideo.duration}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-6 bg-gray-50 flex gap-4">
                <motion.button
                  onClick={playNextVideo}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Next Video
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
                <motion.button
                  onClick={closeVideo}
                  className="px-8 py-4 bg-gray-300 text-gray-800 rounded-2xl font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
