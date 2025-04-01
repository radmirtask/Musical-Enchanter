'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Results from '@/components/Results';

export default function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [processingStatus, setProcessingStatus] = useState({
    status: 'loading',
    progress: 0,
    message: 'Starting...'
  });
  const [processedTrack, setProcessedTrack] = useState(null);
  const [waveforms, setWaveforms] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [viralScore, setViralScore] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const processId = searchParams.get('id');
  
  useEffect(() => {
    if (!processId) {
      router.push('/upload');
      return;
    }
    
    const checkStatus = async () => {
      try {
        console.log(`Checking processing status for ID: ${processId}`);
        const response = await fetch(`/api/process/${processId}`);
        
        // Check content type to avoid parsing HTML as JSON
        const contentType = response.headers.get('content-type');
        
        if (!response.ok) {
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch processing status');
          } else {
            // Handle non-JSON responses (like HTML error pages)
            const errorText = await response.text();
            console.error('Received non-JSON error response:', errorText.substring(0, 150) + '...');
            throw new Error('Server returned an unexpected response. See console for details.');
          }
        }
        
        // Only try to parse JSON if content type is JSON
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Received status data:', data);
          setProcessingStatus(data);
          
          if (data.status === 'completed') {
            setLoading(false);
            setProcessedTrack(data.processedTrack);
            setWaveforms(data.waveforms);
            setMetadata(data.metadata);
            setAnalysis(data.analysis);
            setViralScore(data.viralScore);
          } else if (data.status === 'failed') {
            setLoading(false);
          } else {
            // Continue polling if still processing
            setTimeout(checkStatus, 2000);
          }
        } else {
          // Handle unexpected content type
          console.error('Unexpected content type:', contentType);
          setProcessingStatus({
            status: 'error',
            message: 'Server returned an unexpected response format'
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking processing status:', error);
        setProcessingStatus({
          status: 'error',
          message: error.message || 'An error occurred while checking the status'
        });
        setLoading(false);
      }
    };
    
    checkStatus();
  }, [processId, router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="py-8 md:py-12 px-4">
      <motion.div
        className="max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500"
          variants={itemVariants}
        >
          Your Enchanted Track
        </motion.h1>
        
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 mb-8"
          variants={itemVariants}
        >
          We've optimized your music to captivate audiences across social platforms.
        </motion.p>

        {loading ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-12"
            variants={itemVariants}
          >
            <div className="relative w-64 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${processingStatus.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-lg font-medium mb-2">{processingStatus.progress}% Complete</p>
            <p className="text-gray-600 dark:text-gray-400">{processingStatus.message}</p>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-2xl">
              <motion.div 
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
              >
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <span className="text-sm">Analyzing</span>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5, repeatType: "reverse" }}
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm">Enhancing</span>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1, repeatType: "reverse" }}
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm">Optimizing</span>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1.5, repeatType: "reverse" }}
              >
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm">Finalizing</span>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <>
            {processingStatus.status === 'error' || processingStatus.status === 'failed' ? (
              <motion.div 
                className="flex flex-col items-center justify-center py-12"
                variants={itemVariants}
              >
                <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Processing Failed</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{processingStatus.error || processingStatus.message || 'There was an error processing your track. Please try again.'}</p>
                <Link href="/upload" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow">
                  Try Again
                </Link>
              </motion.div>
            ) : (
              <Results 
                trackUrl={processedTrack} 
                waveforms={waveforms} 
                metadata={metadata}
                analysis={analysis}
                viralScore={viralScore}
              />
            )}
          </>
        )}
        
        <motion.div 
          className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          variants={itemVariants}
        >
          <div>
            <h3 className="text-xl font-bold mb-2">Transform Another Track</h3>
            <p className="text-gray-600 dark:text-gray-400">Ready to enchant more of your music?</p>
          </div>
          <Link href="/upload" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow w-full md:w-auto text-center">
            Upload New Track
          </Link>
        </motion.div>
        
        <motion.div 
          className="mt-12 grid md:grid-cols-2 gap-8"
          variants={itemVariants}
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4">Enhance Your Experience</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Upgrade to Pro for advanced features:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Fine-tune audio enhancement parameters
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Platform-specific optimization (TikTok, Instagram, YouTube)
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Advanced audio editing and visualization tools
              </li>
            </ul>
            <button className="w-full px-4 py-2 border-2 border-purple-500 text-purple-500 font-medium rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors">
              Upgrade to Pro
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4">Share Your Creation</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Let the world hear your enchanted track!</p>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a94da] transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </button>
              <button className="flex items-center justify-center px-4 py-2 bg-[#000000] text-white rounded-lg hover:bg-[#333333] transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                TikTok
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 