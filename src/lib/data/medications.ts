/**
 * Comprehensive medication database for prescription management
 * This includes common medications with their typical dosages and categories
 */

export interface MedicationOption {
  value: string;
  label: string;
  category: string;
  commonDosages: string[];
  description?: string;
}

export const MEDICATION_CATEGORIES = [
  "Antibiotics",
  "Pain Relief",
  "Cardiovascular",
  "Diabetes",
  "Respiratory",
  "Gastrointestinal",
  "Neurological",
  "Dermatological",
  "Vitamins & Supplements",
  "Other",
] as const;

export const MEDICATIONS: MedicationOption[] = [
  // Antibiotics
  {
    value: "amoxicillin",
    label: "Amoxicillin",
    category: "Antibiotics",
    commonDosages: ["250mg", "500mg", "875mg"],
    description: "Penicillin antibiotic for bacterial infections",
  },
  {
    value: "azithromycin",
    label: "Azithromycin",
    category: "Antibiotics",
    commonDosages: ["250mg", "500mg"],
    description: "Macrolide antibiotic for respiratory and skin infections",
  },
  {
    value: "ciprofloxacin",
    label: "Ciprofloxacin",
    category: "Antibiotics",
    commonDosages: ["250mg", "500mg", "750mg"],
    description: "Fluoroquinolone antibiotic for various infections",
  },
  {
    value: "doxycycline",
    label: "Doxycycline",
    category: "Antibiotics",
    commonDosages: ["50mg", "100mg"],
    description: "Tetracycline antibiotic for bacterial infections",
  },
  {
    value: "metronidazole",
    label: "Metronidazole",
    category: "Antibiotics",
    commonDosages: ["250mg", "500mg"],
    description: "Antibiotic for anaerobic bacterial infections",
  },

  // Pain Relief
  {
    value: "acetaminophen",
    label: "Acetaminophen",
    category: "Pain Relief",
    commonDosages: ["325mg", "500mg", "650mg"],
    description: "Pain reliever and fever reducer",
  },
  {
    value: "ibuprofen",
    label: "Ibuprofen",
    category: "Pain Relief",
    commonDosages: ["200mg", "400mg", "600mg", "800mg"],
    description: "NSAID for pain, inflammation, and fever",
  },
  {
    value: "naproxen",
    label: "Naproxen",
    category: "Pain Relief",
    commonDosages: ["220mg", "440mg", "500mg"],
    description: "NSAID for pain and inflammation",
  },
  {
    value: "tramadol",
    label: "Tramadol",
    category: "Pain Relief",
    commonDosages: ["50mg", "100mg"],
    description: "Opioid pain medication",
  },
  {
    value: "morphine",
    label: "Morphine",
    category: "Pain Relief",
    commonDosages: ["5mg", "10mg", "15mg", "30mg"],
    description: "Strong opioid pain medication",
  },

  // Cardiovascular
  {
    value: "lisinopril",
    label: "Lisinopril",
    category: "Cardiovascular",
    commonDosages: ["2.5mg", "5mg", "10mg", "20mg", "40mg"],
    description: "ACE inhibitor for hypertension and heart failure",
  },
  {
    value: "metoprolol",
    label: "Metoprolol",
    category: "Cardiovascular",
    commonDosages: ["25mg", "50mg", "100mg"],
    description: "Beta-blocker for hypertension and heart conditions",
  },
  {
    value: "amlodipine",
    label: "Amlodipine",
    category: "Cardiovascular",
    commonDosages: ["2.5mg", "5mg", "10mg"],
    description: "Calcium channel blocker for hypertension",
  },
  {
    value: "atorvastatin",
    label: "Atorvastatin",
    category: "Cardiovascular",
    commonDosages: ["10mg", "20mg", "40mg", "80mg"],
    description: "Statin for cholesterol management",
  },
  {
    value: "warfarin",
    label: "Warfarin",
    category: "Cardiovascular",
    commonDosages: [
      "1mg",
      "2mg",
      "2.5mg",
      "3mg",
      "4mg",
      "5mg",
      "6mg",
      "7.5mg",
      "10mg",
    ],
    description: "Anticoagulant for blood clot prevention",
  },

  // Diabetes
  {
    value: "metformin",
    label: "Metformin",
    category: "Diabetes",
    commonDosages: ["500mg", "850mg", "1000mg"],
    description: "Biguanide for type 2 diabetes management",
  },
  {
    value: "insulin-glargine",
    label: "Insulin Glargine",
    category: "Diabetes",
    commonDosages: ["100 units/mL"],
    description: "Long-acting insulin for diabetes",
  },
  {
    value: "insulin-aspart",
    label: "Insulin Aspart",
    category: "Diabetes",
    commonDosages: ["100 units/mL"],
    description: "Rapid-acting insulin for diabetes",
  },
  {
    value: "glipizide",
    label: "Glipizide",
    category: "Diabetes",
    commonDosages: ["5mg", "10mg"],
    description: "Sulfonylurea for type 2 diabetes",
  },

  // Respiratory
  {
    value: "albuterol",
    label: "Albuterol",
    category: "Respiratory",
    commonDosages: ["90mcg", "180mcg"],
    description: "Bronchodilator for asthma and COPD",
  },
  {
    value: "prednisone",
    label: "Prednisone",
    category: "Respiratory",
    commonDosages: ["5mg", "10mg", "20mg"],
    description: "Corticosteroid for inflammation and asthma",
  },
  {
    value: "montelukast",
    label: "Montelukast",
    category: "Respiratory",
    commonDosages: ["4mg", "5mg", "10mg"],
    description: "Leukotriene receptor antagonist for asthma",
  },

  // Gastrointestinal
  {
    value: "omeprazole",
    label: "Omeprazole",
    category: "Gastrointestinal",
    commonDosages: ["10mg", "20mg", "40mg"],
    description: "Proton pump inhibitor for acid reflux",
  },
  {
    value: "ranitidine",
    label: "Ranitidine",
    category: "Gastrointestinal",
    commonDosages: ["75mg", "150mg", "300mg"],
    description: "H2 blocker for acid reflux",
  },
  {
    value: "loperamide",
    label: "Loperamide",
    category: "Gastrointestinal",
    commonDosages: ["2mg"],
    description: "Antidiarrheal medication",
  },

  // Neurological
  {
    value: "gabapentin",
    label: "Gabapentin",
    category: "Neurological",
    commonDosages: ["100mg", "300mg", "400mg", "600mg", "800mg"],
    description: "Anticonvulsant for seizures and nerve pain",
  },
  {
    value: "diazepam",
    label: "Diazepam",
    category: "Neurological",
    commonDosages: ["2mg", "5mg", "10mg"],
    description: "Benzodiazepine for anxiety and muscle spasms",
  },
  {
    value: "sertraline",
    label: "Sertraline",
    category: "Neurological",
    commonDosages: ["25mg", "50mg", "100mg", "150mg", "200mg"],
    description: "SSRI antidepressant",
  },

  // Vitamins & Supplements
  {
    value: "vitamin-d3",
    label: "Vitamin D3",
    category: "Vitamins & Supplements",
    commonDosages: ["1000 IU", "2000 IU", "5000 IU"],
    description: "Vitamin D supplement for bone health",
  },
  {
    value: "calcium-carbonate",
    label: "Calcium Carbonate",
    category: "Vitamins & Supplements",
    commonDosages: ["500mg", "600mg", "1000mg"],
    description: "Calcium supplement for bone health",
  },
  {
    value: "multivitamin",
    label: "Multivitamin",
    category: "Vitamins & Supplements",
    commonDosages: ["1 tablet", "1 capsule"],
    description: "Daily multivitamin supplement",
  },
];

