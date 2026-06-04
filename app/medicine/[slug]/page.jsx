import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MedicineService } from "@/services/medicine.service";
import { SchemaGenerator } from "@/lib/schema";
import { generatePageMetadata } from "@/lib/metadata";

// Set ISR Revalidation to 1 hour
export const revalidate = 3600;

// Generate dynamic dynamic metadata for crawlers
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase().trim();
  try {
    const product = await MedicineService.getMedicineBySlug(slug);
    if (!product) return {};

    return generatePageMetadata({
      title: product.meta_title || `${product.name} - Buy Generic Medicines Online`,
      description: product.meta_description || `Order ${product.name} online from Medingen. Highly affordable rates and fast delivery.`,
      keywords: product.keywords ? product.keywords.split(",") : [],
      slug: `medicine/${slug}`,
      image: product.image,
    });
  } catch (err) {
    return {};
  }
}

export default async function MedicinePage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase().trim();
  const productData = await MedicineService.getMedicineBySlug(slug).catch(() => null);

  if (!productData) {
    notFound();
  }

  const product = productData;
  const productSchema = SchemaGenerator.getProductSchema(product);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      {/* Product JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="max-w-6xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        {/* Dynamic Breadcrumbs */}
        <nav className="text-sm text-slate-500 mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/generic-medicine-online" className="hover:underline">Medicines</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Optimized Product Image */}
          <div className="relative w-full h-[350px] md:h-[400px] bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100">
            <Image
              src={product.image || "/assist.png"}
              alt={product.name}
              fill
              className="object-contain p-4"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Product Purchase Box */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold bg-purple-50 text-medingen-primary px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                {product.pack_size || "Standard pack"}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
                {product.name}
              </h1>
              {product.salt && (
                <p className="text-sm text-slate-500 mb-4 font-medium">
                  Composition: <span className="text-medingen-primary">{product.salt}</span>
                </p>
              )}
              <p className="text-slate-600 mb-6 leading-relaxed">
                {product.description || `Highly dynamic generic medicinal alternative offering standard effectiveness and premium results. pack size: ${product.pack_size || "N/A"}.`}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-3xl font-black text-slate-800">
                  ₹{product.discountedPrice}
                </span>
                {product.originalPrice > product.discountedPrice && (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="text-sm font-bold text-green-500 bg-green-50 px-2.5 py-1 rounded-lg">
                      Save {Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Add to Cart Trigger */}
              <button className="w-full md:w-auto bg-gradient-to-r from-medingen-primary to-medingen-secondary text-white py-4 px-12 rounded-full font-bold text-lg hover:shadow-lg transition-all transform active:scale-95">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Alternatives / Comparison matrix */}
        {product.composition && (
          <section className="border-t border-slate-100 pt-8 mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">
              Salt Comparison details
            </h2>
            <p className="text-slate-600 mb-4">
              This generic option matches standard specifications of composition: <strong className="text-slate-700">{product.composition}</strong>.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
