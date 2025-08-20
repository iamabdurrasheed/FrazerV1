// Industrial categories structure based on the live site
export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  priceRange: {
    min: number;
    max: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  subcategories: Subcategory[];
  priceRange: {
    min: number;
    max: number;
  };
}

export const industrialCategories: Category[] = [
  {
    id: 'hvac',
    name: 'HVAC',
    slug: 'hvac',
    description: 'Heating, Ventilation, and Air Conditioning Products',
    icon: 'hvac',
    priceRange: { min: 50, max: 15000 },
    subcategories: [
      {
        id: 'hvac-components',
        name: 'HVAC Components',
        slug: 'hvac-components',
        description: 'Core HVAC system components',
        priceRange: { min: 50, max: 5000 }
      },
      {
        id: 'air-handling-units',
        name: 'Air Handling Units',
        slug: 'air-handling-units', 
        description: 'Complete air handling systems',
        priceRange: { min: 2000, max: 15000 }
      },
      {
        id: 'ventilation-systems',
        name: 'Ventilation Systems',
        slug: 'ventilation-systems',
        description: 'Industrial ventilation solutions',
        priceRange: { min: 500, max: 8000 }
      }
    ]
  },
  {
    id: 'valves',
    name: 'Valves',
    slug: 'valves',
    description: 'Industrial Valves and Flow Control',
    icon: 'valves',
    priceRange: { min: 25, max: 3000 },
    subcategories: [
      {
        id: 'ball-valves',
        name: 'Ball Valves',
        slug: 'ball-valves',
        description: 'Quarter-turn ball valves',
        priceRange: { min: 25, max: 1500 }
      },
      {
        id: 'gate-valves',
        name: 'Gate Valves',
        slug: 'gate-valves',
        description: 'Linear motion gate valves',
        priceRange: { min: 40, max: 1200 }
      },
      {
        id: 'globe-valves',
        name: 'Globe Valves',
        slug: 'globe-valves',
        description: 'Throttling and flow control',
        priceRange: { min: 45, max: 1800 }
      },
      {
        id: 'check-valves',
        name: 'Check Valves',
        slug: 'check-valves',
        description: 'Non-return valves',
        priceRange: { min: 30, max: 800 }
      },
      {
        id: 'kitz-valves',
        name: 'Kitz Valves',
        slug: 'kitz-valves',
        description: 'Premium Kitz brand valves',
        priceRange: { min: 50, max: 3000 }
      },
      {
        id: 'fov-valves',
        name: 'FOV Valves',
        slug: 'fov-valves',
        description: 'FOV industrial valves',
        priceRange: { min: 35, max: 2000 }
      }
    ]
  },
  {
    id: 'pump-spare-parts',
    name: 'Pump Spare Parts',
    slug: 'pump-spare-parts',
    description: 'Replacement Parts for Industrial Pumps',
    icon: 'pump',
    priceRange: { min: 15, max: 5000 },
    subcategories: [
      {
        id: 'impellers',
        name: 'Impellers',
        slug: 'impellers',
        description: 'Pump impellers and rotors',
        priceRange: { min: 100, max: 2000 }
      },
      {
        id: 'seals-gaskets',
        name: 'Seals & Gaskets',
        slug: 'seals-gaskets',
        description: 'Sealing solutions',
        priceRange: { min: 15, max: 500 }
      },
      {
        id: 'bearings',
        name: 'Bearings',
        slug: 'bearings',
        description: 'Industrial bearings',
        priceRange: { min: 25, max: 1200 }
      }
    ]
  },
  {
    id: 'welding-accessories',
    name: 'Welding Accessories',
    slug: 'welding-accessories',
    description: 'Professional Welding Equipment and Supplies',
    icon: 'welding',
    priceRange: { min: 10, max: 8000 },
    subcategories: [
      {
        id: 'welding-electrodes',
        name: 'Welding Electrodes',
        slug: 'welding-electrodes',
        description: 'Various welding electrodes',
        priceRange: { min: 10, max: 200 }
      },
      {
        id: 'welding-machines',
        name: 'Welding Machines',
        slug: 'welding-machines',
        description: 'Industrial welding equipment',
        priceRange: { min: 500, max: 8000 }
      },
      {
        id: 'safety-equipment',
        name: 'Safety Equipment',
        slug: 'safety-equipment',
        description: 'Welding safety gear',
        priceRange: { min: 20, max: 500 }
      }
    ]
  },
  {
    id: 'adhesives-lubricants',
    name: 'Adhesives & Lubricants',
    slug: 'adhesives-lubricants',
    description: 'Industrial Adhesives and Lubrication Solutions',
    icon: 'adhesives',
    priceRange: { min: 8, max: 2000 },
    subcategories: [
      {
        id: 'industrial-adhesives',
        name: 'Industrial Adhesives',
        slug: 'industrial-adhesives',
        description: 'High-strength adhesives',
        priceRange: { min: 15, max: 500 }
      },
      {
        id: 'lubricants',
        name: 'Lubricants',
        slug: 'lubricants',
        description: 'Industrial lubricants and oils',
        priceRange: { min: 8, max: 800 }
      },
      {
        id: 'sealants',
        name: 'Sealants',
        slug: 'sealants',
        description: 'Sealing compounds',
        priceRange: { min: 12, max: 300 }
      }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical',
    slug: 'electrical',
    description: 'Electrical Components and Systems',
    icon: 'electrical',
    priceRange: { min: 5, max: 50000 },
    subcategories: [
      {
        id: 'abb',
        name: 'ABB',
        slug: 'abb',
        description: 'ABB electrical products',
        priceRange: { min: 20, max: 50000 }
      },
      {
        id: 'walther-werke',
        name: 'WALTHER-WERKE',
        slug: 'walther-werke',
        description: 'WALTHER-WERKE products',
        priceRange: { min: 15, max: 5000 }
      },
      {
        id: 'vent-hoffman',
        name: 'nVent Hoffman',
        slug: 'nvent-hoffman',
        description: 'nVent Hoffman electrical solutions',
        priceRange: { min: 25, max: 8000 }
      },
      {
        id: 'circuit-breakers',
        name: 'Circuit Breakers',
        slug: 'circuit-breakers',
        description: 'Electrical protection devices',
        priceRange: { min: 50, max: 15000 }
      },
      {
        id: 'contactors',
        name: 'Contactors',
        slug: 'contactors',
        description: 'Electrical contactors',
        priceRange: { min: 30, max: 2000 }
      },
      {
        id: 'switches',
        name: 'Switches',
        slug: 'switches',
        description: 'Industrial switches',
        priceRange: { min: 5, max: 1000 }
      }
    ]
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Plumbing Systems and Components',
    icon: 'plumbing',
    priceRange: { min: 5, max: 3000 },
    subcategories: [
      {
        id: 'pipes-fittings',
        name: 'Pipes & Fittings',
        slug: 'pipes-fittings',
        description: 'Various pipes and fittings',
        priceRange: { min: 5, max: 500 }
      },
      {
        id: 'plumbing-tools',
        name: 'Plumbing Tools',
        slug: 'plumbing-tools',
        description: 'Professional plumbing tools',
        priceRange: { min: 20, max: 1500 }
      },
      {
        id: 'water-systems',
        name: 'Water Systems',
        slug: 'water-systems',
        description: 'Water treatment and distribution',
        priceRange: { min: 100, max: 3000 }
      }
    ]
  },
  {
    id: 'fittings-flanges',
    name: 'Fittings & Flanges',
    slug: 'fittings-flanges',
    description: 'Industrial Pipe Fittings and Flanges',
    icon: 'fittings',
    priceRange: { min: 8, max: 2500 },
    subcategories: [
      {
        id: 'pipe-fittings',
        name: 'Pipe Fittings',
        slug: 'pipe-fittings',
        description: 'Various pipe connection fittings',
        priceRange: { min: 8, max: 800 }
      },
      {
        id: 'flanges',
        name: 'Flanges',
        slug: 'flanges',
        description: 'Industrial flanges',
        priceRange: { min: 25, max: 2500 }
      },
      {
        id: 'couplings',
        name: 'Couplings',
        slug: 'couplings',
        description: 'Pipe couplings and connectors',
        priceRange: { min: 15, max: 1000 }
      }
    ]
  }
];

// Helper functions
export const getCategoryById = (id: string): Category | undefined => {
  return industrialCategories.find(cat => cat.id === id);
};

export const getSubcategoryById = (categoryId: string, subcategoryId: string): Subcategory | undefined => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};

export const getAllSubcategories = (): Subcategory[] => {
  return industrialCategories.flatMap(cat => cat.subcategories);
};

export const getPriceRangeForCategory = (categoryId: string, subcategoryId?: string): { min: number; max: number } => {
  if (subcategoryId) {
    const subcategory = getSubcategoryById(categoryId, subcategoryId);
    return subcategory?.priceRange || { min: 0, max: 10000 };
  }
  
  const category = getCategoryById(categoryId);
  return category?.priceRange || { min: 0, max: 10000 };
};
