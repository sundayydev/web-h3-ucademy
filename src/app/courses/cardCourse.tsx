'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/types/course';

// Extended interface for additional fields
interface CourseExtended extends Course {
  views?: number;
  lessons?: number;
  duration?: string;
}

interface CourseCardProps {
  course: CourseExtended;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const getFullImageUrl = (url?: string): string => {
    if (!url) return 'https://via.placeholder.com/275x160';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  return (
    <Link href={`/courses/${course.id}`} passHref>
      <div
        className="rounded-2xl shadow-lg overflow-hidden bg-white w-full max-w-[275px]
                   transform transition-transform duration-300 hover:scale-105 flex flex-col cursor-pointer"
      >
        <div className="flex-grow">
          <Image
            src={getFullImageUrl(course.urlImage)}
            alt={course.title}
            width={275}
            height={160}
            className="w-full h-40 object-cover rounded-t-2xl"
          />
        </div>
        <div className="bg-gray-50 text-black p-4">
          <h3 className="font-semibold text-base line-clamp-2">
            {course.title}
          </h3>
          <p className="text-orange-500 font-semibold mt-2">
            {course.price === 0
              ? 'Miễn phí'
              : `${course.price.toLocaleString('vi-VN')} VND`}
          </p>
          <div className="flex justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span>👁️</span>
              <span>{course.views?.toLocaleString('vi-VN') || '0'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📚</span>
              <span>{course.lessons || '0'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⏳</span>
              <span>{course.duration || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
