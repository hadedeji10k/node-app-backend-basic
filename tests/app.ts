import { test } from "tap";
import { app } from "../src/app";

test("Check if server runs properly", async (t) => {
  const response = await app.inject({ method: "get", path: "/" });

  t.equal(response.statusCode, 200, "returns status code of 200");
  t.equal(response.statusMessage, "OK", "returns status message of 'OK'");
});
