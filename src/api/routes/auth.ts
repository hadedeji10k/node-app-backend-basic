import { Container } from "typedi";
import { FastifyInstance } from "fastify";
import {
  signUpSchema,
  signInSchema,
  requestForgotPasswordSchema,
  resetForgotPasswordSchema,
  changePasswordSchema,
  requestEmailConfirmationSchema,
  completeEmailConfirmationSchema,
} from "../../schema";
import { AuthController } from "../controllers";

export async function auth(app: FastifyInstance) {
  const controller = Container.get(AuthController);

  app.post("/signup", { schema: { body: signUpSchema } }, controller.signUp.bind(controller));
  app.post("/signin", { schema: { body: signInSchema } }, controller.signIn.bind(controller));
  app.post(
    "/password/reset",
    { schema: { body: requestForgotPasswordSchema } },
    controller.requestForgotPassword.bind(controller)
  );
  app.put(
    "/password/reset",
    { schema: { body: resetForgotPasswordSchema } },
    controller.resetForgotPassword.bind(controller)
  );
  app.put("/password/change", { schema: { body: changePasswordSchema } }, controller.changePassword.bind(controller));
  app.post(
    "/confirmation/email",
    { schema: { body: requestEmailConfirmationSchema } },
    controller.requestEmailConfirmation.bind(controller)
  );
  app.put(
    "/confirmation/email",
    { schema: { body: completeEmailConfirmationSchema } },
    controller.completeEmailConfirmation.bind(controller)
  );
}
