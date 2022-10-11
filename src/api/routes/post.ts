import { FastifyInstance } from "fastify";
import { Container } from "typedi";
import { createPostSchema, updatePostSchema } from "../../schema";
import { PostController } from "../controllers";
import { auth } from "../middleware";

export async function post(app: FastifyInstance) {
    const controller = Container.get(PostController);

    app.post("/", { schema: { body: createPostSchema }, onRequest: [auth.user(), auth.isAdmin()] }, controller.createPost.bind(controller));

    app.put("/:id", { schema: { body: updatePostSchema }, onRequest: [auth.user(), auth.isAdmin()] }, controller.updatePost.bind(controller));

    app.get("/:id", controller.getPost.bind(controller));

    app.get("/", controller.getPosts.bind(controller));

    app.delete("/:id", { onRequest: [auth.user(), auth.isAdmin()] }, controller.deletePost.bind(controller));
}
