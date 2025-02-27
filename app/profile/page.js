"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { put } from "@vercel/blob"; 

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
    const response = await fetch(`/api/getUserPosts?email=${encodeURIComponent(user.email)}`);
    if (response.ok) {
      const data = await response.json();
      setPosts(data.posts);
    }
  };

  const fetchUserLikes = async () => {
    const response = await fetch(`/api/getUserLikes?email=${encodeURIComponent(user.email)}`);
    if (response.ok) {
      const data = await response.json();
      setLikes(data.likes);
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

      console.log("Imagen subida a Vercel Blob:", blob.url);
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
          <img
            src={profileImage || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-300 shadow-lg"
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
          className={`px-4 py-2 rounded ${view === "posts" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setView("posts")}
        >
          Ver Publicaciones
        </button>
        <button
          className={`px-4 py-2 rounded ${view === "likes" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setView("likes")}
        >
          Ver Likes
        </button>
      </div>

      {view === "posts" ? (
        <>
          <h3 className="text-lg font-semibold text-white-800 text-center mt-8">Tus Publicaciones</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="p-4 border rounded-lg shadow-md bg-gray-100">
                  <h4 className="font-bold text-white-700">{post.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{post.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">Aún no has publicado nada.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-white-800 text-center mt-8">Tus Likes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {likes.length > 0 ? (
              likes.map((like) => (
                <div key={like.id} className="p-4 border rounded-lg shadow-md bg-gray-100">
                  <h4 className="font-bold text-white-700">{like.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{like.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">Aún no has dado like a nada.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
