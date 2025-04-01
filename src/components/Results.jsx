'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Results({ trackUrl, waveforms, metadata }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState('processed'); // 'original' or 'processed'
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  
  // Use default waveforms if none provided (for development/testing)
  const processedWaveform = waveforms?.processed || Array(40).fill().map(() => Math.random() * 80 + 20);
  const originalWaveform = waveforms?.original || Array(40).fill().map(() => Math.random() * 70 + 10);
  
  // Use default metadata if none provided
  const audioMetadata = metadata || {
    tempo: '+3%',
    bassEnhancement: 'Medium',
    compression: 'Applied',
    normalization: '-14 LUFS'
  };
  
  // Mock data structure for demonstration
  const trackData = {
    original: {
      name: "Original Track",
      src: trackUrl?.replace('_enhanced', '') || null,
      waveform: originalWaveform,
    },
    processed: {
      name: "Enhanced Track",
      src: trackUrl || null,
      waveform: processedWaveform,
    },
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, activeTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
      const newTime = clickPosition * (audioRef.current.duration || 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const downloadTrack = () => {
    // Create a temporary link and click it to trigger download
    if (trackData[activeTrack].src) {
      const link = document.createElement('a');
      link.href = trackData[activeTrack].src;
      link.download = `${trackData[activeTrack].name}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No track available for download");
    }
  };
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="relative h-40 bg-gradient-to-r from-purple-500 to-blue-500 flex items-end">
        <div className="absolute inset-0 opacity-50">
          <div className="flex items-end h-full justify-around">
            {trackData[activeTrack].waveform.map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ 
                  height: isPlaying 
                    ? `${height * (0.5 + Math.random() * 0.5)}%` 
                    : `${height}%` 
                }}
                transition={{ 
                  duration: isPlaying ? 0.2 : 0.5,
                  repeat: isPlaying ? Infinity : 0,
                  repeatType: "mirror"
                }}
                className="w-1 bg-white rounded-t-sm"
              />
            ))}
          </div>
        </div>
        <div className="p-6 z-10 w-full">
          <h2 className="text-xl font-bold text-white">Your Enchanted Track</h2>
          <p className="text-white text-opacity-80 text-sm mt-1">
            Optimized for maximum engagement
          </p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">
              {trackData[activeTrack].name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Duration: {formatTime(duration)}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className={`px-3 py-1 rounded-full text-sm transition ${
                activeTrack === 'original' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveTrack('original')}
            >
              Original
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm transition ${
                activeTrack === 'processed' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveTrack('processed')}
            >
              Enhanced
            </button>
          </div>
        </div>
        
        {/* Hidden audio element for actual playback */}
        <audio 
          ref={audioRef}
          src={trackData[activeTrack].src}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
        
        {/* Progress bar */}
        <div 
          className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-3 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        
        {/* Playback controls */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <button 
            className="text-gray-400 hover:text-purple-500 transition"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
              }
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5 12L17.5 8V16L11.5 12Z" fill="currentColor"/>
              <path d="M5.5 8V16L11.5 12L5.5 8Z" fill="currentColor"/>
            </svg>
          </button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlayback}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center shadow-lg"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isPlaying ? 'pause' : 'play'}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8H6V16H10V8Z" fill="currentColor"/>
                    <path d="M18 8H14V16H18V8Z" fill="currentColor"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 12L8 18V6L18 12Z" fill="currentColor"/>
                  </svg>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          
          <button 
            className="text-gray-400 hover:text-purple-500 transition"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.min(
                  audioRef.current.duration || 0, 
                  audioRef.current.currentTime + 10
                );
              }
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 12L6.5 16V8L12.5 12Z" fill="currentColor"/>
              <path d="M18.5 16V8L12.5 12L18.5 16Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        
        {/* Enhancements info */}
        {activeTrack === 'processed' && (
          <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Enhancements Applied</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Tempo:</span> {audioMetadata.tempo}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 0l-3.536 3.536m-9.192 0l3.536-3.536" />
                </svg>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Bass:</span> {audioMetadata.bassEnhancement}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Dynamics:</span> {audioMetadata.compression}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Loudness:</span> {audioMetadata.normalization}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            onClick={downloadTrack}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full py-2.5 px-6 font-medium shadow-lg flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3V16M12 16L7 11M12 16L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Download Track</span>
          </motion.button>
          
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            className="border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full py-2.5 px-6 font-medium transition flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Share Track</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
} 