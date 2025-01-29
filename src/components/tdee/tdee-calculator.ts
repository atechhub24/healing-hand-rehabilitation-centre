import {
  ActivityLevel,
  activityLevels,
  GoalType,
  macroSplits,
} from "./activity-levels";

// Calculate BMR using the Mifflin-St Jeor Equation
export const calculateBMR = (
  weight: number, // in kg
  height: number, // in cm
  age: number,
  gender: "male" | "female"
) => {
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  return gender === "male" ? baseBMR + 5 : baseBMR - 161;
};

// Calculate TDEE
export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel) => {
  return Math.round(bmr * activityLevels[activityLevel].multiplier);
};

// Calculate calories based on goal
export const calculateTargetCalories = (tdee: number, goal: GoalType) => {
  switch (goal) {
    case "weightLoss":
      return Math.round(tdee * 0.8); // 20% deficit
    case "muscleGain":
      return Math.round(tdee * 1.1); // 10% surplus
    default:
      return tdee; // maintenance
  }
};

// Calculate macronutrients
export const calculateMacros = (calories: number, goal: GoalType) => {
  const { protein, carbs, fats } = macroSplits[goal];

  // 1g protein = 4 calories
  // 1g carbs = 4 calories
  // 1g fat = 9 calories

  return {
    protein: Math.round((calories * protein) / 4),
    carbs: Math.round((calories * carbs) / 4),
    fats: Math.round((calories * fats) / 9),
  };
};

export interface TDEEResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export const calculateTDEEWithMacros = (
  weight: number,
  height: number,
  age: number,
  gender: "male" | "female",
  activityLevel: ActivityLevel,
  goal: GoalType
): TDEEResult => {
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const targetCalories = calculateTargetCalories(tdee, goal);
  const macros = calculateMacros(targetCalories, goal);

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    macros,
  };
};
