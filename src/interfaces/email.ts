export interface EmailOptions {
  from?: {
    senderEmail?: string;
    senderName?: string;
  };
  recipient: string;
  context: {
    name?: string;
    amount?: number;
    activationCode?: number;
  };
}

export interface EmailTemplate {
  from: {
    email: string;
    name: string;
  };
  to: string;
  subject: string;
  text?: string;
  html: string;
}

export enum EmailType {
  ACCOUNT_CREATION,
  USER_FORGET_PASSWORD,
  PASSWORD_CHANGE,
}
