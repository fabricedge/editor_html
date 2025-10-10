import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // define supabase logic to insert in the db
    // Define where to save the file
    const filePath = path.join(process.cwd(), 'saved-pages', 'page.html');
    
    // Ensure the directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    // Write the content to the file
    await fs.writeFile(filePath, content, 'utf-8');

    return res.status(200).json({
      message: 'Page saved successfully',
      filePath,
    });
  } catch (error) {
    console.error('Error saving page:', error);
    return res.status(500).json({ error: 'Failed to save page' });
  }
}