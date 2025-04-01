'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AudioUpload() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.includes('audio')) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.includes('audio')) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push('/results');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 150);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="card p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center gradient-text">Upload Your Track</h2>
        
        <div 
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-200 dark:border-gray-700'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 19C4.58172 19 1 15.4183 1 11C1 6.58172 4.58172 3 9 3C12.3949 3 15.2959 5.11466 16.4576 8.09864C16.7951 8.0339 17.1436 8 17.5 8C20.5376 8 23 10.4624 23 13.5C23 16.5376 20.5376 19 17.5 19H9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13L9 10M12 13L15 10M12 13L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="ml-3 text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <audio controls src={URL.createObjectURL(file)} className="w-full max-w-md rounded-lg" />
              </div>
            </div>
          ) : (
            <div className="py-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: [0.9, 1, 0.9], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="mb-4 text-primary/70"
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                  <path d="M9 19C4.58172 19 1 15.4183 1 11C1 6.58172 4.58172 3 9 3C12.3949 3 15.2959 5.11466 16.4576 8.09864C16.7951 8.0339 17.1436 8 17.5 8C20.5376 8 23 10.4624 23 13.5C23 16.5376 20.5376 19 17.5 19H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 13L12 21M12 21L9 18M12 21L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              
              <h3 className="text-lg font-medium mb-2">Drag & drop your audio file</h3>
              <p className="text-gray-500 mb-6">MP3, WAV or FLAC up to 50MB</p>
              
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="audio-file"
              />
              <label
                htmlFor="audio-file"
                className="btn-primary inline-block cursor-pointer"
              >
                Browse files
              </label>
            </div>
          )}
        </div>
        
        {file && (
          <div className="mt-6">
            {isUploading ? (
              <div className="space-y-3">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary" 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
                <p className="text-center text-sm">
                  {uploadProgress < 100 ? 'Uploading...' : 'Processing your track...'}
                </p>
              </div>
            ) : (
              <motion.button
                whileHover={{ y: -2, boxShadow: '0 5px 15px rgba(108, 92, 231, 0.4)' }}
                whileTap={{ y: 0, boxShadow: 'none' }}
                onClick={handleUpload}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold transition"
              >
                Transform Your Track
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 