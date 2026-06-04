import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Medingen Buy Generic Medicines Online",
    short_name: "Medingen",
    description: "Medingen offers Generic Medicines Home Delivery at affordable prices.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5D399B",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      }
    ],
  };
}
