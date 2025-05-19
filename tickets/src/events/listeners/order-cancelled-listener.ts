import { Listener, OrderCancelledEvent, Subjects } from "@ticket-system/common";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

const byteToHex = (byte: any) => {
  const key = "0123456789abcdef";
  let bytes = new Uint8Array(byte);
  let newHex = "";
  let currentChar = 0;

  // Go over each 8-bit byte
  for (let i = 0; i < bytes.length; i++) {
     // First 4-bits for first hex char
    currentChar = bytes[i] >> 4;
     // Add first hex char to string
    newHex += key[currentChar];
     // Erase first 4-bits, get last 4-bits for second hex char
    currentChar = bytes[i] & 15;
     // Add second hex char to string
    newHex += key[currentChar];
  }
  return newHex;
};

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticketIdRawData = data.ticket.id;
    let ticketId: string = "";

    // Sometimes the data.ticket.id is not a string but a Buffer
    // which contains its data of an array of bytes
    if (typeof ticketIdRawData === "object") {
      ticketId = byteToHex((ticketIdRawData as any).data);
    } else {
      ticketId = ticketIdRawData;
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new Error("Ticket not found.");
    }

    ticket.set({ orderId: undefined });
    //delete ticket.orderId;
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
    });

    msg.ack();
  }
}
