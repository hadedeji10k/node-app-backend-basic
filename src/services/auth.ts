import { Service } from "typedi";
import { jwt, Message, password, generateOTP } from "../utils";
import { User } from "../database/repository";
import {
  EmailOptions,
  EmailType,
  IChangePassword,
  IConfirmEmailPayload,
  IForgotPasswordReset,
  IRequestEmailConfirmationPayload,
  IRequestForgotPassword,
  ISignInPayload,
  ISignUpPayload,
  IUser,
} from "../interfaces";
import { Mailer } from "../utils/mailing";
import { environment } from "../config/environment";
import { startOfDay } from "date-fns";

@Service()
export class AuthService {
  constructor(
    private readonly user: User,
    private readonly mail: Mailer,
  ) { }

  public async signUp(payload: ISignUpPayload) {
    {
      const user = await this.user.findByEmail(payload.email);

      if (!!user) {
        throw new Error(Message.userFound);
      }
    }

    const passwordHash = await password.hash(payload.password);

    const otpCode = generateOTP({ type: "num", length: 6 });

    let refObject = {};

    if (payload.referralCode) {
      refObject = {
        referred: true,
        referralCode: payload.referralCode,
      };
    }

    const user = await this.user.create({
      ...payload,
      ...refObject,
      password: passwordHash,
      emailOtpCode: otpCode,
      lastDayStreak: startOfDay(new Date()),
    });

    await this._sendEmailConfirmation(user, user.emailOtpCode);

    return {
      token: await jwt.sign({ id: user.id }),
    };
  }

  public async signIn(payload: ISignInPayload) {
    const user = await this.user.findByEmail(payload.email);
    if (!user) {
      throw new Error(Message.userNotFound);
    }

    const isValidPassword = await password.verify(payload.password, user.password);
    if (!isValidPassword) {
      throw new Error(Message.invalidPassword);
    }

    return {
      token: await jwt.sign({ id: user.id }),
    };
  }

  public async requestForgotPassword(payload: IRequestForgotPassword) {
    const user = await this.user.findByEmail(payload.email);
    if (!user) {
      throw new Error(Message.userNotFound);
    }

    const otpCode = generateOTP({ type: "num", length: 6 });
    await this.user.updateUser({ id: user.id }, { passwordOtpCode: otpCode });

    const options: EmailOptions = {
      recipient: user.email,
      context: {
        name: user.fullName.split(" ")[0],
        activationCode: parseInt(otpCode),
      },
    };

    await this.mail.sendEmail(EmailType.USER_FORGET_PASSWORD, options);

    return { otpCode };
  }

  public async resetForgotPassword(payload: IForgotPasswordReset) {
    const user = await this.user.findByEmail(payload.email);

    if (!user) {
      throw new Error(Message.userNotFound);
    }

    if (user.passwordOtpCode !== payload.otpCode) {
      throw new Error(Message.invalidOtp);
    }

    if (await password.verify(user.password, payload.password)) {
      throw new Error(Message.passwordIsSameAsOld);
    }

    const passwordHash = await password.hash(payload.password);
    await this.user.updateUser({ id: user.id }, { password: passwordHash, passwordOtpCode: null });

    const options: EmailOptions = {
      recipient: user.email,
      context: {
        name: user.fullName.split(" ")[0],
      },
    };

    await this.mail.sendEmail(EmailType.PASSWORD_CHANGE, options);

    return;
  }

  public async changePassword(payload: IChangePassword) {
    const user = await this.user.findByEmail(payload.email);

    if (!user) {
      throw new Error(Message.userNotFound);
    }

    if (await password.verify(user.password, payload.newPassword)) {
      throw new Error(Message.passwordIsSameAsOld);
    }

    if (!(await password.verify(user.password, payload.oldPassword))) {
      throw new Error(Message.oldPasswordNotCorrect);
    }

    const passwordHash = await password.hash(payload.newPassword);
    await this.user.updateUser({ id: user.id }, { password: passwordHash, passwordOtpCode: null });

    const options: EmailOptions = {
      recipient: user.email,
      context: {
        name: user.fullName.split(" ")[0],
      },
    };

    await this.mail.sendEmail(EmailType.PASSWORD_CHANGE, options);

    return;
  }

  public async requestEmailConfirmation(payload: IRequestEmailConfirmationPayload) {
    const user = await this.user.findByEmail(payload.email);

    if (!user) {
      throw new Error("Email has not been registered");
    }
    if (user.emailConfirmed) {
      throw new Error("Email has already been confirmed");
    }

    await this._sendEmailConfirmation(user);
  }

  public async completeEmailConfirmation(payload: IConfirmEmailPayload) {
    const user = await this.user.findByEmail(payload.email);

    if (!user) {
      throw new Error("User does not exists");
    }
    if (!user.emailOtpCode) {
      throw new Error("Email confirmation token is invalid");
    }

    if (payload.otpCode != user.emailOtpCode) {
      throw new Error("Email confirmation token is invalid");
    }

    await this.user.updateUser({ id: user.id }, { emailConfirmed: true, emailOtpCode: null });
  }

  private async _sendEmailConfirmation(user: IUser, otpCode?: string | null) {
    if (!otpCode) {
      otpCode = generateOTP({ type: "num", length: 6 });
      await this.user.updateUser({ id: user.id }, { emailOtpCode: otpCode });
    }

    const options: EmailOptions = {
      recipient: user.email,
      context: {
        name: user.fullName.split(" ")[0],
        activationCode: parseInt(otpCode),
      },
    };

    await this.mail.sendEmail(EmailType.ACCOUNT_CREATION, options);
  }
}
