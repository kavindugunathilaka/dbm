// Single source of truth for company facts (NAP) and home-page content.
// Keep NAP identical to Google Business Profile and directory listings.

export const site = {
  url: "https://dbm.lk",
  name: "DBM Associates",
  legalName: "DBM Associate (Pvt) Ltd",
  regNo: "P.V.00227523",
  tagline: "Design, Build & Manage",
  // What DBM is, for SEO titles and copy (keep the keyword next to the brand line).
  descriptor: "Architects & Building Consultants",
  // Brand line printed under the logo on receipts and invoices.
  printTagline: "DESIGN BUILD & MANAGE",
  description:
    "DBM Associates (Design, Build & Manage) is an architectural and building consultancy in Pannipitiya, Sri Lanka. We design warehouses, offices and homes and take clients from first brief to approved drawings.",
  address: {
    street: "No. 60/1, Digana Road, Palanwatta",
    locality: "Pannipitiya",
    region: "Western Province",
    postalCode: "10230",
    country: "LK",
  },
  phones: [
    { display: "074 060 0780", e164: "+94740600780" },
    { display: "070 403 5095", e164: "+94704035095" },
  ],
  // WhatsApp: 074 060 0780 (confirmed by DBM).
  whatsapp: "94740600780",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=60%2F1+Digana+Road+Palanwatta+Pannipitiya",
  areasServed: [
    "Pannipitiya",
    "Maharagama",
    "Kottawa",
    "Homagama",
    "Nugegoda",
    "Piliyandala",
    "Colombo",
    "All of Sri Lanka",
  ],
} as const;

export const nav = [
  { href: "/#services", label: "Services" },
  { href: "/#sectors", label: "Sectors" },
  { href: "/#process", label: "Process" },
  { href: "/#projects", label: "Projects" },
  { href: "/#approvals", label: "Approvals" },
  { href: "/#faq", label: "FAQ" },
] as const;

export const services = [
  {
    title: "Architectural Design",
    body: "Concept to working drawings for residential, commercial and industrial buildings, planned around your site, budget and how you use the space.",
  },
  {
    title: "Building Approvals",
    body: "We prepare and submit approval drawings to the UDA or your local authority and follow them through to the permit.",
  },
  {
    title: "Structural & MEP Coordination",
    body: "We coordinate structural, electrical and plumbing design through our consultancy consortium, so the drawings work together on site.",
  },
  {
    title: "Project Supervision",
    body: "Site inspections and contractor coordination, so the building is built the way it was drawn.",
  },
  {
    title: "Landscape Design",
    body: "Outdoor space, drainage and planting designed together with the building.",
  },
] as const;

export const sectors = [
  {
    key: "industrial",
    title: "Warehouses & Industrial",
    body: "Clear-span storage, loading bays, office mezzanines and fire-safe layouts for logistics and manufacturing.",
  },
  {
    key: "commercial",
    title: "Offices & Commercial",
    body: "Head offices, showrooms and mixed-use buildings designed for staff, customers and future growth.",
  },
  {
    key: "residential",
    title: "Homes & Residential",
    body: "Houses that suit the tropical climate, planned for your plot, family and budget.",
  },
] as const;

export const stages = [
  { n: 1, title: "Engagement", body: "We agree the brief, scope and fee, then review the site and survey plan." },
  { n: 2, title: "Schematic Design", body: "Layout options, massing and a first look at the building." },
  { n: 3, title: "Design Development", body: "Plans, elevations and materials are refined, and the engineers are brought in." },
  { n: 4, title: "Development Approval", body: "Drawings are submitted to the UDA or local authority, and we follow them up until approval." },
  { n: 5, title: "Working Drawings", body: "Detailed construction drawings that contractors can price and build from." },
  { n: 6, title: "Landscape Design", body: "External works, planting and finishing touches." },
] as const;

export const faqs = [
  {
    q: "What does DBM Associates do?",
    a: "DBM Associates is an architectural and building consultancy based in Pannipitiya, Sri Lanka. We design warehouses, offices, commercial buildings and homes, and we prepare and follow through building approvals with the UDA and local authorities.",
  },
  {
    q: "Do you design warehouses and factories?",
    a: "Yes. Industrial and warehouse buildings are one of our core sectors. We plan clear spans, loading and circulation, office space, and fire and approval requirements from the first drawing.",
  },
  {
    q: "Who approves my building plan, the UDA or the local authority?",
    a: "In most areas the local authority (Municipal Council, Urban Council or Pradeshiya Sabha) approves building plans under UDA regulations. Larger developments, for example big plots or buildings above certain floor-area limits, are referred to the UDA. We check which route applies to your plot before we submit.",
  },
  {
    q: "How are your fees structured?",
    a: "Fees are staged. An engagement fee starts the project, and the remaining stages (schematic design, design development, approval, working drawings and landscape) are confirmed as the scope becomes clear. You only pay for the stage you are in.",
  },
  {
    q: "Which areas do you work in?",
    a: "We are based in Pannipitiya and work across the Colombo suburbs, including Maharagama, Kottawa, Homagama, Nugegoda and Piliyandala, and on projects anywhere in Sri Lanka.",
  },
  {
    q: "What do I need to get started?",
    a: "A copy of the survey plan, the land deed if you have it, the location, and a short note on what you want to build and your budget. Send them by WhatsApp or through the form and we will arrange a first meeting.",
  },
] as const;

export const featuredProject = {
  title: "Warehouse & Office Facility",
  location: "Pannala",
  sector: "Industrial / Commercial",
  status: "In design",
  scope: ["Architectural design", "Development approval", "Working drawings", "Landscape"],
  body: "A combined warehouse and office facility designed for storage, staff and growth. DBM is the lead architect, working through every stage from schematic design to landscape.",
} as const;

export const whatsappLink = (text = "Hello DBM Associates, I'd like to discuss a building project.") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
