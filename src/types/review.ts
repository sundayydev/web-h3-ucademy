export interface Review {
  id: number; // int in backend
  courseId: string; // Assumed Guid linking to Course
  rating: number;
  userId: string; // Assumed field
  // Add other fields from ReviewDto
}