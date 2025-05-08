// components/admin/courses/CourseAdminHeader.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { Course } from '@/types/course';
import { StatusBadge } from './StatusBadge';

interface CourseAdminHeaderProps {
  course: Course;
  courseId: string;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
}

export default function CourseAdminHeader({
  course,
  courseId,
  onStatusChange,
  onDelete,
}: CourseAdminHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Chi tiết khóa học
          <StatusBadge status={course.status} />
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý khóa học ID{' '}
          <span className="text-pink-500 font-semibold">#{courseId}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select defaultValue={course.status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Change Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="reviewing">Reviewing</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/courses/${courseId}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/admin/courses/${courseId}/edit`)}
        >
          <Edit className="h-4 w-4" />
        </Button>

        <ConfirmDeleteDialog title={course.title} onConfirm={onDelete} />
      </div>
    </div>
  );
}
