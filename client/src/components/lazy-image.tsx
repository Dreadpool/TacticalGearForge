import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
}

export default function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMUExQTFBIi8+CjxwYXRoIGQ9Ik0yMCAyOEMxNi42ODYzIDI4IDEzLjMzNjEgMjYuNzU3OCAxMC42NjY3IDI0LjQ0NDRMMTkuMDg2NyAxNi40ODg5QzE5LjYxMzMgMTYuMDI0NCAxOS42MTMzIDE1LjMwIDIwIDExLjYzNTVWMTAuNUMxOS4zMzMzIDEwLjUgMTguNzUgMTEuMDgzMyAxOC43NSAxMS43NVYxNS41QzE4Ljc1IDE1LjUgMTYuNSAxOC43NSAxMiAyM0M2LjUgMjcuMjUgMTQgMzMgMjAgMzNDMjYgMzMgMzEuNSAyOCAzMS41IDIyQzMxLjUgMTcuNSAyOC41IDE0IDI0IDE0VjEyQzI4LjUgMTIgMzMgMTYgMzMgMjFDMzMgMjggMjcgMzMgMjAgMzNDMTMgMzMgOSAyOCA5IDIyQzkgMTUgMTQgMTAgMjAgMTBWMTJDMTUuNSAxMiAxMSAxNi41IDExIDIyQzExIDI3IDEzLjUgMzEuNSAyMCAzMS41QzI2LjUgMzEuNSAzMSAyNyAzMSAyMVYyMS41QzMxIDIyIDMwLjUgMjIuNSAzMCAyMi41SDI5VjIxQzI5IDIwIDI4IDIwIDI4IDIwVjE5QzI4IDE4IDI3IDE4IDI3IDE4VjE3QzI3IDE2IDI2IDE2IDI2IDE2VjE1QzI2IDE0IDI1IDE0IDI1IDE0VjEzQzI1IDEyIDI0IDEyIDI0IDEyVjExQzI0IDEwIDIzIDEwIDIzIDEwVjlDMjMgOCAyMiA4IDIyIDhWN0MyMiA2IDIxIDYgMjEgNlY1QzIxIDQgMjAgNCAyMCA0VjNDMjAgMiAxOSAyIDE5IDJWMUM5MiAwIDE4IDAgMTggMFYtMUMxOCAtMiAxNyAtMiAxNyAtMlYtM0MxNyAtNCAxNiAtNCAxNiAtNFYtNUMxNiAtNiAxNSAtNiAxNSAtNlYtN0MxNSAtOCAxNCAtOCAxNCAtOFYtOUMxNCAtMTAgMTMgLTEwIDEzIC0xMFYtMTFDMTMgLTEyIDEyIC0xMiAxMiAtMTJWLTEzQzEyIC0xNCAxMSAtMTQgMTEgLTE0Vi0xNUMxMSAtMTYgMTAgLTE2IDEwIC0xNlYtMTdDMTAgLTE4IDkgLTE4IDkgLTE4Vi0xOUM5IC0yMCA4IC0yMCA4IC0yMFYtMjFDOCAtMjIgNyAtMjIgNyAtMjJWLTIzQzcgLTI0IDYgLTI0IDYgLTI0Vi0yNUM2IC0yNiA1IC0yNiA1IC0yNlYtMjdDNSAtMjggNCA0IDQgLTI4Vi0yOUM0IC0zMCAzIC0zMCAzIC0zMFYtMzFDMyAtMzIgMiAtMzIgMiAtMzJWLTMzQzIgLTM0IDEgLTM0IDEgLTM0Vi0zNUMxIC0zNiAwIC0zNiAwIC0zNiIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4K',
  blurDataURL
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {/* Blur placeholder */}
      <motion.div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        style={{
          backgroundImage: blurDataURL ? `url(${blurDataURL})` : `url(${placeholder})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px) brightness(0.4)',
        }}
        animate={{
          opacity: isLoaded ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Actual image */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${className}`}
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Loading skeleton overlay */}
      {!isLoaded && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}