import { Message } from "node-nats-streaming";

import { Listener } from "./base-listener";
import { TicketCreatedEvents } from "./ticket-created-events";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvents> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvents["data"], msg: Message): void {
    console.log("Event data!", data);

    msg.ack();
  }
}
