import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@ticket-system/common";

import { TicketDocumentI } from "./ticket";

export { OrderStatus };

interface OrderI {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocumentI;
}

interface OrderDocumentI extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocumentI;
  version: number;
}

interface OrderModelI extends mongoose.Model<OrderDocumentI> {
  build(newOrder: OrderI): OrderDocumentI;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (newOrder: OrderI) => {
  return new Order(newOrder);
};

const Order = mongoose.model<OrderDocumentI, OrderModelI>("Order", orderSchema);

export { Order };
