const fetchUserPosts = async (user) => {
    console.log("Fetching user posts...");
    const response = await fetch(`/api/getUserPosts?email=${encodeURIComponent(user.email)}`);
    if (response.ok) {
      const data = await response.json();
      console.log("User posts fetched:", data.posts);
      return data.posts;
    } else {
      console.error("Failed to fetch user posts");
      return null;
    }
};

const fetchUserLikes = async (user) => {
    console.log("Fetching user likes...");
    const response = await fetch(`/api/getUserLikes?email=${encodeURIComponent(user.email)}`);
    if (response.ok) {
      const data = await response.json();
      console.log("User likes fetched:", data.likes);
      return data.likes;
    } else {
      console.error("Failed to fetch user likes");
      return null;
    }
};

export { fetchUserPosts, fetchUserLikes };