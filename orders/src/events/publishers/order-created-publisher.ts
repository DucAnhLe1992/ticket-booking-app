import { Publisher, OrderCreatedEvent, Subjects } from "@ticket-system/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
