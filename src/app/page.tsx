"use client";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { useEffect, useRef, useState } from "react";


export default function Home() {
  const images = Array.from({ length: 104 }, (_, i) => `/images/img${i}.jpg`);
  const musicTracks = [
    { name: "Xiaoyu", src: "/music/Xiaoyu.wav" },
    // Add more tracks here as needed
    // { name: "Track 2", src: "/music/track2.mp3" },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 250);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const prevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsTransitioning(false);
    }, 250);
  };

  const nextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, 250);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const switchTrack = (trackIndex: number) => {
    const wasPlaying = isPlaying;
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setCurrentTrack(trackIndex);
    
    // If music was playing, resume with new track after a short delay
    if (wasPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    }
  };

  // Swipe handler
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: true,
  });

  return (
    <main className="flex flex-col items-center justify-start sm:justify-center min-h-screen bg-gray-900 text-white">
      {/* Title */}
      {/* <h1 className="text-4xl font-bold text-white mb-2 mt-2 text-center">
        Love Xiao-Yu
      </h1> */}
      
      {/* Image Slide */}
      <div
        {...swipeHandlers}
        className="relative w-full h-[780px] sm:w-[800px] sm:h-[640px] overflow-hidden"
            >
        <Image
          src={images[currentIndex]}
          alt="slideshow"
          fill
          priority
          className={` sm:rounded-2xl object-cover transition-opacity duration-500 ${
            isTransitioning ? 'opacity-40' : 'opacity-100'
          }`}
          key={currentIndex}
        />
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 px-3 py-2 rounded-lg"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 px-3 py-2 rounded-lg"
        >
          ▶
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-180 w-full max-w-[800px] px-4
      sm:relative sm:top-1
      ">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>{currentIndex + 1} / {images.length}</span>
          <span>{Math.round(((currentIndex + 1) / images.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Music Player */}
      <div className="mt-6 flex flex-row items-center gap-4">
        {/* Music Track Selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="track-select" className="text-sm text-gray-400">
            Music Track:
          </label>
          <select
            id="track-select"
            value={currentTrack}
            onChange={(e) => switchTrack(Number(e.target.value))}
            className="bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            {musicTracks.map((track, index) => (
              <option key={index} value={index}>
                {track.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`
            w-48
            px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
            isPlaying 
              ? 'bg-green-600 hover:bg-green-700 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isPlaying ? '⏸️ Pause Music' : '▶️ Play Music'}
        </button>
        <audio ref={audioRef} src={musicTracks[currentTrack].src} loop />
      </div>
    </main>
  );
}
