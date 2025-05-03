import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exist.", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/app/tickets${id}`)
    .set("Cookie", global.signup())
    .send({
      title: "TVXQ!",
      price: 100,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated.", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/app/tickets${id}`)
    .send({
      title: "TVXQ!",
      price: 100,
    })
    .expect(404);
});

it("returns a 401 if the user does not own the ticket.", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title: "MASARINA", price: 20 });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", global.signup())
    .send({ title: "Leon Lai", price: 50 })
    .expect(401);
});

it("returns a 400 if the user does not provide a valid title or price.", async () => {
  const cookie = global.signup();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "MASARINA", price: 20 });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 50 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "ARASHI", price: -50 })
    .expect(400);
});

it("updates the ticket with valid inputs.", async () => {
  const cookie = global.signup();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "MASARINA", price: 120 });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "Aaron Kwok", price: 70 })
    .expect(200);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send();
  expect(ticketRes.body.title).toEqual("Aaron Kwok");
  expect(ticketRes.body.price).toEqual(70);
});

it("publishes an event", async () => {
  const cookie = global.signup();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "MASARINA", price: 120 });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "Aaron Kwok", price: 70 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
