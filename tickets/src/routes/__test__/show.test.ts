import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";

it("returns a 404 if ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the ticket if ticket is found", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "Lady Gaga",
      price: 400,
    })
    .expect(201);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);

  expect(ticketRes.body.title).toEqual("Lady Gaga");
  expect(ticketRes.body.price).toEqual(400);
});
