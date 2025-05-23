import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { Order, OrderStatus } from "./order";

interface TicketI {
  id: string;
  title: string;
  price: number;
}

export interface TicketDocumentI extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModelI extends mongoose.Model<TicketDocumentI> {
  build(newTicket: TicketI): TicketDocumentI;
  findWithVersion(data: {
    id: string;
    version: number;
  }): Promise<TicketDocumentI | null>;
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (newTicket: TicketI) => {
  return new Ticket({
    _id: newTicket.id,
    title: newTicket.title,
    price: newTicket.price,
  });
};

ticketSchema.statics.findWithVersion = (data: {
  id: string;
  version: number;
}) => {
  return Ticket.findOne({
    _id: data.id,
    version: data.version - 1,
  });
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
