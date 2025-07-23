import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  className?: string;
}

export default function VideoBackground({ className }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        // Silently handle autoplay restrictions
      }
    };

    const handleCanPlay = () => {
      playVideo();
    };

    const handleError = (e: Event) => {
      console.error('Video error:', video?.error);
    };

    // Add click handler for user interaction
    const handleUserInteraction = () => {
      playVideo();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    
    // Listen for user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    // Force load and try to play immediately
    video.load();
    
    // Try playing after a short delay
    setTimeout(() => {
      if (video.paused) {
        playVideo();
      }
    }, 100);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return (
    <>
      {/* Fallback colored background for debugging */}
      <div 
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          zIndex: 0
        }}
      />
      
      <video
        ref={videoRef}
        className={`absolute top-0 left-0 w-full h-full object-cover ${className}`}
        style={{
          filter: 'brightness(0.4) contrast(1.2)',
          zIndex: 1
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
      >
        <source src="/swat-training.mp4" type="video/mp4" />
        <source src="/attached_assets/090406552-swat-officers-prepare-training_1753253747041.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  );
}