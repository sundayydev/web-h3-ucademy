// types/chapter.ts

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description: string;
  orderNumber: number;
  createdAt: string; // Formatted date string
}
