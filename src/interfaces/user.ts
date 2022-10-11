import { User } from "@prisma/client";

export interface ICreateUserPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  emailOtpCode: string;
  lastDayStreak: Date;
}

export interface ICompleteProfilePayload {
  username: string;
  interests: string[];
}

export interface IUser extends User { }

export interface IRequestPhoneNumberVerification {
  phone: string;
}

export interface IVerifyUserPhoneNumber {
  phoneOtpCode: string;
}
export interface ISetProfilePicture {
  imageUrl: string;
}

export interface IUpdateUser {
  fullName?: string;
  age?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface IUpdateUserAddress {
  line1?: string;
  city?: string;
  state?: string;
  country?: string;
}
