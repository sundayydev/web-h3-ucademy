'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { parse, isValid } from 'date-fns';
import { getPosts } from '@/api/postApi';
import type { Post } from '@/types/post';

const CardPost = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getPosts();
        setPosts(posts);
      } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return 'Không rõ thời gian';
    const parsedDate = parse(date, 'dd-MM-yyyy HH:mm:ss', new Date());
    return isValid(parsedDate) ? parsedDate.toLocaleDateString('vi-VN') : 'Không rõ thời gian';
  };

  const getFullImageUrl = (url?: string): string => {
    if (!url) return 'https://via.placeholder.com/150';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  if (loading) return <p className="text-center">Đang tải bài viết...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
  
      <div className="flex flex-wrap justify-start gap-4">
        {posts.map((post) => {
          const tags = post.Tags?.trim() ? post.Tags.split(',').map(tag => tag.trim()) : [];
          return (
            <Link key={post.Id} href={`/post/${post.Id}`} passHref>
              <div
                className="rounded-2xl shadow-lg overflow-hidden bg-white w-full md:w-1/3 lg:w-[275px] 
                           transform transition-transform duration-300 hover:scale-105 flex flex-col cursor-pointer"
              >
                <div className="flex-grow">
                 <Image
                  src={getFullImageUrl(post.UrlImage)}
                  alt="Ảnh bài viết"
                  width={275}
                  height={160}
                  className="w-full h-40 object-cover rounded-t-2xl"
                />

                </div>
                <div className="bg-gray-50 text-black p-4">
                  <h3 className="text-lg font-semibold mb-2">{post.Title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="border border-blue-600 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full 
                                   transition duration-300 hover:bg-blue-600 hover:text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Image
                        src={
                          post.user?.profileImage
                            ? `${process.env.NEXT_PUBLIC_API_URL}${post.user.profileImage}`
                            : 'https://via.placeholder.com/32'
                        }
                        alt="Avatar"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <p className="font-semibold text-sm">{post.user?.fullName || 'Ẩn danh'}</p>
                    </div>
                    <p>{formatDate(post.CreatedAt)}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
  );
};

export default CardPost;
