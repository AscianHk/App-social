"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { put } from "@vercel/blob"; 
import Image from "next/image";
import UserPosts from "./posts/page";
import UserLikes from "./likes/page";

export default function ProfilePage() {
  const { user, error, isLoading } = useUser();
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [view, setView] = useState("posts");

  useEffect(() => {
    if (user) {
      setProfileImage(user.picture); 
      fetchUserPosts();
      fetchUserLikes();
    }
  }, [user]);

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error || !user) return <div className="text-center mt-10">No estás autenticado o hubo un error.</div>;

  const username = user.nickname || "Usuario Anónimo";

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/getUserPosts?email=${encodeURIComponent(user.email)}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchUserLikes = async () => {
    try {
      const response = await fetch(`/api/getUserLikes?email=${encodeURIComponent(user.email)}`);
      if (response.ok) {
        const data = await response.json();
        setLikes(data);
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const token = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;
      if (!token) throw new Error("No se encontró el token de Vercel Blob Storage.");
      
      const blob = await put(file.name, file, { access: "public", token });
      setProfileImage(blob.url);

      await fetch("/api/updateProfileImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, imageUrl: blob.url }),
      });
    } catch (err) {
      console.error("Error al subir la imagen:", err);
      alert("Hubo un error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
        <label className="cursor-pointer relative">
          <Image
            src={profileImage || "/default-avatar.png"}
            alt="Profile"
            width={128}
            height={128}
            className="rounded-full object-cover border-2 border-gray-300 shadow-lg"
          />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
        <div>
          <h2 className="text-xl font-bold text-white-800">{username}</h2>
          <p className="text-sm text-gray-500 mt-1">¡Bienvenido a tu perfil!</p>
        </div>
      </div>

      {uploading && <p className="text-sm text-blue-500">Subiendo imagen...</p>}

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setView('posts')}
          className={`px-4 py-2 rounded ${view === "posts" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Ver Publicaciones
        </button>
        <button
          onClick={() => setView('likes')}
          className={`px-4 py-2 rounded ${view === "likes" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Ver Likes
        </button>
      </div>

      <div className="mt-8">
        {view === 'posts' && <UserPosts posts={posts} />}
        {view === 'likes' && <UserLikes likes={likes} />}
      </div>
    </div>
  );
}