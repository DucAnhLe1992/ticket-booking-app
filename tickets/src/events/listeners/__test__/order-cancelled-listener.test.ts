import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@ticket-system/common";

import { OrderCancelledListener } from "../order-cancelled-listener";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "V6",
    price: 30,
    userId: "123456",
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg, orderId };
};

it("updates the ticket and, publishes the event, and acks the message", async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);
  const cancelledTicket = await Ticket.findById(ticket.id);

  expect(cancelledTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
