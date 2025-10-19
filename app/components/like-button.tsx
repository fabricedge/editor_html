'use client'
 
import { useState } from 'react'
 
export default function LikeButton({ likes }: { likes: number }) {
  const [currentLikes, setLikes] = useState(likes);

  return (
    <div>
      <button
        onClick={() => {
          // Simulate liking the post
          setLikes(currentLikes + 1);
        }}
        className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
      >
        Like ({currentLikes})
      </button>
    </div>
  );
}