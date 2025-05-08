// components/admin/courses/CourseNotFound.tsx
import { Button } from '@/components/ui/button';

interface CourseNotFoundProps {
  onReturn: () => void;
}

export default function CourseNotFound({ onReturn }: CourseNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Không tìm thấy khóa học</h1>
      <p>Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <Button className="mt-6" variant="outline" onClick={onReturn}>
        Return to Course List
      </Button>
    </div>
  );
}
