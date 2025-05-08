// components/admin/courses/CourseBasicInfo.tsx
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Course } from '@/types/course';
import { Category } from '@/types/category';

interface CourseBasicInfoProps {
  course: Course;
  category: Category | null;
  courseId: string;
  totalLessons?: number;
}

export default function CourseBasicInfo({
  course,
  category,
  courseId,
  totalLessons = 0,
}: CourseBasicInfoProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin khóa học</CardTitle>
        <CardDescription>Một số thông tin cơ bản của khóa học</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <CourseThumbnail image={course.urlImage} title={course.title} />
          <CourseDetails
            course={course}
            category={category}
            totalLessons={totalLessons}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/admin/courses/${courseId}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa khóa học
        </Button>
      </CardFooter>
    </Card>
  );
}

interface CourseThumbnailProps {
  image?: string;
  title: string;
}

function CourseThumbnail({ image, title }: CourseThumbnailProps) {
  return (
    <div className="relative aspect-video w-full md:w-64 h-40 overflow-hidden rounded-lg flex-shrink-0">
      {image ? (
        <Image src={image} alt={title} fill className="object-cover" />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Không có ảnh</p>
        </div>
      )}
    </div>
  );
}

interface CourseDetailsProps {
  course: Course;
  category: Category | null;
  totalLessons: number;
}

function CourseDetails({ course, category, totalLessons }: CourseDetailsProps) {
  return (
    <div className="flex-grow">
      <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Danh mục</p>
          <p className="font-medium">{category?.name || 'Uncategorized'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Ngày tạo</p>
          <p className="font-medium">
            {format(new Date(course.createdAt), 'dd/MM/yyyy')}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Giá</p>
          <p className="font-medium">{course.price} VNĐ</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tổng số bài học</p>
          <p className="font-medium">{totalLessons}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">Mô tả</p>
      <p className="line-clamp-3">{course.description}</p>
    </div>
  );
}
