// src/lib/api/postApi.ts
import { Post, CreatePost, UpdatePost } from '@/types/post';

// Lấy tất cả bài viết
export async function getPosts(): Promise<Post[]> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/post`;
  console.log('Fetching posts from:', url);
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    console.error('API error:', response.status, response.statusText);
    throw new Error(`Không thể lấy danh sách bài viết: ${response.statusText}`);
  }
  const data = await response.json();
  console.log('API response:', data);
  return data;
}

// Lấy bài viết theo ID
export async function getPostById(id: string): Promise<Post> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Bài viết không tồn tại');
    }
    throw new Error('Không thể lấy bài viết');
  }
  return response.json();
}

// Tạo bài viết mới
export async function createPost(post: CreatePost): Promise<Post> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  if (!response.ok) {
    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.message || 'Dữ liệu không hợp lệ');
    }
    throw new Error('Không thể tạo bài viết');
  }
  return response.json();
}

// Cập nhật bài viết
export async function updatePost(id: string, post: UpdatePost): Promise<Post> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Bài viết không tồn tại');
    }
    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.message || 'Dữ liệu không hợp lệ');
    }
    throw new Error('Không thể cập nhật bài viết');
  }
  return response.json();
}

// Xóa bài viết
export async function deletePost(id: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Bài viết không tồn tại');
    }
    throw new Error('Không thể xóa bài viết');
  }
}