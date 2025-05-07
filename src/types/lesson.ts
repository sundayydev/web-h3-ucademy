export interface Lesson {
  id: string;
  chapterId: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  videoUrls: string; // Single URL string
  duration: number; // Duration in seconds
  orderNumber: number;
  status: string; // e.g., "Pending"
  approvedBy: string | null;
  createdAt: string; // Formatted date string
}