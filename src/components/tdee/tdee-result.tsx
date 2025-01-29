import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TDEEResult } from "./tdee-calculator";
import { GoalType } from "./activity-levels";

interface MacroCardProps {
  label: string;
  grams: number;
  calories: number;
  color: string;
}

function MacroCard({ label, grams, calories, color }: MacroCardProps) {
  return (
    <div className={`p-4 rounded-lg ${color} space-y-1`}>
      <p className="font-medium text-sm">{label}</p>
      <p className="text-2xl font-bold">{grams}g</p>
      <p className="text-sm text-muted-foreground">{calories} kcal</p>
    </div>
  );
}

interface TDEEResultsProps {
  result: TDEEResult;
  goal: GoalType;
}

export function TDEEResults({ result, goal }: TDEEResultsProps) {
  const { bmr, tdee, targetCalories, macros } = result;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Basal Metabolic Rate
          </p>
          <p className="text-3xl font-bold">{bmr}</p>
          <p className="text-sm text-muted-foreground">calories/day</p>
        </Card>

        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Total Daily Energy Expenditure
          </p>
          <p className="text-3xl font-bold">{tdee}</p>
          <p className="text-sm text-muted-foreground">calories/day</p>
        </Card>

        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {goal === "maintenance"
              ? "Maintenance Calories"
              : goal === "weightLoss"
              ? "Weight Loss Target"
              : "Muscle Gain Target"}
          </p>
          <p className="text-3xl font-bold">{targetCalories}</p>
          <p className="text-sm text-muted-foreground">calories/day</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Recommended Macronutrients
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MacroCard
            label="Protein"
            grams={macros.protein}
            calories={macros.protein * 4}
            color="bg-blue-100 dark:bg-blue-900/20"
          />
          <MacroCard
            label="Carbohydrates"
            grams={macros.carbs}
            calories={macros.carbs * 4}
            color="bg-green-100 dark:bg-green-900/20"
          />
          <MacroCard
            label="Fats"
            grams={macros.fats}
            calories={macros.fats * 9}
            color="bg-yellow-100 dark:bg-yellow-900/20"
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">What These Numbers Mean</h3>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">
              BMR (Basal Metabolic Rate):
            </span>{" "}
            The number of calories your body burns at rest to maintain basic
            life functions.
          </p>
          <p>
            <span className="font-medium text-foreground">
              TDEE (Total Daily Energy Expenditure):
            </span>{" "}
            The total number of calories you burn per day, including activity.
          </p>
          <p>
            <span className="font-medium text-foreground">
              Target Calories:
            </span>{" "}
            {goal === "maintenance"
              ? "Your recommended daily calorie intake to maintain your current weight."
              : goal === "weightLoss"
              ? "A 20% calorie deficit to promote sustainable weight loss."
              : "A 10% calorie surplus to support muscle growth."}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
