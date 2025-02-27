import Image from 'next/image';
import Link from 'next/link';

export default function UserPosts({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No tienes publicaciones todavía
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {posts.map(post => (
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
  );
}