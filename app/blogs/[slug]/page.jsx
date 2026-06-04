import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogService } from "@/services/blog.service";
import { SchemaGenerator } from "@/lib/schema";
import { generatePageMetadata } from "@/lib/metadata";

// Set ISR Revalidation to 24 hours
export const revalidate = 86400;

// Pre-render blog pages static parameters
export async function generateStaticParams() {
  try {
    const res = await BlogService.getAllBlogs(1);
    return res.blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (err) {
    return [];
  }
}

// Generate dynamic metadata
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase().trim();
  try {
    const blog = await BlogService.getBlogBySlug(slug);
    if (!blog) return {};

    return generatePageMetadata({
      title: blog.meta_title || `${blog.title} - Medingen Health Blog`,
      description: blog.meta_description || blog.summary || blog.content.substring(0, 150),
      keywords: blog.keywords ? blog.keywords.split(",") : [],
      slug: `blogs/${slug}`,
      image: blog.image,
    });
  } catch (err) {
    return {};
  }
}

export default async function BlogPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase().trim();
  const blogData = await BlogService.getBlogBySlug(slug).catch(() => null);

  if (!blogData) {
    notFound();
  }

  const blog = blogData;
  const blogSchema = SchemaGenerator.getBlogPostingSchema(blog);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      {/* Blog JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <article className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        {/* Optimized Header Image */}
        {blog.image && (
          <div className="relative w-full h-[300px] md:h-[450px] bg-slate-100">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>
        )}

        <div className="p-6 md:p-10">
          <nav className="text-sm text-slate-500 mb-6 flex items-center space-x-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/blogs" className="hover:underline">Blogs</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium truncate">{blog.title}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center text-xs text-slate-400 font-medium mb-8 space-x-4">
            {blog.author && (
              <span>Author: <strong className="text-slate-600">{blog.author}</strong></span>
            )}
            <span>•</span>
            <span>Published: {new Date(blog.date_published).toLocaleDateString()}</span>
          </div>

          {/* Dynamic HTML Content Injection */}
          <div
            className="prose prose-purple max-w-none text-slate-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>
    </div>
  );
}
