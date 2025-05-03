import nats from "node-nats-streaming";

import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS!");

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "1234",
      title: "Asia Tour 2",
      price: 10,
    });
  } catch (err) {
    console.log(err);
  }

  // const data = {
  //   id: "123",
  //   title: "Asia Tour",
  //   price: 10,
  // };

  // stan.publish("ticket:created", JSON.stringify(data), () => {
  //   console.log("Event published.");
  // });
});
