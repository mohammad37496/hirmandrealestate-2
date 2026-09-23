import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/hirmand/site-page";
import { FAQ_JSON_LD } from "@/lib/site";
import { enhancedOrganizationJsonLd, homeHead, jsonLdScript } from "@/lib/seo";

// The marketing shell must render even when the optional property database is
// unavailable. Listings hydrate client-side after the first paint.
export const Route = createFileRoute("/")({
  component: Home,
  head: () => homeHead(),
});

function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(enhancedOrganizationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(FAQ_JSON_LD) }}
      />
      <SitePage initialProperties={[]} />
    </>
  );
}
