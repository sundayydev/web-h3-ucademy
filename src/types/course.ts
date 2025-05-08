export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  urlImage?: string;
  instructorId: string;
  categoryId: string | null;
  createdAt: string;
  contents: string[];
}
