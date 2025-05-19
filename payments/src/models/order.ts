import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@ticket-system/common";

interface OrderI {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDocumentI extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
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
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
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

orderSchema.statics.build = (order: OrderI) => {
  return new Order({
    _id: order.id,
    version: order.version,
    price: order.price,
    userId: order.userId,
    status: order.status,
  });
};

const Order = mongoose.model<OrderDocumentI, OrderModelI>("Order", orderSchema);

export { Order };
