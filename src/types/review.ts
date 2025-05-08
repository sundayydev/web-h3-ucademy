export interface Review {
  id: string; // int in backend
  courseId: string; // Assumed Guid linking to Course
  rating: number;
  userId: string; // Assumed field
  status: string; // Assumed field
}
