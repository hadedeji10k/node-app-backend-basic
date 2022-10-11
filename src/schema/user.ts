export const completeProfileSchema = {
  type: "object",
  additionalProperties: false,
  required: ["username", "interests"],
  properties: {
    username: { type: "string" },
    interests: { type: "array" },
  },
  errorMessage: {
    required: {
      username: "Username is required",
      interests: "Please select some interests",
    },
  },
};

export const setProfilePictureSchema = {
  type: "object",
  additionalProperties: false,
  required: ["imageUrl"],
  properties: {
    imageUrl: { type: "string" },
  },
  errorMessage: {
    required: {
      imageUrl: "ImageURL is required",
    },
  },
};

export const requestPhoneNumberVerificationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["phone"],
  properties: {
    phone: { type: "string" },
  },
  errorMessage: {
    required: {
      phone: "Phone number is required",
    },
  },
};

export const verifyPhoneNumberSchema = {
  type: "object",
  additionalProperties: false,
  required: ["phoneOtpCode"],
  properties: {
    phoneOtpCode: { type: "string" },
  },
  errorMessage: {
    required: {
      phoneOtpCode: "OTP code is required",
    },
  },
};

export const updateUserAddressSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    line1: { type: "string" },
    city: { type: "string" },
    state: { type: "string" },
    country: { type: "string" },
  },
};

export const updateUserSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullName: { type: "string" },
    age: { type: "number" },
    gender: { type: "string" },
    dateOfBirth: { type: "string" },
  },
};