import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { OrderStatus, Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("marks an order as Cancelled", async () => {
  const ticket = Ticket.build({
    title: "TVXQ!",
    price: 90,
  });
  await ticket.save();

  const user = global.signup();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const cancelledOrder = await Order.findById(order.id);
  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a cancelled order event", async () => {
  const ticket = Ticket.build({
    title: "TVXQ!",
    price: 90,
  });
  await ticket.save();

  const user = global.signup();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
