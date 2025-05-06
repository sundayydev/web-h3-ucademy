/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import { getPostById } from '@/api/postApi';

import { Post } from '@/types/post';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

const PostDetails = async ({ params }: Props) => {
  let post: Post;

  try {
    post = await getPostById(params.id);
  } catch (error) {
    return notFound(); // Trang 404
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const formatDate = (date?: string) => {
    const d = new Date(date || '');
    return isNaN(d.getTime()) ? 'Không rõ thời gian' : d.toLocaleDateString('vi-VN');
  };

  return (
    <div className="w-full py-20 bg-gray-50 dark:bg-gray-900 px-6 md:px-20">
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

      {/* Author */}
      <div className="flex items-center space-x-4 mb-6">
        <Image
          src={
            post.user?.profileImage
              ? `${baseUrl}${post.user.profileImage}`
              : 'https://via.placeholder.com/150'
          }
          alt={post.user?.fullName || 'Tác giả'}
          width={48}
          height={48}
          className="rounded-full object-cover w-12 h-12"
        />
        <div>
          <p className="font-semibold">{post.user?.fullName || 'Tác giả ẩn danh'}</p>
          <p className="text-gray-500 text-sm">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      {/* Main Image */}
      {post.urlImage ? (
  <Image
    src={new URL(post.urlImage, baseUrl).toString()}
    alt={post.title}
    width={800}
    height={400}
    className="w-full h-auto object-cover rounded-lg mb-6"
  />
) : (
  <Image
    src="https://via.placeholder.com/800x400"
    alt="Placeholder"
    width={800}
    height={400}
    className="w-full h-auto object-cover rounded-lg mb-6"
  />
)}


      {/* Content */}
      <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
        {post.content || 'Không có nội dung.'}
      </p>

      {/* Tags */}
      {post.tags && (
        <div className="mt-6">
          <strong>Tags:</strong>
          <div className="flex flex-wrap mt-2 gap-2">
            {post.tags.split(',').map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      Comments
    
    </div>
  );
};

export default PostDetails;
