import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  const ticket = Ticket.build({
    title: "Utada Hikaru",
    price: 60,
    userId: "123456",
  });
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 70 });
  secondInstance!.set({ price: 80 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point.");
});

it("increments the verison number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "Utada Hikaru",
    price: 60,
    userId: "123456",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
