import { faqs, services, site } from "./site";

// JSON-LD graph for the home page: Organization + ProfessionalService + WebSite + FAQPage.
export function homeJsonLd() {
  const orgId = `${site.url}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": orgId,
        name: site.name,
        legalName: site.legalName,
        slogan: site.tagline,
        alternateName: ["DBM", "DBM Associate (Pvt) Ltd"],
        url: site.url,
        logo: `${site.url}/icon.svg`,
        description: site.description,
        identifier: { "@type": "PropertyValue", propertyID: "Sri Lanka Company Registration", value: site.regNo },
        telephone: site.phones.map((p) => p.e164),
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.locality,
          addressRegion: site.address.region,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        },
        areaServed: site.areasServed.map((a) => ({ "@type": a === "All of Sri Lanka" ? "Country" : "City", name: a === "All of Sri Lanka" ? "Sri Lanka" : a })),
        knowsAbout: ["Architectural design", "Warehouse design", "Building approvals", "UDA approval", "Landscape design"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.body, provider: { "@id": orgId } },
          })),
        },
        // TODO(DBM): add sameAs (Google Business Profile, Facebook, LinkedIn) once live.
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": orgId },
        inLanguage: "en-LK",
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
