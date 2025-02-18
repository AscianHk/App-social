import { ChatBubbleLeftIcon, HeartIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import Link from "next/link"
import LikeButton from "./like-button"
import { addComment } from "../lib/actions"

export default ({
    user_id, 
    post,
    isLikedInitial,
    comments
    
}) => {

    return (
        <div className="flex flex-col max-w-sm gap-2">
           <div className="flex gap-2">
                <Image src={post.picture} 
                    alt="hola"
                    className="rounded-full"
                    width={24}
                    height={24}
                />
                <span>{post.username}</span>
                <span>1 dia</span>
           </div>

           <div>
                <Link href={`/post/${post.post_id}`}>
                    <Image src={post.url} 
                        alt="hola"
                        className=""
                        width={284}
                        height={284}
                    />
                </Link>
           </div>

           <div>
                <div className="flex gap-2">
                    <LikeButton post_id={post.post_id} user_id={user_id} isLikedInitial={isLikedInitial} />
                    <ChatBubbleLeftIcon className="w-8" />
                </div>
                <span>{post.num_likes} Me gusta</span>
           </div>
           <div>
            <p><span className="font-bold">{post.username}</span> {post.content}</p>
           </div>
           
           <div>
            {
                comments.map((comment) => (
                    <p key={comment.comment_id}>{comment.content}</p>
                ))
            }
            </div>
           <form action={addComment}>
            <input type="hidden" name="post_id" value={post.post_id} />
             <input name="content" className="w-full outline-0 dark:bg-neutral-950" type="text" placeholder="Add comment" />
           </form>

           
        </div>
    )
}