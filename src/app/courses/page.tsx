import CourseCard from './CourseCard';
import { getCourses } from '@/api/courseApi';
import { getReviews } from '@/api/reviewApi';
import { getLessons } from '@/api/lessonApi';

// Define interfaces aligned with backend DTOs
interface Course {
  id: string;
  title: string;
  urlImage: string;
  price: number;
}

interface Review {
  id: number;
  courseId: string;
  rating: number;
  userId: string;
}

interface Lesson {
  id: string;
  courseId: string;
  duration: number;
}

interface EnrichedCourse extends Course {
  students: number;
  averageRating: string;
  totalReviews: number;
  totalHours: string;
}

async function fetchCourses(): Promise<EnrichedCourse[]> {
  try {
    const courseResponse = await getCourses();
    if (!Array.isArray(courseResponse)) {
      throw new Error('Dữ liệu API không hợp lệ');
    }

    // Ánh xạ từ PascalCase sang camelCase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedCourses: Course[] = courseResponse.map((course: any) => ({
      id: course.Id,
      title: course.Title,
      urlImage: course.UrlImage,
      price: course.Price,
    }));

    // Lọc bỏ các khóa học có ID không hợp lệ
    const validCourses = mappedCourses.filter(
      (course) => course.id && typeof course.id === 'string'
    );

    // Loại bỏ trùng lặp theo ID
    const uniqueCourses = Array.from(
      new Map(validCourses.map((course) => [course.id, course])).values()
    );

    const reviewsResponse: Review[] = await getReviews();
    const lessonsResponse: Lesson[] = await getLessons();

    const enrichedCourses = await Promise.all(
      uniqueCourses.map(async (course: Course): Promise<EnrichedCourse> => {
        let totalStudents = 0;
        try {
          totalStudents = 0; // Placeholder
        } catch (enrollmentError) {
          console.warn(`Không thể lấy đăng ký cho khóa học ${course.id}:`, enrollmentError);
        }

        let averageRating = 0;
        let totalReviews = 0;
        try {
          const courseReviews = reviewsResponse.filter((r) => r.courseId === course.id);
          totalReviews = courseReviews.length;
          averageRating =
            totalReviews > 0
              ? courseReviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / totalReviews
              : 0;
        } catch (reviewError) {
          console.warn(`Không thể lấy đánh giá cho khóa học ${course.id}:`, reviewError);
        }

        let totalHours = '0 phút';
        try {
          const courseLessons = lessonsResponse.filter((l) => l.courseId === course.id);
          if (courseLessons && Array.isArray(courseLessons)) {
            const totalMinutes = courseLessons.reduce((sum, lesson) => {
              return sum + (Number(lesson.duration) || 0);
            }, 0);
            if (totalMinutes >= 60) {
              const hours = Math.floor(totalMinutes / 60);
              const minutes = totalMinutes % 60;
              totalHours = `${hours}h${minutes}p`;
            } else {
              totalHours = `${totalMinutes} phút`;
            }
          }
        } catch (lessonError) {
          console.warn(`Không thể lấy lessons cho khóa học ${course.id}:`, lessonError);
        }

        return {
          ...course,
          students: totalStudents,
          averageRating: averageRating.toFixed(1),
          totalReviews,
          totalHours,
        };
      })
    );

    return enrichedCourses;
  } catch (err) {
    console.error('Lỗi khi gọi API:', err);
    throw new Error('Không thể tải khóa học');
  }
}

export default async function CourseListPage() {
  let courses: EnrichedCourse[] = [];
  let error: string | null = null;

  try {
    courses = await fetchCourses();
    console.log('Danh sách khóa học:', courses);
  } catch (err) {
    error = (err as Error).message;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-start gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}