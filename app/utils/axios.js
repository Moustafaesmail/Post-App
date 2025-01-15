import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

const handlePostClick = async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}`);
      const commentsResponse = await api.get(`/posts/${postId}/comments`);
      setSelectedPost({ ...response.data, comments: commentsResponse.data });
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };
export default api;