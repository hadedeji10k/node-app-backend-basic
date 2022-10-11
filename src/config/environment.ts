const defaultTermiiApiKey = "TLaO38rSRZEKlt6RHn79c15nEEGWgHECGBDuUglc7SpjRWE8xx9kLO2QvJz9Jr";
const defaultTermiiBaseUrl = "https://api.ng.termii.com";
export interface IEnvironment {
  port: number;
  host: string;
  isTestEnv: boolean;
  secrets: {
    jwt: string;
  };
  mail: {
    apiKey: string;
    from: string;
  };
  termii: {
    baseUrl: string;
    apiKey: string;
  };
}

export const environment: IEnvironment = {
  port: Number(process.env.PORT) || 6006,
  host: process.env.HOST || "127.0.0.1",
  isTestEnv: process.env.IS_TEST_ENV === "true" || false,
  secrets: {
    jwt: process.env.JWT_SECRET || ".VS'-uck4VOg4xAKyN?nett_gugVtzHn;Tol.m:k~F850M(5$7/tK4{nJ:)SXOi",
  },
  mail: {
    apiKey: process.env.EMAIL_API_KEY || "",
    from: process.env.EMAIL_FROM || "",
  },
  termii: {
    baseUrl: process.env.TERMII_BASE_URL || defaultTermiiBaseUrl,
    apiKey: process.env.TERMII_API_KEY || defaultTermiiApiKey,
  }
};
