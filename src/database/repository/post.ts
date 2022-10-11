import { Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "..";

export interface IFindOptions {
  select?: Prisma.PostSelect;
  include?: Prisma.PostInclude;
}

@Service()
export class Post {
  async create(data: Prisma.PostCreateInput) {
    return await prisma.post.create({ data });
  }

  public async findById(where: Prisma.PostWhereInput, options?: IFindOptions) {
    return await prisma.post.findFirst({ where: { ...where }, ...options });
  }

  public async find(where: Prisma.PostWhereInput, options?: IFindOptions) {
    return await prisma.post.findMany({ where: { ...where }, ...options });
  }

  public async totalPost() {
    return await prisma.post.count({
      where: {
        isDeleted: false,
      },
    });
  }

  public async updatePostById(id: string, data: Prisma.PostUpdateInput) {
    return await prisma.post.update({ where: { id }, data: { ...data } });
  }
}
