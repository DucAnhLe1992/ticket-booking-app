import mongoose from "mongoose";

interface PaymentI {
  orderId: string;
  stripeId: string;
}

interface PaymentDocumentI extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface PaymentModelI extends mongoose.Model<PaymentDocumentI> {
  build(payment: PaymentI): PaymentDocumentI;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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

paymentSchema.statics.build = (payment: PaymentI) => {
  return new Payment(payment);
};

const Payment = mongoose.model<PaymentDocumentI, PaymentModelI>(
  "Payment",
  paymentSchema,
);

export { Payment };
