
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  urlImage?: string;
  instructorId: string;
  categoryId: string | null;
  createdAt: string; // You may convert this to Date if you're handling dates properly
  contents: string | null; // Adjust type if contents has a defined structure
}
