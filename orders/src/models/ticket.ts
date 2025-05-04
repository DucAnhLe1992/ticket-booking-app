import mongoose from "mongoose";

import { Order, OrderStatus } from "./order";

interface TicketI {
  title: string;
  price: number;
}

export interface TicketDocumentI extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModelI extends mongoose.Model<TicketDocumentI> {
  build(newTicket: TicketI): TicketDocumentI;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

ticketSchema.statics.build = (newTicket: TicketI) => {
  return new Ticket(newTicket);
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDocumentI, TicketModelI>(
  "Ticket",
  ticketSchema,
);

export { Ticket };
