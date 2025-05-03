import { Subjects } from "./subjects";

export interface TicketCreatedEvents {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
