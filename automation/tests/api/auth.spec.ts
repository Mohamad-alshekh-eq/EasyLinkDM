import { test, expect } from "../../fixtures";
import { env } from "../../config/env";

test.describe("POST /auth", () => {
  test("valid credentials should return a token", async ({ bookerClient }) => {
    const res = await bookerClient.createToken(
      env.booker.username,
      env.booker.password,
    );

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty("token");
    expect(body.token.length).toBeGreaterThan(0);
  });

  test("wrong password should return 401", async ({ bookerClient }) => {
    const res = await bookerClient.createToken(
      env.booker.username,
      "wrong-password",
    );

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).not.toHaveProperty("token");
  });

  test("empty username and password should not return token", async ({
    bookerClient,
  }) => {
    const res = await bookerClient.createToken("", "");
    const body = await res.json();
    expect(body).not.toHaveProperty("token");
  });

  test("wrong username should return 401", async ({ bookerClient }) => {
    const res = await bookerClient.createToken(
      "wronguser",
      env.booker.password,
    );

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).not.toHaveProperty("token");
  });

  test("token from login should work on authenticated endpoints", async ({
    bookerClient,
  }) => {
    const authRes = await bookerClient.createToken(
      env.booker.username,
      env.booker.password,
    );
    const { token } = await authRes.json();

    // create a booking using the token to confirm it works fine
    const res = await bookerClient.createBooking({
      firstname: "TokenTest",
      lastname: "User",
      totalprice: 10,
      depositpaid: false,
      bookingdates: { checkin: "2026-09-01", checkout: "2026-09-03" },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();

    // cleanup
    await bookerClient.deleteBooking(body.bookingid, token);
  });
});
