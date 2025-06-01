import React, { useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface VideoPreviewProps {
  videoUrl: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [showControls, setShowControls] = React.useState(false);

  const updateVideoState = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("timeupdate", updateVideoState);
      video.addEventListener("loadedmetadata", updateVideoState);

      return () => {
        video.removeEventListener("timeupdate", updateVideoState);
        video.removeEventListener("loadedmetadata", updateVideoState);
      };
    }
  }, [updateVideoState]);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPlaying]);

  const skipBackward = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10
      );
    }
  }, []);

  const skipForward = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
    }
  }, []);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (videoRef.current && duration) {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = (clickX / rect.width) * duration;
        videoRef.current.currentTime = newTime;
      }
    },
    [duration]
  );

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-2xl overflow-hidden glassmorphism-strong">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <span className="text-lg font-medium text-white">
          Visualization Preview
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full h-10 glassmorphism hover:bg-white/10 text-white/80"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>

      <div
        className="relative overflow-hidden bg-black/30 aspect-video group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full"
              controls={false}
              src={videoUrl}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                className={`bg-black/70 hover:bg-black/90 rounded-full h-16 w-16 p-0 button-glow transition-opacity duration-300 ${
                  showControls || !isPlaying ? "opacity-100" : "opacity-0"
                }`}
                size="icon"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white" />
                )}
              </Button>
            </div>

            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-white rounded-full transition-all duration-100"
                  style={{
                    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-white/20"
                    onClick={skipBackward}
                  >
                    <SkipBack className="h-4 w-4 text-white" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-white/20"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 text-white" />
                    ) : (
                      <Play className="h-4 w-4 text-white" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-white/20"
                    onClick={skipForward}
                  >
                    <SkipForward className="h-4 w-4 text-white" />
                  </Button>
                </div>

                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white/50 py-24">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full glassmorphism flex items-center justify-center">
                <Play className="h-8 w-8" />
              </div>
              Visualization will appear here
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPreview;
