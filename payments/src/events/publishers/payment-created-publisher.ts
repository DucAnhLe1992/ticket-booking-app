import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@ticket-system/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
