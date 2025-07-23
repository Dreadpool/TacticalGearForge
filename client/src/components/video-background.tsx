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
        console.log('Attempting to play video...');
        await video.play();
        console.log('Video is playing successfully');
      } catch (error) {
        console.error('Autoplay failed:', error);
        console.log('Video needs user interaction to play');
      }
    };

    const handleCanPlay = () => {
      console.log('Video can play');
      playVideo();
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      console.error('Video error details:', video?.error);
    };

    const handleLoadedData = () => {
      console.log('Video data loaded');
    };

    // Add click handler for user interaction
    const handleUserInteraction = () => {
      console.log('User interaction detected, playing video');
      playVideo();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoadedData);
    
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
      video.removeEventListener('loadeddata', handleLoadedData);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={`fixed top-0 left-0 w-full h-screen object-cover ${className}`}
      style={{
        filter: 'brightness(0.4) contrast(1.2)',
        zIndex: -1
      }}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    >
      <source src="/swat-training.mp4" type="video/mp4" />
      <source src="/attached_assets/090406552-swat-officers-prepare-training_1753253747041.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}