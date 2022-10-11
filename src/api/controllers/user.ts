import { Service } from "typedi";
import { UserService } from "../../services";
import { Message, response } from "../../utils";
import { FastifyReply, FastifyRequest } from "fastify";
import { ICompleteProfilePayload, IRequestPhoneNumberVerification, ISetProfilePicture, IUpdateUser, IUpdateUserAddress, IUser, IVerifyUserPhoneNumber } from "../../interfaces";

@Service()
export class UserController {
  constructor(private readonly userService: UserService) { }

  public async completeProfile(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload: ICompleteProfilePayload = {
      username: body.username,
      interests: body.interests,
    };

    const data = await this.userService.completeProfile(payload, user);
    return response.success(reply, { message: "Profile completed successfully", data });
  }

  public async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    const { user }: { [key: string]: any } = request;

    const data = {
      fullName: user.fullName,
      username: user.username,
      avatar: user.avatar,
    };

    return response.success(reply, { message: "User fetched successfully", data });
  }

  public async getUserDashboard(request: FastifyRequest, reply: FastifyReply) {
    const { user }: { [key: string]: any } = request;


    const data = {
      currentDayStreak: user.currentDayStreak,
      // totalPoint: userPoint.totalAmount,
      // pointHistory: userPointHistory.result
    };

    return response.success(reply, { message: Message.userDashboardFetched, data });
  }

  public async setProfilePicture(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload: ISetProfilePicture = {
      imageUrl: body.imageUrl,
    };

    const data = await this.userService.setProfilePicture(payload, user);
    return response.success(reply, { message: Message.profilePicUpdated, data });
  }

  public async requestPhoneNumberVerification(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload: IRequestPhoneNumberVerification = {
      phone: body.phone,
    };

    const data = await this.userService.requestPhoneNumberVerification(payload, user);
    return response.success(reply, { message: Message.phoneNumberAdded, data });
  }

  public async resendPhoneNumberOtp(request: FastifyRequest, reply: FastifyReply) {
    const { user }: { [key: string]: any } = request;

    const data = await this.userService.resendPhoneNumberOtp(user);
    return response.success(reply, { message: Message.phoneOtpSent, data });
  }

  public async verifyPhoneNumber(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload: IVerifyUserPhoneNumber = {
      phoneOtpCode: body.phoneOtpCode,
    };

    const data = await this.userService.verifyPhoneNumber(payload, user);
    return response.success(reply, { message: Message.phoneNumberVerified, data });
  }

  public async updateUserAddress(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload: IUpdateUserAddress = {
      line1: body.line1,
      city: body.city,
      state: body.state,
      country: body.country,
    };

    const data = await this.userService.updateUserAddress(payload, user);
    return response.success(reply, { message: Message.userAddressUpdated, data });
  }

  public async updateUser(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload: IUpdateUser = {
      fullName: body.fullName,
      age: body.age,
      gender: body.gender,
      dateOfBirth: body.dateOfBirth,
    };

    const data = await this.userService.updateUser(payload, user);
    return response.success(reply, { message: Message.userProfileUpdated, data });
  }
}
