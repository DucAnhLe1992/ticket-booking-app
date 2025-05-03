import { Publisher } from "./base-publisher";
import { TicketCreatedEvents } from "./ticket-created-events";
import { Subjects } from "./subjects";
import { TicketCreatedListener } from "./ticket-created-listener";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvents> {
  readonly subject = Subjects.TicketCreated;
}
