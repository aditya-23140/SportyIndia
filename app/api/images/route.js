import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const generateRandomId = () => Math.floor(1000 + Math.random() * 9000);

export async function POST(req) {
  try {
    const { imageBuffer } = await req.json();

    if (!imageBuffer) {
      return NextResponse.json({ error: 'Image buffer not provided' }, { status: 400 });
    }

    const base64Image = imageBuffer;
    const imageId = generateRandomId();
    const imagePath = path.join(process.cwd(), 'public', 'images', `${imageId}.png`);

    const imagesDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const buffer = Buffer.from(base64Image, 'base64');

    fs.writeFileSync(imagePath, buffer);
    console.log(imageId)
    return NextResponse.json({ imageId, base64Image }, { status: 201 });

  } catch (error) {
    console.error('Error in upload-image API:', error);
    return NextResponse.json({ error: 'Failed to upload image', details: error.message }, { status: 500 });
  }
}
