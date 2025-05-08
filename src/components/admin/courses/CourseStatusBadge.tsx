import { Badge } from '@/components/ui/badge';
import React from 'react';

interface CourseStatusBadgeProps {
  status?: string;
}

const statusConfig: Record<
  string,
  {
    label: string;
    variant: 'default' | 'outline' | 'secondary' | 'destructive';
  }
> = {
  published: { label: 'Đã xuất bản', variant: 'default' },
  draft: { label: 'Bản nháp', variant: 'outline' },
  reviewing: { label: 'Đang xem xét', variant: 'secondary' },
  // Fallback for other statuses (e.g., 'archived', 'inactive')
  default: { label: 'Không hoạt động', variant: 'destructive' },
};

export const CourseStatusBadge: React.FC<CourseStatusBadgeProps> = ({
  status,
}) => {
  const config =
    statusConfig[status?.toLowerCase() || ''] || statusConfig.default;
  const capitalizedLabel =
    config.label.charAt(0).toUpperCase() + config.label.slice(1);

  return (
    <Badge variant={config.variant} className="px-2 py-1 text-sm font-medium">
      {capitalizedLabel}
    </Badge>
  );
};
