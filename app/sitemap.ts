import { MetadataRoute } from "next";
import { MedicineService } from "@/services/medicine.service";
import { CategoryService } from "@/services/category.service";
import { BlogService } from "@/services/blog.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://medingen.in";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/generic-medicine-online`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  // Fetch dynamic categories — fail gracefully during build if API unavailable
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await CategoryService.getAllCategories();
    if (Array.isArray(categories)) {
      categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/categories/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Sitemap category fetch failed — backend may be unavailable during build
  }

  // Fetch dynamic blogs — fail gracefully during build if API unavailable
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogRes = await BlogService.getAllBlogs(1);
    if (blogRes?.blogs && Array.isArray(blogRes.blogs)) {
      blogRoutes = blogRes.blogs.map((blog) => ({
        url: `${baseUrl}/blogs/${blog.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Sitemap blog fetch failed — backend may be unavailable during build
  }

  return [...staticRoutes, ...categoryRoutes, ...blogRoutes];
}
