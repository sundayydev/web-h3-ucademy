/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { parse, isValid } from 'date-fns';
import { getPosts } from '@/api/postApi';
import type { Post } from '@/types/post';

const topics = [
  'Front-end / Mobile apps',
  'Back-end / Devops',
  'UI / UX / Design',
  'Others',
];

export default function Post() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const posts = await getPosts();
      console.log('Posts fetched:', posts);
      setPosts(posts);
    } catch (error) {
      console.error('Lỗi khi lấy bài viết:', error);
      setError(`Có lỗi xảy ra khi tải bài viết: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Không rõ thời gian';
    const parsedDate = parse(date, 'dd-MM-yyyy HH:mm:ss', new Date());
    return isValid(parsedDate)
      ? parsedDate.toLocaleDateString('vi-VN')
      : 'Không rõ thời gian';
  };

  useEffect(() => {
    console.log('Fetching posts...');
    fetchPosts();
  }, []);

  return (
    <div className="w-full lg:h-auto h-full flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900 md:pl-4">
      <div className="max-w-6xl mx-auto p-2">
        <div className="md:hidden mb-4">
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h4 className="font-semibold mb-4">XEM CÁC BÀI VIẾT THEO CHỦ ĐỀ</h4>
            <div className="space-y-2">
              {topics.map((topic, index) => (
                <button
                  key={index}
                  className="block px-4 py-2 bg-gray-200 rounded-full text-sm w-full text-left"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="font-bold text-3xl text-pink-600 dark:text-pink-400 mb-10">
          Bài viết nổi bật
        </p>

        {loading ? (
          <p>Đang tải bài viết...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-2 space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => {
                  console.log('Rendering post:', post);
                  console.log('Post created at:', post.createdAt);
                  // Tách chuỗi Tags thành mảng
                  const tags =
                    post.tags && post.tags.trim() !== ''
                      ? post.tags.split(',').map((tag) => tag.trim())
                      : [];
                  return (
                    <Link key={post.id} href={`/post/${post.id}`} passHref>
                      <div className="p-4 border rounded-lg shadow-sm flex flex-col gap-4 cursor-pointer mt-5">
                        <div className="flex items-center gap-3">
                          <Image
                            src="/default-avatar.jpg"
                            alt="Avatar"
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <p className="font-semibold dark:text-gray-200">
                            Ẩn danh
                          </p>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="flex-1 flex flex-col gap-2">
                            <h3 className="font-bold text-lg dark:text-gray-200">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                              {post.content}
                            </p>
                          </div>

                          <Image
                            src={
                              post.urlImage && typeof post.urlImage === 'string'
                                ? post.urlImage.startsWith('http')
                                  ? post.urlImage
                                  : `${process.env.NEXT_PUBLIC_API_URL}/${post.urlImage}`
                                : '/default-post-image.jpg'
                            }
                            alt="Ảnh bài viết"
                            width={200}
                            height={112}
                            className="w-[200px] h-[112px] md:w-40 md:h-28 rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex justify-start items-center text-xs text-gray-500 gap-x-2">
                          {tags.length > 0 &&
                            tags.map((tag, index) => (
                              <span
                                key={index}
                                className="border border-blue-600 text-blue-600 text-xs font-semibold px-3 rounded-full 
                                           transition duration-300 hover:bg-blue-600 hover:text-white cursor-pointer flex-shrink-0"
                              >
                                {tag}
                              </span>
                            ))}
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Không có bài viết nào.
                </p>
              )}
            </div>

            <div className="hidden md:block ml-16">
              <div className="sticky top-20 w-72 bg-purple-600 text-white p-4 rounded-lg shadow-lg">
                <h4 className="font-bold text-lg text-center">
                  Khóa học HTML CSS PRO
                </h4>
                <ul className="text-sm text-left space-y-2 mt-2">
                  <li>✔ Thực hành 8 dự án</li>
                  <li>✔ Hơn 300 bài tập thử thách</li>
                  <li>✔ Tặng ứng dụng Flashcards</li>
                  <li>✔ Tặng 3 Games luyện HTML CSS</li>
                  <li>✔ Tặng 20+ thiết kế trên Figma</li>
                </ul>
                <button className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-full font-semibold">
                  Tìm hiểu thêm →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
