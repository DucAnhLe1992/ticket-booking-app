import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@ticket-system/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
