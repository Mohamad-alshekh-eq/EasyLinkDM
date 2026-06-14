import { test, expect } from "../../fixtures";
import { buildBooking } from "../../support/api/booking.factory";
import { isoDate } from "../../utils/date";

test.describe("POST /booking", () => {
  test("should create a booking and return the id", async ({
    bookerClient,
    authToken,
  }) => {
    const payload = buildBooking({
      firstname: "John",
      lastname: "Doe",
      totalprice: 200,
    });
    const res = await bookerClient.createBooking(payload);

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.bookingid).toBeDefined();
    expect(typeof body.bookingid).toBe("number");

    expect(body.booking).toMatchObject({
      firstname: "John",
      lastname: "Doe",
      totalprice: 200,
      depositpaid: expect.any(Boolean),
      bookingdates: {
        checkin: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        checkout: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      },
    });

    await bookerClient.deleteBooking(body.bookingid, authToken);
  });
});

test.describe("GET /booking", () => {
  test("should return a list of bookings", async ({ bookerClient }) => {
    const res = await bookerClient.getBookings();

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty("bookingid");
  });

  test("can filter bookings by name", async ({ bookerClient, authToken }) => {
    // creating test data here so we can filter by name
    const res = await bookerClient.createBooking({
      firstname: "FilterTest",
      lastname: "User",
      totalprice: 50,
      depositpaid: false,
      bookingdates: { checkin: isoDate(10), checkout: isoDate(15) },
    });
    const created = await res.json();

    const filterRes = await bookerClient.getBookings({
      firstname: "FilterTest",
      lastname: "User",
    });

    expect(filterRes.status()).toBe(200);
    const results = await filterRes.json();
    const ids = results.map((b: { bookingid: number }) => b.bookingid);
    expect(ids).toContain(created.bookingid);

    await bookerClient.deleteBooking(created.bookingid, authToken);
  });
});

test.describe("GET /booking/:id", () => {
  test("should get the right booking by id", async ({
    bookerClient,
    booking,
  }) => {
    const res = await bookerClient.getBooking(booking.bookingid);

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.firstname).toBe(booking.booking.firstname);
    expect(body.lastname).toBe(booking.booking.lastname);
    expect(body.totalprice).toBe(booking.booking.totalprice);
    expect(body.bookingdates.checkin).toBe(
      booking.booking.bookingdates.checkin,
    );
    expect(body.bookingdates.checkout).toBe(
      booking.booking.bookingdates.checkout,
    );
  });
});

test.describe("PUT /booking/:id", () => {
  test("full update should replace all fields", async ({
    bookerClient,
    booking,
    authToken,
  }) => {
    const updated = buildBooking({
      firstname: "Updated",
      lastname: "User",
      totalprice: 999,
    });
    const res = await bookerClient.updateBooking(
      booking.bookingid,
      updated,
      authToken,
    );

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.firstname).toBe("Updated");
    expect(body.lastname).toBe("User");
    expect(body.totalprice).toBe(999);
  });
});

test.describe("PATCH /booking/:id", () => {
  test("should only update the fields we send", async ({
    bookerClient,
    booking,
    authToken,
  }) => {
    const res = await bookerClient.partialUpdateBooking(
      booking.bookingid,
      { firstname: "Patched" },
      authToken,
    );

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.firstname).toBe("Patched");
    // rest of fields should stay the same
    expect(body.lastname).toBe(booking.booking.lastname);
    expect(body.totalprice).toBe(booking.booking.totalprice);
  });
});

test.describe("DELETE /booking/:id", () => {
  test("deleted booking should no longer exist", async ({
    bookerClient,
    booking,
    authToken,
  }) => {
    const deleteRes = await bookerClient.deleteBooking(
      booking.bookingid,
      authToken,
    );

    expect(deleteRes.status()).toBe(204);

    // checking if it is actually deleted
    const getRes = await bookerClient.getBooking(booking.bookingid);
    expect(getRes.status()).toBe(404);
  });
});
