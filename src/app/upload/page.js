'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const allowedFileTypes = [
    // MP3
    'audio/mpeg', 'audio/mp3', 
    // WAV
    'audio/wav', 'audio/x-wav', 'audio/wave',
    // FLAC
    'audio/flac', 'audio/x-flac',
    // M4A/AAC
    'audio/mp4', 'audio/x-m4a', 'audio/m4a', 'audio/aac',
    // Generic audio
    'audio/*'
  ];
  const allowedExtensions = ['mp3', 'wav', 'flac', 'm4a', 'aac'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return { valid: false, message: 'No file selected' };
    
    // Check file size first
    if (file.size > maxFileSize) {
      return { 
        valid: false, 
        message: `File size exceeds the limit of ${maxFileSize / (1024 * 1024)}MB.`
      };
    }
    
    // Get file extension
    const fileName = file.name;
    const fileExt = fileName.split('.').pop().toLowerCase();
    
    // Check MIME type first, if available
    const fileMimeType = file.type;
    
    console.log(`Validating file: ${fileName}`);
    console.log(`MIME type: ${fileMimeType}`);
    console.log(`Extension: ${fileExt}`);
    
    // For M4A files, just check the extension
    if (fileExt === 'm4a') {
      return { valid: true };
    }
    
    // If MIME type is available, check against allowed types
    if (fileMimeType) {
      if (allowedFileTypes.includes(fileMimeType)) {
        return { valid: true };
      }
    }
    
    // Finally check extension
    if (allowedExtensions.includes(fileExt)) {
      return { valid: true };
    }
    
    // If we get here, the file type is not allowed
    return { 
      valid: false, 
      message: 'Invalid file type. Please upload MP3, WAV, FLAC, or M4A files only.'
    };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateFile(file);
      
      if (validation.valid) {
        setSelectedFile(file);
        setUploadError(null);
      } else {
        setUploadError(validation.message);
      }
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateFile(file);
      
      if (validation.valid) {
        setSelectedFile(file);
        setUploadError(null);
      } else {
        setUploadError(validation.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadError('Please select a file first');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    // Create form data
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 5;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 200);
      
      // Make API request
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      // Check content type
      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        } else {
          // Handle non-JSON responses (like HTML error pages)
          const errorText = await response.text();
          console.error('Upload error - received non-JSON response:', errorText.substring(0, 150) + '...');
          throw new Error('Server returned an unexpected response. See console for details.');
        }
      }
      
      // Only try to parse JSON if content type is JSON
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setUploadProgress(100);
        
        // Delay navigation to show 100% progress
        setTimeout(() => {
          router.push(`/results?id=${data.processingId}`);
        }, 500);
      } else {
        // Handle unexpected content type
        console.error('Upload response has unexpected content type:', contentType);
        throw new Error('Server returned an unexpected response format');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload file. Please try again.');
      setUploading(false);
    }
  };
  
  const openFileSelector = () => {
    fileInputRef.current.click();
  };

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
          Upload Your Track
        </motion.h1>
        
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 mb-8"
          variants={itemVariants}
        >
          Transform your music into viral-ready tracks optimized for social platforms
        </motion.p>
        
        <motion.div 
          className="mb-12"
          variants={itemVariants}
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Upload</h3>
              <p className="text-gray-600 dark:text-gray-400">Select or drag your audio file (MP3, WAV, FLAC, or M4A)</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Transform</h3>
              <p className="text-gray-600 dark:text-gray-400">Our AI enhances your track for maximum engagement</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Share</h3>
              <p className="text-gray-600 dark:text-gray-400">Download and share your enchanted track anywhere</p>
            </div>
          </div>
        </motion.div>
        
        <motion.form 
          onSubmit={handleSubmit}
          className="mt-8"
          variants={itemVariants}
        >
          <div 
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center ${
              dragActive 
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                : selectedFile 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600'
            } transition-colors cursor-pointer relative h-64`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileSelector}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".mp3,.wav,.flac,.m4a,audio/mpeg,audio/wav,audio/flac,audio/mp4"
              onChange={handleFileInputChange}
              disabled={uploading}
            />
            
            {selectedFile ? (
              <>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">File Selected</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Drag and drop your audio file</h3>
                <p className="text-gray-600 dark:text-gray-400">or click to browse</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Supported formats: MP3, WAV, FLAC, M4A (max 50MB)
                </p>
              </>
            )}
          </div>
          
          {uploadError && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {uploadError}
              </p>
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className={`px-8 py-4 rounded-full font-medium text-white shadow-lg transition-all ${
                !selectedFile || uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-xl transform hover:-translate-y-1'
              }`}
            >
              {uploading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading... {uploadProgress}%
                </div>
              ) : (
                'Transform Your Track'
              )}
            </button>
          </div>
          
          {uploading && (
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </motion.form>
        
        <motion.div 
          className="mt-16 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          variants={itemVariants}
        >
          <h3 className="text-xl font-semibold mb-4">Why Use Musical Enchanter?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="mr-4 text-purple-500 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium mb-1">AI-Powered Enhancement</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Our technology analyzes thousands of viral tracks to enhance yours with proven patterns.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 text-blue-500 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium mb-1">Quick Processing</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Get your enhanced track in minutes, not hours. Perfect for creators on tight schedules.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 text-green-500 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium mb-1">Keep Your Rights</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  You retain 100% ownership of your transformed tracks. We never claim any rights to your music.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 text-pink-500 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium mb-1">Community & Support</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Join thousands of creators already using our platform and get access to our support team.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 