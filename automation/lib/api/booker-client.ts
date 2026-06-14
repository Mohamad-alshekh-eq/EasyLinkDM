import { APIRequestContext, APIResponse } from "@playwright/test";
import { Booking } from "./types";

export class BookerClient {
  constructor(private readonly request: APIRequestContext) {}

  createToken(username: string, password: string): Promise<APIResponse> {
    return this.request.post("/auth", {
      data: { username, password },
    });
  }

  createBooking(data: Booking): Promise<APIResponse> {
    return this.request.post("/booking", { data });
  }

  getBookings(filters?: Record<string, string>): Promise<APIResponse> {
    return this.request.get("/booking", { params: filters });
  }

  async getBooking(id: number): Promise<APIResponse> {
    const res = await this.request.get(`/booking/${id}`);
    return res;
  }

  updateBooking(
    id: number,
    data: Booking,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      data,
      headers: token ? { Cookie: `token=${token}` } : undefined,
    });
  }

  partialUpdateBooking(
    id: number,
    data: Partial<Booking>,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, {
      data,
      headers: token ? { Cookie: `token=${token}` } : undefined,
    });
  }

  deleteBooking(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, {
      headers: token ? { Cookie: `token=${token}` } : undefined,
    });
  }
}
