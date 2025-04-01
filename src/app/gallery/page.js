'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function GalleryPage() {
  const [tracks, setTracks] = useState([
    {
      id: 1,
      title: 'Summer Vibes',
      artist: 'Beach Boys',
      genre: 'Pop',
      coverUrl: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=300&q=80',
      duration: '2:45',
      isPlaying: false,
      likes: 342,
      waveform: Array(30).fill().map(() => Math.random() * 100)
    },
    {
      id: 2,
      title: 'Night Drive',
      artist: 'Synthwave Collective',
      genre: 'Electronic',
      coverUrl: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=300&q=80',
      duration: '3:12',
      isPlaying: false,
      likes: 128,
      waveform: Array(30).fill().map(() => Math.random() * 100)
    },
    {
      id: 3,
      title: 'Urban Jungle',
      artist: 'City Beats',
      genre: 'Hip Hop',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80',
      duration: '3:50',
      isPlaying: false,
      likes: 215,
      waveform: Array(30).fill().map(() => Math.random() * 100)
    },
    {
      id: 4,
      title: 'Chillout Session',
      artist: 'Ambient Dreams',
      genre: 'Ambient',
      coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80',
      duration: '4:20',
      isPlaying: false,
      likes: 89,
      waveform: Array(30).fill().map(() => Math.random() * 100)
    },
    {
      id: 5,
      title: 'Dance Floor',
      artist: 'Club Kings',
      genre: 'Dance',
      coverUrl: 'https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?w=300&q=80',
      duration: '3:05',
      isPlaying: false,
      likes: 176,
      waveform: Array(30).fill().map(() => Math.random() * 100)
    },
    {
      id: 6,
      title: 'Guitar Dreams',
      artist: 'String Theory',
      genre: 'Acoustic',
      coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&q=80',
      duration: '2:58',
      isPlaying: false,
      likes: 132,
      waveform: Array(30).fill().map(() => Math.random() * 100)
    }
  ]);
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSorting, setActiveSorting] = useState('Latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedTracks, setDisplayedTracks] = useState(tracks);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Filter types
  const filters = ['All', 'Pop', 'Electronic', 'Hip Hop', 'Ambient', 'Dance', 'Acoustic'];
  const sortOptions = ['Latest', 'Popular', 'A-Z'];
  
  useEffect(() => {
    // Apply filtering and sorting
    let filteredTracks = [...tracks];
    
    // Apply genre filter
    if (activeFilter !== 'All') {
      filteredTracks = filteredTracks.filter(track => track.genre === activeFilter);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTracks = filteredTracks.filter(
        track => track.title.toLowerCase().includes(query) || 
                track.artist.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    if (activeSorting === 'Popular') {
      filteredTracks.sort((a, b) => b.likes - a.likes);
    } else if (activeSorting === 'A-Z') {
      filteredTracks.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setIsAnimating(true);
    setTimeout(() => {
      setDisplayedTracks(filteredTracks);
      setIsAnimating(false);
    }, 300);
  }, [activeFilter, activeSorting, searchQuery, tracks]);
  
  const togglePlay = (id) => {
    setTracks(tracks.map(track => 
      track.id === id 
        ? { ...track, isPlaying: !track.isPlaying } 
        : { ...track, isPlaying: false }
    ));
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const trackCardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Transformed Tracks Gallery
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Explore our collection of AI-enhanced tracks that have been transformed for maximum engagement.
          </p>
        </motion.div>
        
        {/* Search and filters */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search by title or artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                {filters.map(filter => (
                  <button
                    key={filter}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      activeFilter === filter 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
              {sortOptions.map(option => (
                <button
                  key={option}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    activeSorting === option 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveSorting(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tracks grid */}
        <AnimatePresence mode="wait">
          {isAnimating ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px] place-items-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="inline-block p-3 rounded-full bg-primary/10">
                  <svg className="w-6 h-6 text-primary animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.75V6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M17.1266 6.87347L16.0659 7.93413" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M19.25 12L17.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M17.1266 17.1265L16.0659 16.0659" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M12 17.75V19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M7.9342 16.0659L6.87354 17.1265" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M6.25 12L4.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M7.9342 7.93413L6.87354 6.87347" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="mt-3 text-gray-500">Updating results...</p>
              </motion.div>
            </div>
          ) : displayedTracks.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayedTracks.map(track => (
                <motion.div
                  key={track.id}
                  variants={trackCardVariants}
                  whileHover={{ y: -5 }}
                  className="card overflow-hidden relative group"
                >
                  {/* Cover image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={track.coverUrl}
                      alt={track.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Play button overlay */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => togglePlay(track.id)}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      {track.isPlaying ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 8H6V16H10V8Z" fill="white"/>
                          <path d="M18 8H14V16H18V8Z" fill="white"/>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 12L8 18V6L18 12Z" fill="white"/>
                        </svg>
                      )}
                    </motion.button>
                  </div>
                  
                  {/* Track info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{track.title}</h3>
                        <p className="text-sm text-gray-500">{track.artist}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">{track.genre}</span>
                    </div>
                    
                    {/* Waveform visualization */}
                    <div className="h-10 flex items-center space-x-0.5 mb-3">
                      {track.waveform.map((height, index) => (
                        <motion.div
                          key={index}
                          className={`w-full ${track.isPlaying ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'} rounded-full`}
                          style={{ height: `${height * 0.2}%` }}
                          animate={track.isPlaying ? {
                            height: [`${height * 0.2}%`, `${height * 0.5}%`, `${height * 0.2}%`],
                          } : {}}
                          transition={{
                            duration: 0.8,
                            repeat: track.isPlaying ? Infinity : 0,
                            delay: index * 0.03 % 0.5
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Track controls */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-primary transition">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M12 6V18M12 6L7 11M12 6L17 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <div className="flex items-center">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary mr-1">
                            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
                          </svg>
                          <span className="text-sm">{track.likes}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{track.duration}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No tracks found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-20 relative overflow-hidden card p-8 md:p-12"
        >
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Transform Your Own Music?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 md:max-w-md mb-6 md:mb-0">
                Upload your track and let our AI enhance it for maximum engagement across social platforms.
              </p>
            </div>
            
            <motion.button
              whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(108, 92, 231, 0.5)' }}
              whileTap={{ y: 0 }}
              className="btn-primary px-8 py-3 text-lg"
              onClick={() => window.location.href = '/upload'}
            >
              Upload Your Track
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 