/**
 * Get medications by category
 */
export const getMedicationsByCategory = (
  category: string
): MedicationOption[] => {
  return MEDICATIONS.filter((med) => med.category === category);
};

/**
 * Search medications by name or description
 */
export const searchMedications = (query: string): MedicationOption[] => {
  const lowercaseQuery = query.toLowerCase();
  return MEDICATIONS.filter(
    (med) =>
      med.label.toLowerCase().includes(lowercaseQuery) ||
      med.description?.toLowerCase().includes(lowercaseQuery) ||
      med.category.toLowerCase().includes(lowercaseQuery)
  );
};

/**
 * Get common dosages for a specific medication
 */
export const getCommonDosages = (medicationValue: string): string[] => {
  const medication = MEDICATIONS.find((med) => med.value === medicationValue);
  return medication?.commonDosages || [];
};

/**
 * Initialize default medications in Firebase for a user
 * This function can be called to populate a user's medication list with default medications
 */
export const initializeDefaultMedications = async (
  userId: string,
  mutate: (params: {
    path: string;
    data: Record<string, unknown>;
    action: "create" | "update" | "delete" | "createWithId";
  }) => Promise<{
    success: boolean;
    id?: string | null;
    path?: string;
    error?: string;
  }>
): Promise<void> => {
  try {
    // Create a batch of default medications
    const promises = MEDICATIONS.map((medication) =>
      mutate({
        path: `medications/${userId}`,
        data: medication as unknown as Record<string, unknown>,
        action: "createWithId",
      })
    );

    await Promise.all(promises);
    console.log("Default medications initialized successfully");
  } catch (error) {
    console.error("Error initializing default medications:", error);
    throw error;
  }
};
