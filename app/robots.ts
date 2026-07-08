import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Explicit Allow for AI search-retrieval crawlers (ChatGPT Search, Claude web search).
      // These are distinct from the training crawlers (GPTBot, ClaudeBot) and need an
      // explicit entry so search-time citation pipelines index docs pages.
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: "https://docs.resonatehq.io/sitemap.xml",
  };
}
