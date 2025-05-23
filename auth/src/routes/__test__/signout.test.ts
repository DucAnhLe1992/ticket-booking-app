import request from "supertest";

import { app } from "../../app";

it("cleans the cookie when signing out", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const res = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  expect(res.get("Set-Cookie")).toBeDefined();
  const cookie = res.get("Set-Cookie");
  if (!cookie) {
    throw new Error("Expected cookie but got undefined.");
  }

  expect(cookie[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
