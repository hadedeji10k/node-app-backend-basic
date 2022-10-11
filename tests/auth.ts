import { test } from "tap";
import { app } from "../src/app";

export let token = ""

test("auth tests", async (t) => {
  t.test("sign up user", async (t) => {
    const response = await app.inject({
      method: "POST",
      path: "/auth/signup",
      payload: {
        fullName: "Abdulrahman Yusuf",
        phone: "08124028493",
        email: "testemail@gmail.com",
        password: "testpassword",
      },
    });

    const json = response.json();

    t.equal(response.statusCode, 200, "Status code is 200");
    t.equal(json.success, true, json.message);
  });

  t.test("sign in user", async (t) => {
    const response = await app.inject({
      method: "POST",
      path: "/auth/signin",
      payload: {
        email: "testemail@gmail.com",
        password: "testpassword",
      },
    });

    const json = response.json();

    token = json.data.token;

    t.equal(response.statusCode, 200, "Status code is 200");
    t.equal(json.success, true, json.message);
  });

  t.test("request email confirmation", async (t) => {
    const response = await app.inject({
      method: "POST",
      path: "/auth/email/confirmation",
      payload: {
        email: "testemail@gmail.com",
      },
    });

    const json = response.json();

    t.equal(response.statusCode, 200, "Status code is 200");
    t.equal(json.success, true, json.message);
  });

  t.test("complete email confirmation", async (t) => {
    const response = await app.inject({
      method: "PUT",
      path: "/auth/email/confirmation",
      payload: {
        email: "testemail@gmail.com",
        otpCode: "testpassword",
      },
    });

    const json = response.json();

    t.equal(response.statusCode, 200, "Status code is 200");
    t.equal(json.success, true, json.message);
  });
});
