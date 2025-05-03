import request from "supertest";

import { Ticket } from "../../models/tickets";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for POST request.", async () => {
  const res = await request(app).post("/api/tickets").send({});
  expect(res.status).not.toEqual(404);
});

it("can only be accessed if user is signed in.", async () => {
  const res = await request(app).post("/api/tickets").send({});
  expect(res.status).toEqual(401);
});

it("returns a status code other than 401 if user is signed in.", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({});
  expect(res.status).not.toEqual(401);
});

it("returns an ERR if an invalid title is provided.", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an ERR if an invalid price is provided.", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "Laptop",
      price: -5,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "Laptop",
    })
    .expect(400);
});

it("creates a ticket with valid inputs.", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "Laptop",
      price: 100,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual("Laptop");
  expect(tickets[0].price).toEqual(100);
});

it("publishes an event", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "Laptop",
      price: 100,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
