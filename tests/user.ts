import { test } from "tap";
import { app } from "../src/app";

import { token } from "./auth"

let phoneOtpCode: string = "";

test("user tests", async (t) => {

  t.test("complete user profile", async (t) => {
    const response = await app.inject({
      method: "PUT",
      path: "/user/complete",
      payload: {
        username: "bytedeveloper",
        interests: "",
      },
      headers: {
        authorization: "Bearer " + token
      }
    });

    const json = response.json();

    t.equal(response.statusCode, 200, "Status code is 200");
    t.equal(json.success, true, json.message);
  });

  t.test("get current user", async (t) => {
    const response = await app.inject({
      method: "GET",
      path: "/user/me",
      headers: {
        authorization: "Bearer " + token
      }
    });

    const json = response.json();

    t.equal(response.statusCode, 200, "Status code is 200");
    t.equal(json.data.username, "bytedeveloper", "Username is correct");
    t.equal(json.success, true, json.message);
  });


  t.test("upload avatar", async (t) => {
    const response = await app.inject({
      method: "PUT",
      path: "/user/avatar",
      payload: {
        imageUrl: "",
      },
      headers: {
        authorization: "Bearer " + token
      }
    });

    const json = response.json();

    t.equal(response.statusCode, 200, "Status code is 200");
    t.equal(json.success, true, json.message);
  });

  t.test("Update phone", async (t) => {
    const response = await app.inject({
      method: "POST",
      path: "/user/phone",
      payload: {
        phone: "09062047667",
      },
      headers: {
        authorization: "Bearer " + token
      }
    });

    const json = response.json();
    phoneOtpCode = json.data.otpCode;

    t.equal(response.statusCode, 200, "Status code is 200");
    t.equal(json.data.otpCode, phoneOtpCode, "Phone otp is correct");
    t.equal(json.success, true, json.message);
  });

  t.test("Verify number", async (t) => {
    const response = await app.inject({
      method: "PUT",
      path: "/user/phone/verify",
      payload: {
        phoneOtpCode,
      },
      headers: {
        authorization: "Bearer " + token
      }
    });

    const json = response.json();

    t.equal(response.statusCode, 200, "Status code is 200");
    t.equal(json.success, true, json.message);
  });

  t.test("Update address", async (t) => {
    const response = await app.inject({
      method: "PUT",
      path: "/user/address",
      payload: {
        line1: "line1",
        city: "city",
        state: "state",
        country: "country",
      },
      headers: {
        authorization: "Bearer " + token
      }
    });

    const json = response.json();

    t.equal(response.statusCode, 200, "Status code is 200");
    t.equal(json.success, true, json.message);
  });

  t.test("Update user", async (t) => {
    const response = await app.inject({
      method: "PUT",
      path: "/user/",
      payload: {
        fullName: "Yusuf",
        age: 40,
        gender: "male",
        dateOfBirth: ""
      },
      headers: {
        authorization: "Bearer " + token
      }
    });

    const json = response.json();

    t.equal(response.statusCode, 200, "Status code is 200");
    t.equal(json.success, true, json.message);
  });
});
