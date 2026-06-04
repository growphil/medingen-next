import { apiClient } from "@/lib/api";
import { Product } from "@/types";

export class SearchService {
  static async searchMedicines(
    query: string,
    page: number = 1,
    filters?: Record<string, any>
  ): Promise<{ products: Product[]; total_pages: number; total_results: number }> {
    const res = await apiClient.post(`/search_medicines`, {
      query,
      page,
      filters: filters || {},
    });
    return res.data;
  }

  static async getInstantSuggestions(query: string): Promise<Product[]> {
    const res = await apiClient.get(`/search_suggestions`, {
      params: { q: query },
    });
    return res.data;
  }
}
