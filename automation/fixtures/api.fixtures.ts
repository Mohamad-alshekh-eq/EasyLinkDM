import { test as base } from "@playwright/test";
import { BookerClient } from "../lib/api/booker-client";
import { CreateBookingResponse } from "../lib/api/types";
import { buildBooking } from "../support/api/booking.factory";
import { env } from "../config/env";

type Fixtures = {
  bookerClient: BookerClient;
  authToken: string;
  booking: CreateBookingResponse;
};

export const test = base.extend<Fixtures>({
  bookerClient: async ({ request }, use) => {
    await use(new BookerClient(request));
  },

  authToken: async ({ bookerClient }, use) => {
    const res = await bookerClient.createToken(
      env.booker.username,
      env.booker.password,
    );
    const { token } = await res.json();
    await use(token);
  },

  booking: async ({ bookerClient, authToken }, use) => {
    const res = await bookerClient.createBooking(buildBooking());
    const body = (await res.json()) as CreateBookingResponse;

    await use(body);

    // cleanup, if already deleted by test ->  just ignore
    await bookerClient.deleteBooking(body.bookingid, authToken).catch(() => {});
  },
});

export { expect } from "@playwright/test";
