import { Service } from "typedi";
import { AuthService } from "../../services";
import { response } from "../../utils";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  IChangePassword,
  IConfirmEmailPayload,
  IForgotPasswordReset,
  IRequestEmailConfirmationPayload,
  IRequestForgotPassword,
  ISignInPayload,
  ISignUpPayload,
} from "../../interfaces";

@Service()
export class AuthController {
  public constructor(private readonly authService: AuthService) { }

  public async signUp(request: FastifyRequest, reply: FastifyReply) {
    const { body }: { [key: string]: any } = request;

    const payload: ISignUpPayload = {
      email: body.email,
      phone: body.phone,
      fullName: body.fullName,
      password: body.password,
      referralCode: body.referralCode
    };

    const data = await this.authService.signUp(payload);
    return response.success(reply, { message: "User sign up successful", data });
  }

  public async signIn(request: FastifyRequest, reply: FastifyReply) {
    const { body }: { [key: string]: any } = request;

    const payload: ISignInPayload = {
      email: body.email,
      password: body.password,
    };

    const data = await this.authService.signIn(payload);
    return response.success(reply, { message: "User sign in successful", data });
  }

  public async requestForgotPassword(request: FastifyRequest, reply: FastifyReply) {
    const { body }: { [key: string]: any } = request;

    const payload: IRequestForgotPassword = {
      email: body.email,
    };

    const data = await this.authService.requestForgotPassword(payload);
    return response.success(reply, { message: "Password reset OTP sent successfully", data });
  }

  public async resetForgotPassword(request: FastifyRequest, reply: FastifyReply) {
    const { body }: { [key: string]: any } = request;

    const payload: IForgotPasswordReset = {
      email: body.email,
      otpCode: body.otpCode,
      password: body.password,
    };

    const data = await this.authService.resetForgotPassword(payload);
    return response.success(reply, { message: "Password reset successfully", data });
  }

  public async changePassword(request: FastifyRequest, reply: FastifyReply) {
    const { body }: { [key: string]: any } = request;

    const payload: IChangePassword = {
      email: body.email,
      oldPassword: body.oldPassword,
      newPassword: body.newPassword,
    };

    const data = await this.authService.changePassword(payload);
    return response.success(reply, { message: "Password changed successfully", data });
  }

  public async requestEmailConfirmation(request: FastifyRequest, reply: FastifyReply) {
    const { body }: { [key: string]: any } = request;

    const payload: IRequestEmailConfirmationPayload = {
      email: body.email,
    };

    const data = await this.authService.requestEmailConfirmation(payload);
    return response.success(reply, { message: "Email confirmation request successful", data });
  }

  public async completeEmailConfirmation(request: FastifyRequest, reply: FastifyReply) {
    const { body }: { [key: string]: any } = request;

    const payload: IConfirmEmailPayload = {
      otpCode: body.otpCode,
      email: body.email,
    };

    const data = await this.authService.completeEmailConfirmation(payload);
    return response.success(reply, { message: "Email confirmation successful", data });
  }
}
