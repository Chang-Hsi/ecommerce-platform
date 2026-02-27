import { snkrsContent } from "@/content/snkrs";
import { snkrsInStockCards, snkrsUpcomingCards } from "@/lib/snkrs/mock-snkrs-products";
import {
  snkrsMapCenters,
  snkrsShanghaiStores,
  snkrsTaiwanNorthStores,
  snkrsUserLocations,
} from "@/lib/snkrs/mock-snkrs-stores";
import { apiOk } from "@/lib/server/api-response";

export async function GET() {
  return apiOk({
    content: snkrsContent,
    products: {
      inStock: snkrsInStockCards,
      upcoming: snkrsUpcomingCards,
    },
    map: {
      centers: snkrsMapCenters,
      userLocations: snkrsUserLocations,
      stores: {
        taiwanNorth: snkrsTaiwanNorthStores,
        shanghai: snkrsShanghaiStores,
      },
    },
  });
}
