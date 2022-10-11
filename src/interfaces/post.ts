export interface ICreatePost {
  title: string;
  content: string;
  description: string;
  thumbnailUrl: string;
  communityId?: string;
}

export interface IUpdatePost {
  postId: string;
  title?: string;
  content?: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface IPagination {
  pageSize?: string;
  pageNumber?: string;
}