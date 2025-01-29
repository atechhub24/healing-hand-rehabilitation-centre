export const activityLevels = {
  sedentary: {
    label: "Sedentary",
    description: "Little or no exercise, desk job",
    multiplier: 1.2,
  },
  lightlyActive: {
    label: "Lightly Active",
    description: "Light exercise 1-3 days/week",
    multiplier: 1.375,
  },
  moderatelyActive: {
    label: "Moderately Active",
    description: "Moderate exercise 3-5 days/week",
    multiplier: 1.55,
  },
  veryActive: {
    label: "Very Active",
    description: "Heavy exercise 6-7 days/week",
    multiplier: 1.725,
  },
  extraActive: {
    label: "Extra Active",
    description: "Very heavy exercise, physical job or training twice per day",
    multiplier: 1.9,
  },
} as const;

export type ActivityLevel = keyof typeof activityLevels;

export const macroSplits = {
  maintenance: {
    protein: 0.3, // 30%
    carbs: 0.4, // 40%
    fats: 0.3, // 30%
  },
  weightLoss: {
    protein: 0.4, // 40%
    carbs: 0.3, // 30%
    fats: 0.3, // 30%
  },
  muscleGain: {
    protein: 0.35, // 35%
    carbs: 0.45, // 45%
    fats: 0.2, // 20%
  },
} as const;

export type GoalType = keyof typeof macroSplits;
