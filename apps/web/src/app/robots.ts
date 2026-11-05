import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Search + AI answer-engine crawlers are explicitly welcome (GEO/AEO).
const aiBots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Claude-SearchBot", "Google-Extended", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/tools/" },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/", disallow: "/tools/" })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
