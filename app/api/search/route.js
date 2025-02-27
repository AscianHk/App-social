"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchTerm.length > 0) {
            const searchUsers = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`/api/search?term=${encodeURIComponent(searchTerm)}`);
                    console.log('Response status:', response.status); // Debug
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Search results:', data); // Debug
                        setUsers(data);
                    } else {
                        console.error('Response not OK:', await response.text());
                    }
                } catch (error) {
                    console.error('Error searching:', error);
                } finally {
                    setLoading(false);
                }
            };
    
            const timeoutId = setTimeout(searchUsers, 300);
            return () => clearTimeout(timeoutId);
        } else {
            setUsers([]);
        }
    }, [searchTerm]);

    return (
        <div className="w-full max-w-5xl mx-auto p-6" >
            <input 
                type="text" 
                placeholder="Buscar usuarios..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 mb-6 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {loading ? (
                <div className="text-center p-4">
                    <p>Buscando...</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {users.map(user => (
                        <div key={user.user_id} className="border rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Image 
                                    src={user.picture || '/default-avatar.png'}
                                    alt={user.username}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <span className="font-semibold">{user.username}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {user.posts && user.posts.map(post => (
                                    <Link href={`/post/${post.post_id}`} key={post.post_id}>
                                        <div className="aspect-square relative overflow-hidden rounded-lg hover:opacity-90">
                                            <Image
                                                src={post.url}
                                                alt={post.content || "Post image"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {searchTerm && users.length === 0 && (
                        <div className="text-center p-8">
                            <p className="text-gray-500">No se encontraron usuarios.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;