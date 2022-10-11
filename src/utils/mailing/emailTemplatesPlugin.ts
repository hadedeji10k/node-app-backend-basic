import { Service } from "typedi";
import { accountCreationTemplate, passwordChangeTemplate, userForgetPasswordTemplate } from "./emailTemplates";
import { EmailOptions, EmailTemplate, EmailType } from "../../interfaces";
import { environment } from "../../config";

@Service()
export class EmailTemplatesPlugin {
  private static getHTMLTemplate(emailType: EmailType, options: EmailOptions): { html: string; subject: string } {
    return {
      [EmailType.ACCOUNT_CREATION]: {
        html: accountCreationTemplate(options),
        subject: "Welcome to Streamvest ✅",
      },
      [EmailType.USER_FORGET_PASSWORD]: {
        html: userForgetPasswordTemplate(options),
        subject: "Let's help you get back into Streamvest",
      },
      [EmailType.PASSWORD_CHANGE]: {
        html: passwordChangeTemplate(options),
        subject: "Password Changed",
      },
    }[emailType];
  }

  generateTemplate(emailType: EmailType, options: EmailOptions) {
    const template = EmailTemplatesPlugin.getHTMLTemplate(emailType, options);

    return {
      from: {
        email: environment.mail.from || "support@streamvest.com",
      },
      to: options.recipient,
      subject: template.subject,
      text: template.subject,
      html: template.html,
    } as EmailTemplate;
  }
}
