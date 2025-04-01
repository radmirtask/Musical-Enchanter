import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { UPLOADS_DIR, PROCESSED_DIR } from '@/utils/audioProcessor';

export async function GET(request, { params }) {
  const { type, path: pathSegments } = params;
  
  if (!type || !pathSegments || pathSegments.length === 0) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }
  
  // Determine the base directory based on the type
  let baseDir;
  if (type === 'uploads') {
    baseDir = UPLOADS_DIR;
  } else if (type === 'processed') {
    baseDir = PROCESSED_DIR;
  } else {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }
  
  // Join all path segments to form the file path
  const filePath = path.join(baseDir, ...pathSegments);
  
  // Verify the file exists
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
  
  // Read the file
  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type
    let contentType = 'application/octet-stream';
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.mp3') {
      contentType = 'audio/mpeg';
    } else if (ext === '.wav') {
      contentType = 'audio/wav';
    } else if (ext === '.flac') {
      contentType = 'audio/flac';
    } else if (ext === '.m4a') {
      contentType = 'audio/mp4';
    }
    
    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${path.basename(filePath)}"`,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'Error serving file' }, { status: 500 });
  }
} 