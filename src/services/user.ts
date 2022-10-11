import { Service } from "typedi";
import sanitize from "sanitize-html"
import { User } from "../database/repository";
import { ICompleteProfilePayload, IUser } from "../interfaces";
import {
  IRequestPhoneNumberVerification,
  ISetProfilePicture,
  IUpdateUser,
  IUpdateUserAddress,
  IVerifyUserPhoneNumber,
} from "../interfaces";
import { generateOTP, Message, Termii } from "../utils";
import { environment } from "../config/environment";
import { addMinutes, isFuture } from "date-fns";

@Service()
export class UserService {
  constructor(private readonly user: User, private readonly message: Termii) { }

  public async completeProfile(payload: ICompleteProfilePayload, user: IUser) {
    const foundUser = await this.user.findByUsername(payload.username);

    if (foundUser && foundUser.id !== user.id) {
      throw new Error(Message.usernameAlreadyInUse);
    }

    await this.user.updateUser({ id: user.id }, { username: payload.username });
    return;
  }

  public async setProfilePicture(payload: ISetProfilePicture, user: IUser) {
    await this.user.updateUser({ id: user.id }, { avatar: payload.imageUrl });
    return { profilePicture: payload.imageUrl };
  }

  public async requestPhoneNumberVerification(payload: IRequestPhoneNumberVerification, user: IUser) {
    const phoneExist = await this.user.findByPhoneNumber(payload.phone);

    if (phoneExist) {
      throw new Error(Message.phoneExists);
    }

    const otpCode = generateOTP({ type: "num", length: 6 });

    const body = `Your One Time Password (OTP) for Streamvest phone number verification is ${otpCode}. Expires in 10 mins. If you did not request for this, kindly ignore this message. NOTE: Do not share your OTP with anyone.`;

    await this.message.sendTextMessage(body, payload.phone);

    const data = {
      phone: payload.phone,
      phoneOtpCode: otpCode,
      phoneConfirmed: false,
      otpExpiryDate: addMinutes(new Date(), 10),
    };

    await this.user.updateUser({ email: user.email.toLowerCase() }, data);

    return { otpCode: environment.isTestEnv ? otpCode : undefined };
  }

  public async resendPhoneNumberOtp(user: IUser) {
    if (user.phoneConfirmed) {
      throw new Error(Message.phoneVerified);
    }

    if (user.phone) {
      const otpCode = generateOTP({ type: "num", length: 6 });

      const body = `Your One Time Password (OTP) for Streamvest phone number verification is ${otpCode}. Expires in 10 mins. If you did not request for this, kindly ignore this message. NOTE: Do not share your OTP with anyone.`;

      await this.message.sendTextMessage(body, user.phone);

      const data = {
        phoneOtpCode: otpCode,
        phoneConfirmed: false,
        otpExpiryDate: addMinutes(new Date(), 10),
      };

      await this.user.updateUser({ email: user.email.toLowerCase() }, data);

      return { otpCode: environment.isTestEnv ? otpCode : undefined };
    }

    return;
  }

  public async verifyPhoneNumber(payload: IVerifyUserPhoneNumber, user: IUser) {
    if (!isFuture(user.otpExpiryDate || new Date())) {
      throw new Error(Message.otpExpired);
    }

    if (user.phoneOtpCode !== payload.phoneOtpCode) {
      throw new Error(Message.invalidOtp);
    }

    await this.user.updateUser(
      { email: user.email.toLowerCase() },
      { phoneConfirmed: true, phoneOtpCode: null, otpExpiryDate: null }
    );

    return;
  }

  public async updateUserAddress(payload: IUpdateUserAddress, user: IUser) {
    const userObj = {
      line1: payload.line1 ? sanitize(payload.line1) : user.line1,
      city: payload.city ? sanitize(payload.city) : user.city,
      state: payload.state ? sanitize(payload.state) : user.state,
      country: payload.country ? sanitize(payload.country) : user.country,
    };

    await this.user.updateUser({ id: user.id }, userObj);

    return;
  }

  public async updateUser(payload: IUpdateUser, user: IUser) {
    const userObj = {
      fullName: payload.fullName ? sanitize(payload.fullName) : user.fullName,
      age: payload.age ? parseInt(payload.age) : user.age,
      gender: payload.gender ? sanitize(payload.gender) : user.gender,
      dateOfBirth: payload.dateOfBirth ? payload.dateOfBirth : user.dateOfBirth,
    };

    await this.user.updateUser({ id: user.id }, userObj);
    return;
  }

  public async getUserData(user: IUser) {

    return await this.user.findById(user.id, {});
  }
}
