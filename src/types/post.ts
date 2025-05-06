export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string;
  urlImage?: string;
  createdAt?: string;
  user: {
    fullName: string;
    profileImage?: string;
  };
}

export interface CreatePost {
  title: string;
  content: string;
  tags?: string;
  urlImage?: string;
}

export interface UpdatePost {
  title?: string;
  content?: string;
  tags?: string;
  urlImage?: string;
}
