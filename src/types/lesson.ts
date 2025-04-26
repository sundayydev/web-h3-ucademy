export interface Lesson {
  id: string; // Guid in backend
  courseId: string; // Assumed Guid linking to Course
  duration: number;
  // Add other fields from LessonDto
}