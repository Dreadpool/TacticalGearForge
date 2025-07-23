import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  count?: number;
}

export default function SkeletonLoader({ count = 6 }: SkeletonLoaderProps) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          className="relative bg-black/20 backdrop-blur-md border border-ranger-green/20 rounded-lg overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.2), rgba(66, 84, 57, 0.05))',
            backdropFilter: 'blur(15px)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          {/* Badge Skeleton */}
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-ranger-green/30 rounded-full w-20 h-6 animate-pulse" />
          </div>

          {/* Image Skeleton */}
          <div className="aspect-square bg-gradient-to-br from-ranger-green/20 to-ops-black/40 animate-pulse" />

          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="space-y-2">
              <div className="bg-ranger-green/30 rounded h-6 w-3/4 animate-pulse" />
              <div className="bg-ranger-green/20 rounded h-4 w-1/2 animate-pulse" />
            </div>

            {/* Stars */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-ranger-green/30 rounded animate-pulse" />
                ))}
              </div>
              <div className="bg-ranger-green/20 rounded h-4 w-8 animate-pulse" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="bg-ranger-green/20 rounded h-4 w-full animate-pulse" />
              <div className="bg-ranger-green/20 rounded h-4 w-2/3 animate-pulse" />
            </div>

            {/* Price and Button */}
            <div className="flex items-center justify-between pt-2">
              <div className="bg-night-vision/30 rounded h-8 w-20 animate-pulse" />
              <div className="bg-ranger-green/30 rounded-lg h-10 w-24 animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
}