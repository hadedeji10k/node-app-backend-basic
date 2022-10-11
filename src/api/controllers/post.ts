import { Service } from "typedi";
import { Message, response } from "../../utils";
import { FastifyReply, FastifyRequest } from "fastify";
import { ICreatePost } from "../../interfaces";
import { PostService } from "../../services";
import { IPagination, IUpdatePost } from '../../interfaces/post';

@Service()
export class PostController {
    constructor(private readonly postService: PostService) { }

    public async createPost(request: FastifyRequest, reply: FastifyReply) {
        const { body, user }: { [key: string]: any } = request;

        const payload: ICreatePost = {
            title: body.title,
            description: body.description,
            content: body.content,
            thumbnailUrl: body.thumbnailUrl,
            communityId: body.communityId,
        };

        const data = await this.postService.createPost(payload, user);

        return response.success(reply, { message: Message.postCreated, data });
    }

    public async updatePost(request: FastifyRequest, reply: FastifyReply) {
        const { body, params }: { [key: string]: any } = request;

        const payload: IUpdatePost = {
            postId: params.id,
            title: body.title,
            description: body.description,
            content: body.content,
            thumbnailUrl: body.thumbnailUrl,
        };

        const data = await this.postService.updatePost(payload);

        return response.success(reply, { message: Message.postUpdated, data });
    }

    public async getPost(request: FastifyRequest, reply: FastifyReply) {
        const { params }: { [key: string]: any } = request;

        const data = await this.postService.getPostById(params.id);

        return response.success(reply, { message: Message.postFetched, data });
    }

    public async getPosts(request: FastifyRequest, reply: FastifyReply) {
        const { query }: { [key: string]: any } = request;

        const payload: IPagination = {
            pageSize: query.pageSize,
            pageNumber: query.pageNumber
        }

        const data = await this.postService.getPosts(payload);

        return response.success(reply, { message: Message.postFetched, data });
    }

    public async deletePost(request: FastifyRequest, reply: FastifyReply) {
        const { params }: { [key: string]: any } = request;

        const data = await this.postService.deletePostById(params.id);

        return response.success(reply, { message: Message.postDeleted, data });
    }
}
