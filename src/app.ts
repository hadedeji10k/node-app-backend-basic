import fastify from "fastify";
import cors from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import { routes } from "./api/routes";
import { environment } from "./config";
import ajvErrors from "ajv-errors";
import { response } from "./utils";

export const app = fastify({
  logger: true,
  ignoreTrailingSlash: true,
  ajv: {
    customOptions: { allErrors: true, strictRequired: true },
    plugins: [ajvErrors],
  },
});

app.register(cors, { origin: "*" });
app.register(routes);
app.register(fastifyJwt, { secret: Buffer.from(environment.secrets.jwt) });

app.setErrorHandler((error, _request, reply) => {
  console.log(error);

  if (error.validation && error.validation[0]) {
    error.message = error.validation[0].message!;
  }

  return response.error(reply, { message: error.message, statusCode: error.statusCode });
});
