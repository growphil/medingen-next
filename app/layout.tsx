import React from "react";
import { Outfit } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/Providers";
import { SchemaGenerator } from "@/lib/schema";
import { defaultMetadata } from "@/lib/metadata";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-outfit",
});

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = SchemaGenerator.getOrganizationSchema();
  const websiteSchema = SchemaGenerator.getWebsiteSchema();

  return (
    <html lang="en" className={`${outfit.variable}`}>
      <head>
        {/* Dynamic JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-outfit antialiased">
        {/* Defer GTM & Google Analytics to load after interaction */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7031KQLTP7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7031KQLTP7');
          `}
        </Script>

        {/* Defer Heap and Zoho Pagesense to lazy onload */}
        <Script id="heap-analytics" strategy="lazyOnload">
          {`
            window.heapReadyCb=window.heapReadyCb||[],window.heap=window.heap||[],heap.load=function(e,t){window.heap.envId=e,window.heap.clientConfig=t=t||{},window.heap.clientConfig.shouldFetchServerConfig=!1;var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://cdn.us.heap-api.com/config/"+e+"/heap_config.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r);var n=["init","startTracking","stopTracking","track","resetIdentity","identify","getSessionId","getUserId","getIdentity","addUserProperties","addEventProperties","removeEventProperty","clearEventProperties","addAccountProperties","addAdapter","addTransformer","addTransformerFn","onReady","addPageviewProperties","removePageviewProperty","clearPageviewProperties","trackPageview"],i=function(e){return function(){var t=Array.prototype.slice.call(arguments,0);window.heapReadyCb.push({name:e,fn:function(){heap[e]&&heap[e].apply(heap,t)}})}};for(var p=0;p<n.length;p++)heap[n[p]]=i(n[p])};
            heap.load("538099864");
          `}
        </Script>

        <Script
          src="https://cdn-in.pagesense.io/js/60035894944/a3e2e46f45b24447ba1b5a63db3f4bd9.js"
          strategy="lazyOnload"
        />

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
