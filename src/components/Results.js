import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Results({ trackUrl, waveforms, metadata, analysis, viralScore }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const audioRef = useRef(null);
  
  useEffect(() => {
    if (audioRef.current) {
      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
      };
      
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
      };
    }
  }, [audioRef.current]);
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  
  const handleSeek = (e) => {
    const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  
  const calculateProgress = () => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  };

  const currentPlaying = (start, end) => {
    return (currentTime >= start && currentTime <= end);
  };
  
  return (
    <div>
      <audio ref={audioRef} src={trackUrl} preload="metadata" />
      
      <motion.div 
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Enhanced Track</h2>
            <p className="text-gray-600 dark:text-gray-400">Ready to captivate your audience</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <button 
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="px-4 py-2 text-sm bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
            >
              {showAnalysis ? "Hide Analysis" : "Show Analysis"}
            </button>
            
            <button 
              onClick={togglePlay}
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white shadow-md hover:shadow-lg transition-shadow"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {waveforms && (
          <div className="mb-6">
            <div className="relative h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer" onClick={handleSeek}>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="w-full flex items-center">
                  {waveforms.after.map((value, index) => (
                    <div 
                      key={index}
                      className={`w-1 mx-[1px] ${
                        index / waveforms.after.length * 100 <= calculateProgress()
                          ? 'bg-gradient-to-b from-purple-500 to-blue-500'
                          : 'bg-gray-400 dark:bg-gray-600'
                      }`}
                      style={{ height: `${value * 100}%`, maxHeight: '100%', transition: 'background-color 0.1s' }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Show segments on the player if analysis is available */}
              {showAnalysis && analysis && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  {analysis.hooks && analysis.hooks.map((hook, idx) => (
                    <div 
                      key={`hook-${idx}`} 
                      className={`absolute h-full bg-purple-500 ${currentPlaying(hook[0], hook[1]) ? 'opacity-40' : 'opacity-20'}`}
                      style={{ 
                        left: `${(hook[0] / (duration || 180)) * 100}%`, 
                        width: `${((hook[1] - hook[0]) / (duration || 180)) * 100}%`
                      }}
                    >
                      <span className="absolute top-1 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-white px-1 bg-purple-500 rounded">
                        Hook
                      </span>
                    </div>
                  ))}
                  
                  {analysis.drops && analysis.drops.map((drop, idx) => (
                    <div 
                      key={`drop-${idx}`} 
                      className={`absolute h-full bg-red-500 ${currentPlaying(drop[0], drop[1]) ? 'opacity-40' : 'opacity-20'}`}
                      style={{ 
                        left: `${(drop[0] / (duration || 180)) * 100}%`, 
                        width: `${((drop[1] - drop[0]) / (duration || 180)) * 100}%`
                      }}
                    >
                      <span className="absolute top-1 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-white px-1 bg-red-500 rounded">
                        Drop
                      </span>
                    </div>
                  ))}
                  
                  {analysis.transitions && analysis.transitions.map((transition, idx) => (
                    <div 
                      key={`transition-${idx}`} 
                      className={`absolute h-full bg-blue-500 ${currentPlaying(transition[0], transition[1]) ? 'opacity-40' : 'opacity-20'}`}
                      style={{ 
                        left: `${(transition[0] / (duration || 180)) * 100}%`, 
                        width: `${((transition[1] - transition[0]) / (duration || 180)) * 100}%`
                      }}
                    >
                      <span className="absolute top-1 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-white px-1 bg-blue-500 rounded">
                        Trans
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Enhancement Details</h3>
            {metadata && (
              <div className="space-y-3">
                {Object.entries(metadata).map(([key, value]) => {
                  // Skip certain keys that we display elsewhere
                  if (key === 'optimizedFor' || key === 'title') return null;
                  
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Optimized For</h3>
            {metadata?.optimizedFor && (
              <div className="flex flex-wrap gap-2">
                {metadata.optimizedFor.map(platform => (
                  <span 
                    key={platform} 
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">Download Options</h4>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  MP3 (High Quality)
                </button>
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  WAV (Lossless)
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Viral Potential Analysis */}
      {showAnalysis && (
        <motion.div 
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Viral Potential Analysis</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Features Detected</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Hooks</span>
                    <span>{analysis?.hooks?.length || 0} detected</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Catchy, memorable phrases that listeners will remember
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Drops</span>
                    <span>{analysis?.drops?.length || 0} detected</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Climactic moments with high energy for maximum impact
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Transitions</span>
                    <span>{analysis?.transitions?.length || 0} detected</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Smooth shifts between different musical sections
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Tempo</span>
                    <span>{metadata?.tempo || "N/A"}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {parseInt(metadata?.tempo) >= 115 && parseInt(metadata?.tempo) <= 140 
                      ? "Optimal range for viral content (115-140 BPM)" 
                      : "Adjusted for better engagement"}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Virality Score</h3>
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 relative mb-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke={viralScore >= 75 ? "#8b5cf6" : viralScore >= 50 ? "#3b82f6" : "#ef4444"} 
                      strokeWidth="10" 
                      strokeDasharray="283" 
                      strokeDashoffset={283 - (283 * (viralScore || 50) / 100)} 
                      strokeLinecap="round"
                    />
                    <text x="50" y="50" fontSize="24" textAnchor="middle" dy=".3em" fill="currentColor">
                      {viralScore || 50}%
                    </text>
                  </svg>
                </div>
                
                <div className="text-center">
                  <h4 className="font-bold text-lg mb-2">
                    {viralScore >= 75 ? "High Viral Potential" : 
                     viralScore >= 50 ? "Moderate Viral Potential" : 
                     "Some Viral Potential"}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {viralScore >= 75 ? 
                      "Your track has excellent viral qualities and is optimized for social media sharing." : 
                      viralScore >= 50 ? 
                      "Your track has good potential and could gain traction with the right promotion." :
                      "Your track has been enhanced to improve its viral potential from its original state."}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Optimizations Applied</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Tempo optimized for social media engagement</span>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Bass enhanced for impactful drops</span>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Dynamic range compression for louder perceived volume</span>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Audio levels normalized for cross-platform compatibility</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-6">Before & After Comparison</h2>
        
        {waveforms && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Original Track</h3>
              <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-full flex items-center">
                    {waveforms.before.map((value, index) => (
                      <div 
                        key={index}
                        className="w-1 mx-[1px] bg-gray-400 dark:bg-gray-600"
                        style={{ height: `${value * 100}%`, maxHeight: '100%' }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Enhanced Track</h3>
              <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-full flex items-center">
                    {waveforms.after.map((value, index) => (
                      <div 
                        key={index}
                        className="w-1 mx-[1px] bg-gradient-to-b from-purple-500 to-blue-500"
                        style={{ height: `${value * 100}%`, maxHeight: '100%' }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="font-medium mb-1">Clarity</div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="font-medium mb-1">Bass</div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="font-medium mb-1">Volume</div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: '95%' }}></div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="font-medium mb-1">Dynamic Range</div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 