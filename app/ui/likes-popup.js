'use client'
import { useState } from 'react';

export default function LikesPopup({ numLikes, likesList }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="hover:underline cursor-pointer"
      >
        {numLikes} Me gusta
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-60 bg-gray-500 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
            <div className="py-2">
              {likesList.map((user) => (
                <div key={user.user_id} className="px-4 py-2 bg-gray-800">
                  <span className="font-semibold">{user.username} dió like</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}