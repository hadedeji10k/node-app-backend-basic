import axios, { AxiosInstance } from "axios";
import { Service } from "typedi";
import { environment } from "../config/environment";

@Service()
export class Termii {
  private request: AxiosInstance;

  constructor() {
    this.request = axios.create({ baseURL: environment.termii.baseUrl });
  }

  async sendTextMessage(body: string, to: string) {
    if (!!body && !!to) {
      return await this.sendSms(body, to);
    }
  }

  async sendSms(body: string, to: string) {
    try {
      const data = {
        to,
        sms: body,
        from: "N-Alert",
        type: "plain",
        channel: "dnd",
        api_key: environment.termii.apiKey,
      };

      const response = await this.request.post("/api/sms/send", data);
      return response.data;
    } catch (e: any) {
      throw (e.response && e.response.data) || e;
    }
  }
}
