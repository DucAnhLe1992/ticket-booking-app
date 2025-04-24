import request from "supertest";

import { app } from "../../app";

const createTicket = (title: string, price: number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title, price });
};

it("can fetch a list of tickets", async () => {
  await createTicket("Adele", 200);
  await createTicket("Britney Spears", 250);
  await createTicket("Beyonce", 260);

  const res = await request(app).get("/api/tickets").send().expect(200);
  expect(res.body.length).toEqual(3);
});
