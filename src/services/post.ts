import { Service } from "typedi";
import { ICreatePost, IPagination, IUpdatePost, IUser } from "../interfaces";
import { Mailer } from "../utils/mailing";
import { IFindOptions, Post } from "../database/repository";
import { Prisma } from "@prisma/client";
import { Message } from "../utils";

@Service()
export class PostService {
  constructor(private readonly post: Post, private readonly mail: Mailer) { }

  public async createPost(payload: ICreatePost, user: IUser) {
    let data: Prisma.PostCreateInput = {
      title: payload.title,
      content: payload.content,
      description: payload.description,
      thumbnailUrl: payload.thumbnailUrl,
      user: { connect: { id: user.id } },
    };

    const postCreated = await this.post.create(data);

    return postCreated;
  }

  public async updatePost(payload: IUpdatePost) {
    const findOption = {
      isDeleted: false,
      id: payload.postId,
    };

    const post = await this.post.findById(findOption);

    if (!post) {
      throw new Error(Message.postNotFound);
    }

    let data: Prisma.PostUpdateInput = {
      title: payload.title ? payload.title : post.title,
      content: payload.content ? payload.content : post.content,
      description: payload.description ? payload.description : post.description,
      thumbnailUrl: payload.thumbnailUrl ? payload.thumbnailUrl : post.thumbnailUrl,
    };

    await this.post.updatePostById(payload.postId, data);

    return;
  }

  public async getPostById(id: string) {
    const selectOptions: IFindOptions = {
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
            fullName: true,
            id: true,
          },
        },
      },
    };

    const findOption = {
      isDeleted: false,
      id,
    };

    const post = await this.post.findById(findOption, selectOptions);

    if (!post) {
      throw new Error(Message.postNotFound);
    }

    return post;
  }

  public async deletePostById(id: string) {
    const findOption = {
      isDeleted: false,
      id,
    };

    const post = await this.post.findById(findOption);

    if (!post) {
      throw new Error(Message.postNotFound);
    }

    await this.post.updatePostById(id, { isDeleted: true });

    return;
  }

  public async getPosts(payload: IPagination) {

    const currentPage = parseInt(payload?.pageNumber || "1")
    const limit = parseInt(payload?.pageSize || "20")
    const skip = limit * (currentPage - 1)

    const totalCount = await this.post.totalPost();

    const totalPages = Math.ceil(totalCount / limit);
    const hasPrevious = currentPage > 1 && totalPages > 1;
    const hasNext = currentPage < totalPages;

    const findOption = {
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
            fullName: true,
            id: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    };

    const result = await this.post.find({ isDeleted: false }, findOption);

    return {
      result,
      currentPage,
      pageSize: limit,
      totalPages,
      totalCount,
      hasPrevious,
      hasNext,
    };
  }
}
