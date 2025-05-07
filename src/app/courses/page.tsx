'use client';

import { useState, useEffect } from 'react';
import { getCourses } from '@/api/courseApi';
import CourseCard from '@/app/courses/cardCourse';
import { Course } from '@/types/course';

// Extended interface for additional fields
interface CourseExtended extends Course {
  views: number;
  lessons: number;
  duration: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        // Mock additional data since API doesn't provide views, lessons, duration
        const extendedData: CourseExtended[] = data.map((course: Course) => ({
          ...course,
          views: 34252, // Mock data
          lessons: 55, // Mock data
          duration: '10h18p', // Mock data
        }));
        setCourses(extendedData);
        setLoading(false);
      } catch (error) {
        setError('Không thể tải danh sách khóa học: ' + (error as Error).message);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
      <div className="flex flex-wrap justify-start gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    
  );
}