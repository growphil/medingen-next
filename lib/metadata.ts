import { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: "Buy Generic Medicines Online | Trusted Store - Medingen",
  description: "Medingen offers Generic Medicines Home Delivery at affordable prices. Order online from a trusted store and get fast doorstep delivery.",
  keywords: ["generic medicine", "buy online medicine", "affordable medicine", "medingen store"],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://medingen.in",
  },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://medingen.in",
    siteName: "Medingen",
    title: "Buy Generic Medicines Online | Trusted Store - Medingen",
    description: "Medingen offers Generic Medicines Home Delivery at affordable prices. Order online from a trusted store and get fast doorstep delivery.",
    images: [
      {
        url: "https://medingen.in/assist.png",
        width: 800,
        height: 600,
        alt: "Medingen Store Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Generic Medicines Online | Trusted Store - Medingen",
    description: "Medingen offers Generic Medicines Home Delivery at affordable prices.",
    images: ["https://medingen.in/assist.png"],
  },
};

export const generatePageMetadata = (options: {
  title: string;
  description: string;
  keywords?: string[];
  slug?: string;
  image?: string;
}): Metadata => {
  const canonicalUrl = options.slug 
    ? `https://medingen.in/${options.slug}` 
    : "https://medingen.in";
  
  const ogImage = options.image || "https://medingen.in/assist.png";

  return {
    ...defaultMetadata,
    title: options.title,
    description: options.description,
    keywords: options.keywords || defaultMetadata.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      title: options.title,
      description: options.description,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 800,
          height: 600,
          alt: options.title,
        }
      ],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: options.title,
      description: options.description,
      images: [ogImage],
    },
  };
};
