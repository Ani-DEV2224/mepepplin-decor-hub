
export const serviceCategories = [
  {
    id: "interior-decor",
    title: "Interior Décor & Home Enhancements",
    description: "Details that bring comfort and character.",
    services: [
      "Home accessories and crafts",
      "Curtains and blinds",
      "Bathroom fittings",
      "White slab designs",
      "Home repairs and maintenance",
    ],
  },
  {
    id: "architectural-finishes",
    title: "Architectural Finishes & Construction",
    description: "Distinctive structural details and finishes.",
    services: [
      "Stainless steel and wrought iron gates",
      "Fences, stair rails and protectors",
      "Cut stone installation",
      "Machine brick supply and installation",
      "Chippings supply",
    ],
  },
  {
    id: "outdoor-living",
    title: "Outdoor Living & Landscaping",
    description: "Beautiful environments beyond the walls.",
    services: [
      "Balcony designs",
      "Barbecue spot designs",
      "Horticulture and gardens",
      "Green landscape decoration",
    ],
  },
  {
    id: "water-features",
    title: "Pools & Water Features",
    description: "Water-inspired outdoor experiences.",
    services: [
      "Swimming pools",
      "Lakes and fountains",
    ],
  },
  {
    id: "technical-installations",
    title: "Technical Installations & Procurement",
    description: "Practical systems and dependable installations.",
    services: [
      "Cooling systems and air-conditioning installation",
      "General supply and installation",
      "Procurement and installation services",
    ],
  },
  {
    id: "property-projects",
    title: "Property & Project Services",
    description: "Supporting properties from planning to upkeep.",
    services: [
      "Site supervision",
      "Project management",
      "Property maintenance",
      "Property buying and selling",
    ],
  },
] as const;

export const navigation = [
  { label: "Home", href: "/", icon: "home" },
  { label: "About Us", href: "/about", icon: "about" },
  { label: "Services", href: "/expertise", icon: "services" },
  { label: "Projects", href: "/projects", icon: "projects" },
  { label: "Properties", href: "/expertise#property-projects", icon: "properties" },
  { label: "Testimonials", href: "/#testimonials", icon: "testimonials" },
  { label: "Gallery", href: "/projects#gallery", icon: "gallery" },
  { label: "Contact", href: "/contact", icon: "contact" },
] as const;
