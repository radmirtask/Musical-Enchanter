'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="py-12 md:py-24">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Transform Your Music with 
                <span className="gradient-text"> AI Magic</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300">
                Create viral-ready tracks optimized for TikTok and social media with our AI-powered music transformation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/upload">
                  <motion.button
                    whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(108, 92, 231, 0.5)' }}
                    whileTap={{ y: 0 }}
                    className="btn-primary px-8 py-3 text-lg"
                  >
                    Get Started
                  </motion.button>
                </Link>
                <Link href="/about">
                  <button className="px-8 py-3 text-lg border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    Learn More
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 blur-3xl rounded-full"></div>
              <div className="relative bg-white dark:bg-card-bg p-4 rounded-2xl shadow-lg">
                <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary/50 to-secondary/50 flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 8,
                        ease: "easeInOut" 
                      }}
                      className="text-9xl"
                    >
                      🎵
                    </motion.div>
                    
                    {/* Animated waveform */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-1">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 bg-white/70 rounded-full"
                          animate={{ 
                            height: [10, 30, 15, 40, 10],
                          }}
                          transition={{ 
                            repeat: Infinity,
                            duration: 1.5,
                            delay: i * 0.1,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Your Track Transformed</h3>
                    <p className="text-sm text-gray-500">Ready for TikTok virality</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 12L8 18V6L18 12Z" fill="currentColor"/>
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl font-bold mb-12">
            How Musical Enchanter Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📁",
                title: "Upload Your Track",
                description: "Upload any audio file in popular formats like MP3, WAV, or FLAC."
              },
              {
                icon: "✨",
                title: "AI Enhancement",
                description: "Our AI analyzes and enhances your track with optimized hooks, drops and energy levels."
              },
              {
                icon: "🚀",
                title: "Share Everywhere",
                description: "Download your transformed track and share it directly to TikTok and other platforms."
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="card p-6"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
