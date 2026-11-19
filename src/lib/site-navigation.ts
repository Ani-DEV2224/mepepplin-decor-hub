export const serviceCategories = [
  {
    "id": "property-maintenance",
    "title": "Property Improvements & Maintenance",
    "description": "Property upkeep, moisture control and dependable repairs.",
    "services": [
      "Property Improvements / Maintenance",
      "Fungus & Damp Treatment / Moisture Control Services",
      "Regular Home Repairs & Maintenance Services",
      "Building Restoration",
      "Property Renovations"
    ]
  },
  {
    "id": "property-transactions",
    "title": "Property Lease, Buying & Selling",
    "description": "Property leasing, buying and selling.",
    "services": [
      "Property Leasing",
      "Property Buying",
      "Property Selling"
    ]
  },
  {
    "id": "procurement-installation",
    "title": "Procurement & Installation Services",
    "description": "Materials, cooling systems and professional digital installations.",
    "services": [
      "Materials Procurement",
      "Building Materials Supply",
      "Fixtures Procurement",
      "Equipment & Fittings Installation",
      "Cooling Systems / AC Installation Services",
      "P4 Indoor & Outdoor Screens / Digital Display Installation Services"
    ]
  },
  {
    "id": "interior-decor",
    "title": "Interior Décor & Enhancements",
    "description": "Bespoke furnishings, cabinetry, interior fittings and finishing details.",
    "services": [
      "Interior Decoration",
      "Furniture Production, Installation & Furnishing",
      "Cabinetry & Woodwork",
      "HDF & Customized Doors",
      "POP / Ceiling Installation",
      "Tiling Works",
      "Wallpaper Installation",
      "Creative Wall Painting",
      "3D Wall Panels",
      "Curtains & Blinds"
    ]
  },
  {
    "id": "construction-finishes",
    "title": "Construction & Architectural Finishes",
    "description": "Planning, design, construction, engineering and project oversight.",
    "services": [
      "Architectural Planning / Drawings & Blueprints",
      "3D Concepts / Drawings & Fit-Out",
      "Space Planning & Design",
      "Construction Works",
      "Mechanical & Electrical Works",
      "Project Management / Site Supervision & Quality Control",
      "Budget & Cost Control",
      "Stone & Brick Finishes"
    ]
  },
  {
    "id": "outdoor-landscaping",
    "title": "Outdoor Living & Landscaping",
    "description": "Outdoor surfaces, hardscaping, planting and leisure spaces.",
    "services": [
      "Landscaping",
      "Concrete Stamped Floor",
      "Brick Interlocking Floor",
      "White & Black Slab Flooring",
      "Cut Stone Installation",
      "Industrial & Granite Epoxy Flooring Installation Services",
      "Pergolas / Thatch Huts",
      "Horticulture / Gardening & Landscaping",
      "Barbecue Spots & Balcony Designing",
      "Green Artificial Grass & Plants Landscaping"
    ]
  },
  {
    "id": "pools-water-features",
    "title": "Pools & Water Features",
    "description": "Swimming pools, water features and water treatment.",
    "services": [
      "Swimming Pools",
      "Lakes",
      "Fountains",
      "Water Treatment Services"
    ]
  }
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
