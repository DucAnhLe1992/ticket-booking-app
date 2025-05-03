import { Publisher, Subjects, TicketCreatedEvent } from "@ticket-system/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
