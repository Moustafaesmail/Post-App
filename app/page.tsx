'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './page.module.css';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
}

const POSTS_PER_PAGE = 7;  // Number of posts to display per page

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        setPosts(response.data);
        setFilteredPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts', error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Handle search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setFilteredPosts(
      posts.filter((post) =>
        post.title.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setCurrentPage(1);  // Reset to the first page when searching
  };

  // Handle pagination: Get posts for the current page
  const getCurrentPosts = () => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  };

  // Handle page change (next/previous)
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages()) return;  // Ensure page is within valid range
    setCurrentPage(page);
  };

  // Calculate total pages based on the filtered posts
  const totalPages = () => {
    return Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  };

  // Fetch comments for a selected post
  const fetchComments = async (postId: number) => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments', error);
    }
  };

  // Handle post click to show details and comments
  const handlePostClick = async (postId: number) => {
    const postResponse = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
    setSelectedPost(postResponse.data);
    fetchComments(postId); // Fetch comments for the selected post
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search by title"
        className={styles.searchBar}
      />

      {selectedPost ? (
        <div>
          <h2>{selectedPost.title}</h2>
          <p>{selectedPost.body}</p>

          <h3>Comments:</h3>
          <ul className={styles.commentList}>
            {comments.map((comment) => (
              <li key={comment.id} className={styles.commentItem}>
                <strong>{comment.name}</strong> <span>({comment.email})</span>
                <p>{comment.body}</p>
              </li>
            ))}
          </ul>

          <button className={styles.button} onClick={() => setSelectedPost(null)}>
            Back to Posts
          </button>
        </div>
      ) : (
        <>
          <ul className={styles.postList}>
            {getCurrentPosts().map((post) => (
              <li
                key={post.id}
                className={styles.postItem}
                onClick={() => handlePostClick(post.id)}
              >
                <h2>{post.title}</h2>
                <p>{post.body}</p>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages()}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages()}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}