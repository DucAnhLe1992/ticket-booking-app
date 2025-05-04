import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@ticket-system/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
