import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Don't import from audioProcessor yet - we'll set up the directories ourselves
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

export async function POST(request) {
  try {
    console.log('Upload API called');
    
    // Ensure uploads directory exists
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        console.log(`Creating uploads directory: ${UPLOADS_DIR}`);
        await mkdir(UPLOADS_DIR, { recursive: true });
      }
    } catch (dirError) {
      console.error('Error creating uploads directory:', dirError);
      return NextResponse.json({ 
        error: `Failed to create uploads directory: ${dirError.message}` 
      }, { status: 500 });
    }
    
    // Parse the form data
    let formData;
    try {
      formData = await request.formData();
    } catch (formError) {
      console.error('Error parsing form data:', formError);
      return NextResponse.json({ 
        error: `Failed to parse form data: ${formError.message}` 
      }, { status: 400 });
    }
    
    const file = formData.get('file');
    
    if (!file) {
      console.error('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Log file information
    console.log('File upload information:');
    console.log(`Filename: ${file.name}`);
    console.log(`File type: ${file.type}`);
    console.log(`File size: ${file.size} bytes`);
    
    // Generate a unique file ID
    const fileId = uuidv4();
    
    // Extract the file extension
    const fileExt = path.extname(file.name).toLowerCase().replace('.', '') || 'mp3';
    
    try {
      // Save the original file
      const originalFilePath = path.join(UPLOADS_DIR, `${fileId}_original.${fileExt}`);
      
      // Get the file data
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Save the file
      console.log(`Saving file to ${originalFilePath}`);
      await writeFile(originalFilePath, buffer);
      
      // Also save as MP3 for our processing pipeline
      const mp3FilePath = path.join(UPLOADS_DIR, `${fileId}.mp3`);
      console.log(`Saving MP3 copy to ${mp3FilePath}`);
      await writeFile(mp3FilePath, buffer);
      
      console.log('Files saved successfully');
      
      // Return success response
      return NextResponse.json({
        message: 'File uploaded successfully',
        fileId: fileId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        processingId: fileId
      });
    } catch (saveError) {
      console.error('Error saving file:', saveError);
      return NextResponse.json({ 
        error: `Failed to save file: ${saveError.message}` 
      }, { status: 500 });
    }
  } catch (error) {
    // Catch all other errors
    console.error('Unhandled error in upload API:', error);
    return NextResponse.json({ 
      error: `Server error: ${error.message}` 
    }, { status: 500 });
  }
} 