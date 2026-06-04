import { apiClient } from "@/lib/api";
import { Category, Product } from "@/types";

export class CategoryService {
  static async getMainCategories(): Promise<Category[]> {
    const res = await apiClient.get("/main_categories");
    return res.data;
  }

  static async getAllCategories(): Promise<Category[]> {
    const res = await apiClient.get("/all_categories");
    return res.data;
  }

  static async getCategoryHierarchy(): Promise<any> {
    const res = await apiClient.get("/category_hierarchy");
    return res.data;
  }

  static async getCategoryProducts(
    mainCategory: string,
    subCategory?: string,
    filters?: Record<string, any>
  ): Promise<{ products: Product[]; total: number }> {
    const res = await apiClient.post("/category_products", {
      main_category: mainCategory,
      sub_category: subCategory || null,
      filters: filters || {},
    });
    return res.data;
  }
}
