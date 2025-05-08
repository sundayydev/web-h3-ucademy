import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status?: 'published' | 'draft' | 'reviewing' | 'rejected';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant =
    status === 'published'
      ? 'default'
      : status === 'draft'
        ? 'outline'
        : status === 'reviewing'
          ? 'secondary'
          : 'destructive';

  return (
    <Badge variant={variant}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </Badge>
  );
}
