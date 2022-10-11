import { FastifyInstance } from "fastify";
import { Container } from "typedi";
import { completeProfileSchema } from "../../schema";
import { UserController } from "../controllers";
import { auth, dayStreak } from "../middleware";
import {
  setProfilePictureSchema,
  requestPhoneNumberVerificationSchema,
  verifyPhoneNumberSchema,
  updateUserAddressSchema,
  updateUserSchema,
} from "../../schema";

export async function user(app: FastifyInstance) {
  const controller = Container.get(UserController);

  app.get("/me", { onRequest: [auth.user(), dayStreak.checkDayStreak()] }, controller.getCurrentUser.bind(controller));
  app.get(
    "/dashboard",
    { onRequest: [auth.user(), dayStreak.checkDayStreak()] },
    controller.getUserDashboard.bind(controller)
  );
  app.put(
    "/complete",
    { schema: { body: completeProfileSchema }, onRequest: [auth.user()] },
    controller.completeProfile.bind(controller)
  );
  app.put(
    "/avatar",
    { schema: { body: setProfilePictureSchema }, onRequest: [auth.user()] },
    controller.setProfilePicture.bind(controller)
  );
  app.post(
    "/phone",
    { schema: { body: requestPhoneNumberVerificationSchema }, onRequest: [auth.user()] },
    controller.requestPhoneNumberVerification.bind(controller)
  );
  app.put("/phone", { onRequest: [auth.user()] }, controller.resendPhoneNumberOtp.bind(controller));
  app.put(
    "/phone/verify",
    { schema: { body: verifyPhoneNumberSchema }, onRequest: [auth.user()] },
    controller.verifyPhoneNumber.bind(controller)
  );
  app.put(
    "/address",
    { schema: { body: updateUserAddressSchema }, onRequest: [auth.user()] },
    controller.updateUserAddress.bind(controller)
  );
  app.put(
    "/",
    { schema: { body: updateUserSchema }, onRequest: [auth.user()] },
    controller.updateUser.bind(controller)
  );
}
