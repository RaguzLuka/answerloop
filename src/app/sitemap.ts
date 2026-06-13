import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.ringloop.net";
  const now  = new Date();

  return [
    { url: base,                    lastModified: now, priority: 1.0,  changeFrequency: "weekly"  },
    { url: `${base}/how-it-works`,  lastModified: now, priority: 0.9,  changeFrequency: "monthly" },
    { url: `${base}/demo`,          lastModified: now, priority: 0.9,  changeFrequency: "monthly" },
    { url: `${base}/pricing`,       lastModified: now, priority: 0.9,  changeFrequency: "monthly" },
    { url: `${base}/contact`,       lastModified: now, priority: 0.8,  changeFrequency: "monthly" },
    { url: `${base}/about`,         lastModified: now, priority: 0.6,  changeFrequency: "monthly" },
    { url: `${base}/privacy`,       lastModified: now, priority: 0.4,  changeFrequency: "yearly"  },
  ];
}
