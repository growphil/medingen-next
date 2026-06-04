import { apiClient, getAuthHeaders } from "@/lib/api";
import { Product } from "@/types";

export class MedicineService {
  static async getMedicineBySlug(slug: string): Promise<Product> {
    const res = await apiClient.post(`/get_medicine`, { slug });
    return res.data;
  }

  static async getSaltDetails(saltName: string): Promise<any> {
    const res = await apiClient.post(`/get_salt`, { salt_name: saltName });
    return res.data;
  }

  static async getAveragePrice(composition: string, saltName: string): Promise<any> {
    const res = await apiClient.post(`/avg_price`, {
      composition,
      salt_name: saltName,
    });
    return res.data;
  }

  static async getMedicineAlternatives(productId: string | number): Promise<Product[]> {
    const res = await apiClient.get(`/medicine/${productId}/alternatives`);
    return res.data;
  }
}
