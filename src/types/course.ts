export interface Course {
  id: string;
  title: string;
  urlImage: string;
  price: number;
}

export interface EnrichedCourse extends Course {
  students: number;
  averageRating: string;
  totalReviews: number;
  totalHours: string;
}