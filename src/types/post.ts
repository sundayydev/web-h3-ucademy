export interface Post {
  Id: string;
  UserId: string;
  Title: string;
  Content: string;
  Tags: string;
  UrlImage?: string;
  CreatedAt?: string;
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
