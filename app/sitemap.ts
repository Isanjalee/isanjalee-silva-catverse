import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/projects", "/contact"];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
  }));
}
