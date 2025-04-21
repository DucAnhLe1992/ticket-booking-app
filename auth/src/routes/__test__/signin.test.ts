import request from "supertest";

import { app } from "../../app";

it("fails when email doesn't exist", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "email@mail.com",
      password: "password",
    })
    .expect(400);
});

it("fails when password is incorrect", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "lololol",
    })
    .expect(400);
});

it("responds with a cookie on valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const res = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(res.get("Set-Cookie")).toBeDefined();
});
