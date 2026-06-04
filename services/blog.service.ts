import { apiClient } from "@/lib/api";
import { Blog } from "@/types";

export class BlogService {
  static async getAllBlogs(page: number = 1): Promise<{ blogs: Blog[]; total_pages: number }> {
    const res = await apiClient.get(`/blogs?page=${page}`);
    return res.data;
  }

  static async getBlogBySlug(slug: string): Promise<Blog> {
    const res = await apiClient.get(`/blogs/${slug}`);
    return res.data;
  }
}
