import Image from 'next/image';
import Link from 'next/link';

export default function UserLikes({ likes }) {
    console.log('Likes received:', likes); 

    if (!likes || likes.length === 0) {
        return (
            <div className="text-center text-gray-500">
                No has dado like a ninguna publicación
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {likes.map(post => (
                <div key={post.post_id} className="aspect-square relative overflow-hidden rounded-lg">
                    <img
                        src={post.url}
                        alt={post.content || "Post image"}
                        className="object-cover w-full h-full"
                    />
                </div>
            ))}
        </div>
    );
}