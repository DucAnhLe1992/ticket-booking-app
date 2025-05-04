import mongoose from "mongoose";

interface TicketI {
  title: string;
  price: number;
  userId: string;
}

interface TicketDocumentI extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
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

const Ticket = mongoose.model<TicketDocumentI, TicketModelI>(
  "Ticket",
  ticketSchema,
);

export { Ticket };
