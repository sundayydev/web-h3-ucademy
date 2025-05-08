"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Minus, BookOpen, CheckCircle, GraduationCap, Globe, PlayCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCourseById } from '@/api/courseApi';
import { getChaptersByCourseId } from '@/api/chapterApi';
import { getLessonsByChapterId } from '@/api/lessonApi';
import { getEnrollmentsByCourseId, createEnrollment } from '@/api/enrollmentApi';
import { Course } from '@/types/course';
import { Chapter } from '@/types/chapter';
import { Lesson } from '@/types/lesson';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Details = () => {
  const { id } = useParams();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id as string);
        setCourse(data);
      } catch (error) {
        setError('Lỗi khi lấy thông tin khóa học');
        console.error('Lỗi khi lấy thông tin khóa học:', error);
      }
    };

    const fetchChapters = async () => {
      try {
        const data = await getChaptersByCourseId(id as string);
        console.log('Chapters response:', data);
        setChapters(data || []);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách chương:', error);
      }
    };

    const fetchLessons = async () => {
      try {
        const lessonMap: Record<string, Lesson[]> = {};
        for (const chapter of chapters) {
          const lessonData = await getLessonsByChapterId(chapter.id);
          lessonMap[chapter.id] = lessonData;
        }
        setLessons(lessonMap);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bài học:', error);
      }
    };

    Promise.all([fetchCourse(), fetchChapters()])
      .then(() => {
        if (chapters.length > 0) fetchLessons();
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, chapters.length, chapters]);
    setIsClient(true); // Đánh dấu client đã sẵn sàng
    if (!id) {
      setError('Không tìm thấy ID khóa học');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [courseData, chaptersData] = await Promise.all([
          getCourseById(id as string),
          getChaptersByCourseId(id as string),
        ]);
        setCourse(courseData);
        setChapters(chaptersData || []);

        if (chaptersData && chaptersData.length > 0) {
          const lessonPromises = chaptersData.map(chapter => getLessonsByChapterId(chapter.id));
          const lessonResults = await Promise.all(lessonPromises);
          const lessonMap: Record<string, Lesson[]> = {};
          chaptersData.forEach((chapter: Chapter, index: number) => {
            lessonMap[chapter.id] = lessonResults[index] || [];
          });
          setLessons(lessonMap);

          if (lessonResults.flat().length > 0) {
            setCurrentLessonId(lessonResults.flat()[0].id);
          }
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (token) {
          const enrollments = await getEnrollmentsByCourseId(id as string);
          setIsRegistered(enrollments && enrollments.length > 0);
        }
      } catch (err) {
        setError('Lỗi khi lấy thông tin khóa học');
        console.error('Lỗi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleExpand = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const calculateTotalChapters = () => chapters.length;
  const calculateTotalLessons = () => Object.values(lessons).reduce((sum, ls) => sum + ls.length, 0);
  const calculateTotalDuration = () => {
    const totalSeconds = Object.values(lessons).reduce((sum, ls) => sum + ls.reduce((acc, lesson) => acc + (lesson.duration || 0), 0), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return totalSeconds >= 3600 ? `${hours}h ${minutes}p` : `${minutes} phút`;
  };

  const handleRegisterClick = async () => {
    if (!course || !isClient) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Vui lòng đăng nhập để đăng ký khóa học!');
      router.push('/login');
      return;
    }

    if (!course.price || course.price === 0) {
      if (!isRegistered) {
        try {
          await createEnrollment(id as string);
          setIsRegistered(true);
          toast.success('Đăng ký khóa học miễn phí thành công!');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại!';
          toast.error(errorMessage);
          console.error('Lỗi khi tạo enrollment:', error);
        }
      } else if (currentLessonId) {
        router.push(`/learning/${currentLessonId}`);
      } else {
        toast.error('Không tìm thấy bài học để vào học!');
      }
    } else {
      try {
        await createEnrollment(id as string);
        router.push(`/payment/${course.id}`);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại!';
        toast.error(errorMessage);
        console.error('Lỗi khi tạo enrollment:', error);
      }
    }
  };

  if (!isClient) {
    return <div className="text-center pt-10">Đang tải...</div>;
  }

  if (loading) {
    return <div className="text-center pt-10">Đang tải...</div>;
  }

  if (error || !course) {
    return <p className="text-center text-red-500 pt-10">{error || 'Không tìm thấy khóa học'}</p>;
  }

  const courseContents = course.contents ? course.contents.filter(line => line.trim() !== '') : [];

  return (
      <div className="max-w-7xl mx-auto p-4 bg-gray-50 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Bạn sẽ học được gì?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {courseContents.length > 0 ? (
                  courseContents.map((content: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="text-orange-500" size={20} />
                        <span className="text-gray-700">{content}</span>
                      </div>
                  ))
              ) : (
                  <p className="text-gray-600">Chưa có nội dung học cụ thể.</p>
              )}
            </div>
          </div>

          <h2 className="text-xl font-bold mt-8 text-gray-800">Nội dung khóa học</h2>
          <div className="mt-4 text-gray-600 flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <BookOpen size={18} className="text-pink-500" />
              <span className="text-sm font-medium">
              Tổng số <strong className="text-black">{calculateTotalChapters()}</strong> chương
            </span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen size={18} className="text-pink-500" />
              <span className="text-sm font-medium">
              Tổng số <strong className="text-black">{calculateTotalLessons()}</strong> bài học
            </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={18} className="text-blue-500" />
              <span className="text-sm font-medium">{calculateTotalDuration()}</span>
            </div>
          </div>

          <ul className="list-none space-y-2 mt-4 w-full">
            {chapters.map((chapter: Chapter, index: number) => {
              const chapterLessons = lessons[chapter.id] || [];
              return (
                  <div key={chapter.id} className="overflow-hidden w-full">
                    <div
                        className={`bg-gray-100 p-2 cursor-pointer flex justify-between items-center w-full h-14 ${expanded === index ? 'rounded-t-2xl' : 'rounded-2xl'}`}
                        onClick={() => toggleExpand(index)}
                    >
                      <div className="flex items-center space-x-2">
                        {expanded === index ? (
                            <Minus className="text-pink-500" size={16} />
                        ) : (
                            <Plus className="text-pink-500" size={16} />
                        )}
                        <span className="text-sm font-bold">{chapter.title}</span>
                      </div>
                    </div>
                    {expanded === index && (
                        <div className="bg-white p-3 border-x border-b rounded-b-2xl w-full">
                          {chapterLessons.length > 0 ? (
                              <ul className="mt-2 space-y-2">
                                {chapterLessons.map((lesson: Lesson) => (
                                    <li key={lesson.id} className="flex items-center justify-between">
                                      <span className="text-sm">{lesson.title}</span>
                                      {lesson.videoUrls && (
                                          <button
                                              className="ml-2 flex items-center space-x-2 text-blue-500"
                                              onClick={() => window.open(lesson.videoUrls, '_blank')}
                                          >
                                            <PlayCircle size={16} />
                                            <span>Xem video</span>
                                          </button>
                                      )}
                                    </li>
                                ))}
                              </ul>
                          ) : (
                              <p className="text-gray-600 text-sm mt-2">Chưa có bài học</p>
                          )}
                        </div>
                    )}
                  </div>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col items-center space-y-4 p-4">
          <div className="flex items-center text-lg font-bold text-rose-500">
            {course.price ? `${course.price.toLocaleString()} VND` : 'Miễn phí'}
          </div>

          <Button
              className="w-64 text-white rounded-2xl shadow-lg bg-pink-600 hover:bg-pink-700"
              onClick={handleRegisterClick}
              disabled={!currentLessonId && isRegistered}
          >
            {isRegistered ? 'Vào học' : (!course.price || course.price === 0) ? 'Đăng ký học' : 'Đăng ký học'}
          </Button>

          <ul className="mt-4 space-y-2 text-gray-600">
            <li className="flex items-center">
              <BookOpen className="text-pink-500 mr-2" size={15} />
              Tổng số <strong className="text-gray-600 mr-1 ml-1 font-semibold">{calculateTotalChapters()}</strong> chương
            </li>
            <li className="flex items-center">
              <BookOpen className="text-pink-500 mr-2" size={15} />
              Tổng số <strong className="text-gray-600 mr-1 ml-1 font-semibold">{calculateTotalLessons()}</strong> bài học
            </li>
            <li className="flex items-center">
              <Clock className="text-pink-500 mr-2" size={15} />
              Thời lượng: <strong className="text-gray-600 mr-1 ml-1 font-semibold">{calculateTotalDuration()}</strong>
            </li>
            <li className="flex items-center">
              <GraduationCap className="text-pink-500 mr-2" size={15} />
              Trình độ cơ bản
            </li>
            <li className="flex items-center">
              <Globe className="text-pink-500 mr-2" size={15} />
              Học mọi lúc, mọi nơi
            </li>
          </ul>
        </div>
      </div>
  );
};

export default Details;