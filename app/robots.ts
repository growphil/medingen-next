import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cart",
        "/checkout",
        "/admin/",
        "/profile",
        "/savedaddress",
        "/order-payment",
        "/personal-info",
      ],
    },
    sitemap: "https://medingen.in/sitemap.xml",
  };
}
