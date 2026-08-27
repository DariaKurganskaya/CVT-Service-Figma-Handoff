import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = "https://remontvariator.ru";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/privacy-policy/`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/personal-data-consent/`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/cookie-policy/`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
