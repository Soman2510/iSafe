import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FileText, Image, Play, Code, Download, Eye } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";
import { getVideo, getVideoBlobUrl, revokeBlobUrl } from "../utils/videoStorage";

interface Material {
  type: 'video' | 'pdf' | 'infographic' | 'interactive';
  url?: string;
  content?: string;
  fileName?: string;
  fileSize?: number;
}

interface MaterialViewerProps {
  material: Material;
  title?: string;
}

export function MaterialViewer({ material, title }: MaterialViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [storedVideoUrl, setStoredVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // Handle stored video URLs
  useEffect(() => {
    if (material.type === 'video' && material.url?.startsWith('stored:')) {
      const videoId = material.url.replace('stored:', '');
      setVideoLoading(true);

      try {
        const storedVideo = getVideo(videoId);
        if (storedVideo) {
          const blobUrl = getVideoBlobUrl(storedVideo);
          setStoredVideoUrl(blobUrl);
        }
      } catch (error) {
        console.error('Failed to load stored video:', error);
      } finally {
        setVideoLoading(false);
      }
    }

    // Cleanup blob URL on unmount
    return () => {
      if (storedVideoUrl) {
        revokeBlobUrl(storedVideoUrl);
      }
    };
  }, [material, storedVideoUrl]);

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-6 h-6" />;
      case 'pdf':
        return <FileText className="w-6 h-6" />;
      case 'infographic':
        return <Image className="w-6 h-6" />;
      case 'interactive':
        return <Code className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getMaterialColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'text-red-500';
      case 'pdf':
        return 'text-blue-500';
      case 'infographic':
        return 'text-green-500';
      case 'interactive':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const renderMaterialContent = () => {
    switch (material.type) {
      case 'video':
        const videoUrl = storedVideoUrl || material.url;

        if (videoLoading) {
          return (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Loading video...</p>
              </div>
            </div>
          );
        }

        return videoUrl ? (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              controls
              className="w-full h-full"
              src={videoUrl}
              poster="/api/placeholder/640/360"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Play className="w-16 h-16 mx-auto mb-4" />
              <p>Video content not available</p>
            </div>
          </div>
        );

      case 'pdf':
        return material.url ? (
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={material.url}
              className="w-full h-full border-0"
              title={title || "PDF Document"}
            />
          </div>
        ) : (
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4" />
              <p>PDF content not available</p>
            </div>
          </div>
        );

      case 'infographic':
        return material.url ? (
          <div className="bg-white rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={material.url}
              alt={title || "Infographic"}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        ) : (
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Image className="w-16 h-16 mx-auto mb-4" />
              <p>Image content not available</p>
            </div>
          </div>
        );

      case 'interactive':
        return material.content ? (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <div dangerouslySetInnerHTML={{ __html: material.content }} />
          </div>
        ) : (
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Code className="w-16 h-16 mx-auto mb-4" />
              <p>Interactive content not available</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4" />
              <p>Content not available</p>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card color="white" className="overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gray-100 ${getMaterialColor(material.type)}`}>
              {getMaterialIcon(material.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#2C3E50]">
                Teaching Material
              </h3>
              <p className="text-sm text-[#6B7280] capitalize">
                {material.type} {material.fileName && `• ${material.fileName}`}
                {material.fileSize && ` • ${(material.fileSize / 1024 / 1024).toFixed(2)} MB`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {material.url && (
              <Button
                size="sm"
                variant="secondary"
                icon={<Download />}
                onClick={() => window.open(material.url, '_blank')}
              >
                Download
              </Button>
            )}
            <Button
              size="sm"
              variant="primary"
              icon={<Eye />}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'View'}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t pt-4"
          >
            {renderMaterialContent()}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}