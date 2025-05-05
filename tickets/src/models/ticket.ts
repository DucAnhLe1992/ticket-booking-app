import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketI {
  title: string;
  price: number;
  userId: string;
}

interface TicketDocumentI extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
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
    },
    userId: {
      type: String,
      require: true,
    },
    orderId: {
      type: String,
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
  return new Ticket(newTicket);
};

const Ticket = mongoose.model<TicketDocumentI, TicketModelI>(
  "Ticket",
  ticketSchema,
);

export { Ticket };
