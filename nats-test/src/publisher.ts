import nats from "node-nats-streaming";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS!");

  const data = {
    id: "123",
    title: "Asia Tour",
    price: 10,
  };

  stan.publish("ticket:created", JSON.stringify(data), () => {
    console.log("Event published.");
  });
});
