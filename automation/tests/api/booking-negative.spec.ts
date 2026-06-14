import { test, expect } from "../../fixtures";
import { buildBooking } from "../../support/api/booking.factory";
import { isoDate } from "../../utils/date";

const NON_EXISTENT_ID = 9999999;

test.describe("GET /booking/:id", () => {
  test("should return 404 for booking that doesnt exist", async ({
    bookerClient,
  }) => {
    const res = await bookerClient.getBooking(NON_EXISTENT_ID);
    expect(res.status()).toBe(404);
  });
});

test.describe("POST /booking - invalid data", () => {
  test("missing firstname should fail", async ({ bookerClient }) => {
    const res = await bookerClient.createBooking({
      lastname: "Only",
      totalprice: 100,
      depositpaid: false,
      bookingdates: { checkin: isoDate(10), checkout: isoDate(15) },
    } as never);

    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test("invalid date format should return 400", async ({
    bookerClient,
    authToken,
  }) => {
    const res = await bookerClient.createBooking(
      buildBooking({
        bookingdates: { checkin: "not-a-date", checkout: "also-not-a-date" },
      }),
    );

    if (res.status() === 200) {
      const body = await res.json();
      await bookerClient.deleteBooking(body.bookingid, authToken);
    }

    expect(res.status()).toBe(400);
  });
});

test.describe("PUT /booking/:id - auth", () => {
  test("should get 403 with no token", async ({ bookerClient, booking }) => {
    const res = await bookerClient.updateBooking(
      booking.bookingid,
      buildBooking(),
    );
    expect(res.status()).toBe(403);
  });

  test("should get 403 with wrong token", async ({ bookerClient, booking }) => {
    const res = await bookerClient.updateBooking(
      booking.bookingid,
      buildBooking(),
      "totallywrongtoken",
    );
    expect(res.status()).toBe(403);
  });
});

test.describe("PATCH /booking/:id - auth", () => {
  const cases = [
    { label: "no token", token: undefined },
    { label: "invalid token", token: "totallywrongtoken" },
  ];

  for (const { label, token } of cases) {
    test(`should get 403 with ${label}`, async ({ bookerClient, booking }) => {
      const res = await bookerClient.partialUpdateBooking(
        booking.bookingid,
        { firstname: "Hacked" },
        token,
      );
      expect(res.status()).toBe(403);
    });
  }
});

test.describe("DELETE /booking/:id - auth", () => {
  const cases = [
    { label: "no token", token: undefined },
    { label: "invalid token", token: "totallywrongtoken" },
  ];

  for (const { label, token } of cases) {
    test(`should get 403 with ${label}`, async ({ bookerClient, booking }) => {
      const res = await bookerClient.deleteBooking(booking.bookingid, token);
      expect(res.status()).toBe(403);
    });
  }
});

test.describe("DELETE /booking/:id - not found", () => {
  test("deleting a booking that doesnt exist", async ({
    bookerClient,
    authToken,
  }) => {
    const res = await bookerClient.deleteBooking(NON_EXISTENT_ID, authToken);
    expect(res.status()).toBe(404);
  });
});
