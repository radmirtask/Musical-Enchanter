import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { 
  generateDemoWaveform, 
  processAudioFile, 
  analyzeWithPython, 
  calculateViralScore 
} from '@/utils/audioProcessor';

// Processing status storage (for demo purposes)
// In production, use a database
const processingJobs = new Map();

export async function GET(request, { params }) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'Processing ID is required' }, { status: 400 });
    }
    
    console.log(`Checking status for processing ID: ${id}`);
    
    // Check if we have this job in our memory store
    if (!processingJobs.has(id)) {
      // If no job exists yet, create one and start "processing"
      console.log(`Creating new processing job for ID: ${id}`);
      
      // Check if file exists
      const uploadsDir = path.join(process.cwd(), 'uploads');
      const filePath = path.join(uploadsDir, `${id}.mp3`);
      
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return NextResponse.json({ 
          status: 'failed',
          error: 'File not found. Please upload again.'
        }, { status: 404 });
      }
      
      // Demo: Create a new job with initial status
      processingJobs.set(id, {
        id: id,
        status: 'processing',
        progress: 5,
        message: 'Starting audio processing...',
        startTime: Date.now()
      });
      
      // Demo: Simulate processing in the background
      simulateProcessing(id, filePath);
    }
    
    const jobStatus = processingJobs.get(id);
    
    // Return the job status
    return NextResponse.json(jobStatus);
  } catch (error) {
    console.error('Error checking processing status:', error);
    return NextResponse.json({ 
      status: 'error',
      error: `Server error: ${error.message}`
    }, { status: 500 });
  }
}

// Enhanced simulation with actual audio analysis
async function simulateProcessing(id, filePath) {
  console.log(`Processing track: ${id}, file: ${filePath}`);
  
  // Track processing stages for better UX
  const stages = [
    { progress: 10, message: 'Analyzing audio patterns...' },
    { progress: 30, message: 'Identifying key segments...' },
    { progress: 50, message: 'Enhancing frequency response...' },
    { progress: 70, message: 'Optimizing dynamics...' },
    { progress: 85, message: 'Applying final enhancements...' },
    { progress: 95, message: 'Preparing results...' }
  ];
  
  try {
    // Initial analysis as early as possible
    let analysis = null;
    let waveforms = null;
    let viralScore = 50; // Default score
    
    // Update with progressive status
    for (const stage of stages) {
      processingJobs.set(id, {
        ...processingJobs.get(id),
        status: 'processing',
        progress: stage.progress,
        message: stage.message
      });
      
      // Do actual work in parallel with status updates
      if (stage.progress === 10) {
        // Start analysis early in the background
        analysis = analyzeWithPython(filePath).catch(err => {
          console.error('Error in audio analysis:', err);
          return null;
        });
      }
      
      if (stage.progress === 50 && waveforms === null) {
        waveforms = generateDemoWaveform();
      }
      
      // Simulate processing time for each stage
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Create processed directory if it doesn't exist
    const processedDir = path.join(process.cwd(), 'processed');
    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir, { recursive: true });
    }
    
    // Copy the original file to simulate processing
    const processedFilePath = path.join(processedDir, `${id}_processed.mp3`);
    fs.copyFileSync(filePath, processedFilePath);
    
    // Wait for analysis to complete
    analysis = await analysis || await analyzeWithPython(filePath);
    
    // Calculate viral potential score
    viralScore = calculateViralScore(analysis);
    
    // Complete the job
    processingJobs.set(id, {
      id: id,
      status: 'completed',
      progress: 100,
      message: 'Processing complete!',
      originalTrack: `/uploads/${id}.mp3`,
      processedTrack: `/processed/${id}_processed.mp3`,
      waveforms: waveforms,
      analysis: analysis?.segments || {
        hooks: [[15, 25], [45, 55]],
        drops: [[30, 35]],
        transitions: [[25, 30], [55, 60]]
      },
      viralScore: viralScore,
      metadata: {
        title: 'Optimized for Social Media',
        tempo: `${analysis?.tempo?.toFixed(0) || '128'} BPM`,
        energy: analysis?.energy?.toFixed(2) || '0.75',
        format: 'MP3',
        sampleRate: '44.1 kHz',
        bitRate: '320 kbps',
        enhancementLevel: viralScore > 75 ? 'High' : 'Medium',
        optimizedSegments: Object.values(analysis?.segments || {}).flat().length || 5,
        optimizedFor: ['TikTok', 'Instagram']
      }
    });
    
    console.log(`Processing completed for ID: ${id}`);
  } catch (error) {
    console.error('Error in processing simulation:', error);
    processingJobs.set(id, {
      id: id,
      status: 'failed',
      progress: 0,
      error: `Processing failed: ${error.message}`
    });
  }
} 