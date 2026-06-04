import { Product, Blog, Category } from "@/types";

export class SchemaGenerator {
  static getOrganizationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Medingen",
      "url": "https://medingen.in",
      "logo": "https://medingen.in/android-chrome-192x192.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+917090123709",
        "contactType": "customer service",
        "email": "admin@medingen.in",
      },
      "sameAs": [
        "https://www.facebook.com/medingen",
        "https://twitter.com/medingen",
      ],
    };
  }

  static getWebsiteSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Medingen",
      "url": "https://medingen.in",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://medingen.in/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    };
  }

  static getProductSchema(product: Product) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": product.image || "https://medingen.in/assist.png",
      "description": product.description || `Buy ${product.name} online from Medingen. We offer generic medicines at affordable prices.`,
      "brand": {
        "@type": "Brand",
        "name": product.brand_name || product.manufacturer || "Generic",
      },
      "offers": {
        "@type": "Offer",
        "url": `https://medingen.in/medicine/${product.product_id}`,
        "priceCurrency": "INR",
        "price": product.discountedPrice || product.originalPrice,
        "priceValidUntil": "2027-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
      },
      "aggregateRating": product.rating ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviews_count || 1,
      } : undefined,
    };
  }

  static getBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url,
      })),
    };
  }

  static getFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    };
  }

  static getBlogPostingSchema(blog: Blog) {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "image": blog.image || "https://medingen.in/assist.png",
      "author": {
        "@type": "Person",
        "name": blog.author || "Medingen Expert",
      },
      "publisher": {
        "@type": "Organization",
        "name": "Medingen",
        "logo": {
          "@type": "ImageObject",
          "url": "https://medingen.in/android-chrome-192x192.png",
        },
      },
      "datePublished": blog.date_published,
      "description": blog.summary || blog.content.substring(0, 150),
    };
  }
}
