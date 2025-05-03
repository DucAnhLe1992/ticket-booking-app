import { Publisher, Subjects, TicketUpdatedEvent } from "@ticket-system/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
