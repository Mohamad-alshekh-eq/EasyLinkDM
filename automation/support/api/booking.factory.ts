import { Booking } from "../../lib/api/types";
import { isoDate } from "../../utils/date";

export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: "Mohamad",
    lastname: "Test",
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: isoDate(30),
      checkout: isoDate(37),
    },
    additionalneeds: "Breakfast",
    ...overrides,
  };
}
