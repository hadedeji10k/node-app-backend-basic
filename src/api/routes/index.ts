import { FastifyInstance } from "fastify";
import { auth } from "./auth";
import { user } from "./user";
import { post } from "./post";

export async function routes(app: FastifyInstance) {
  app.get("/", () => ({ message: "Hmmm... Streamvest API server" }));

  app.register(auth, { prefix: "auth" });
  app.register(user, { prefix: "user" });
  app.register(post, { prefix: "post" });
}
