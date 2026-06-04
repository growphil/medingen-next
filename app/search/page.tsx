import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchService } from "@/services/search.service";
import { generatePageMetadata } from "@/lib/metadata";
import { Product } from "@/types";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q || "";
  return generatePageMetadata({
    title: q ? `Search results for "${q}" - Medingen` : "Search Generic Medicines - Medingen",
    description: `Browse affordable generic alternatives matching query "${q}" online at Medingen.`,
    slug: "search",
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q || "";
  const page = Number(resolvedSearchParams.page || "1");

  let searchRes: { products: Product[]; total_results: number; total_pages: number } = { products: [], total_results: 0, total_pages: 0 };
  if (q) {
    try {
      searchRes = await SearchService.searchMedicines(q, page);
    } catch (err) {
      console.error("Failed to load search results", err);
    }
  }

  const products = searchRes.products || [];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
          Search Results
        </h1>
        <p className="text-slate-500 mb-8">
          Showing results for <span className="text-medingen-primary font-bold">"{q}"</span> ({searchRes.total_results || 0} matches)
        </p>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
            <p className="text-lg text-slate-500 mb-4">No generic medicines found matching your search term.</p>
            <Link href="/" className="bg-medingen-primary hover:bg-medingen-dark text-white px-6 py-3 rounded-full font-semibold transition-colors">
              Return to Homepage
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.product_id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div className="relative w-full h-40 bg-slate-50 rounded-xl mb-4 flex items-center justify-center p-2 group-hover:scale-[1.02] transition-transform">
                    <Image
                      src={product.image || "/assist.png"}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-medingen-primary transition-colors">
                    <Link href={`/medicine/${product.product_id}`}>{product.name}</Link>
                  </h3>
                  {product.pack_size && (
                    <span className="text-xs text-slate-400 font-semibold">{product.pack_size}</span>
                  )}
                </div>

                <div className="mt-6 border-t border-slate-50 pt-4 flex items-center justify-between">
                  <div>
                    <span className="block text-lg font-black text-slate-800">₹{product.discountedPrice}</span>
                    {product.originalPrice > product.discountedPrice && (
                      <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <button className="bg-medingen-primary hover:bg-medingen-dark text-white px-4 py-2 rounded-full text-xs font-bold transition-all transform active:scale-95">
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
