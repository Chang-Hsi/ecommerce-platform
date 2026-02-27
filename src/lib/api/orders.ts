import { request } from "@/lib/api/request";
import type { OrderView } from "@/lib/orders/types";

export async function fetchOrdersFromApi() {
  const payload = await request<{ orders: OrderView[] }>("/api/orders", {
    cache: "no-store",
  });

  return payload.data.orders;
}
