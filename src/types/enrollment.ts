// types/enrollment.ts

export interface Enrollment {
  id: number;
  userId: string;
  courseId: string;
  enrolledAt: string; // ISO 8601 date string
  status: string; // e.g., "Enrolled"
  createdAt: string; // Formatted date string
}