'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaClock, FaUser, FaStar } from 'react-icons/fa';

interface EnrichedCourse {
  id: string;
  title: string;
  urlImage: string;
  price: number;
  students: number;
  averageRating: string;
  totalReviews: number;
  totalHours: string;
}

interface CourseCardProps {
  course: EnrichedCourse;
}

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();

  const handleCourseClick = () => {
    router.push(`/details/${course.id}`);
  };

  return (
    <div
      className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-r text-white w-full md:w-1/3 lg:w-[275px] transform transition-transform duration-300 hover:scale-105 flex flex-col cursor-pointer"
      onClick={handleCourseClick}
    >
      <div className="flex-grow">
        <Image
          src={course.urlImage}
          alt={course.title}
          width={275}
          height={160}
          className="w-full h-40 object-cover rounded-lg"
          priority={false}
          unoptimized={true}
        />
      </div>
      <div className="bg-gray-50 text-black p-4 min-w-[200px]">
        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
        <div className="mb-2">
          <p className="text-rose-500 text-lg font-semibold">
            {course.price > 0 ? `${course.price.toLocaleString()} VND` : 'Miễn Phí'}
          </p>
        </div>
        <div className="flex justify-between text-sm font-semibold items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FaUser />
              <p className="text-center truncate">{course.students} học viên</p>
            </div>
            <div className="flex items-center gap-1">
              <FaClock />
              <p className="text-center truncate">{course.totalHours}</p>
            </div>
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-500" />
              <p className="text-center truncate">
                {course.averageRating} ({course.totalReviews})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}