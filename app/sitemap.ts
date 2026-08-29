import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blogData";
import { siteConfig } from "@/lib/seo";

// Only pages that are actually meant to be indexed: the core portfolio
// routes, plus native (non-Medium) blog posts. Gallery, Mind Break, and the
// private vault carry their own `robots: { index: false }` and are
// deliberately left out here so the sitemap never lists a noindex URL.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "", priority: 1, changeFrequency: "monthly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/projects", priority: 0.8, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  ];

  const blogRoutes = blogPosts
    .filter((post) => post.platform === "site")
    .map((post) => ({
      path: post.href,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    }));

  return [...staticRoutes, ...blogRoutes].map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
