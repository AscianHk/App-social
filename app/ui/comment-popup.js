'use client'
import { useState } from 'react'
import { addComment } from '../lib/actions'

export default function CommentPopup({ isOpen, onClose, post_id, comments }) {
    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />
            <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        bg-blue-700 rounded-lg p-4 z-50 w-96 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Comentar</h2>

                <form action={addComment}>
                    <input type="hidden" name="post_id" value={post_id} />
                    <input 
                        name="content" 
                        className="w-full p-2 border rounded-lg text-black" 
                        type="text" 
                        placeholder="Añade un comentario..."
                        autoFocus
                    />
                </form>
            </div>
        </>
    );
}