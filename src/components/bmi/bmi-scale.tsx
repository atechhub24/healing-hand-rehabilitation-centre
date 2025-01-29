import { motion } from "framer-motion";

interface BMIScaleProps {
  currentBMI: number | null;
}

const categories = [
  { range: "< 18.5", label: "Underweight", color: "bg-blue-500" },
  { range: "18.5 - 24.9", label: "Normal", color: "bg-green-500" },
  { range: "25 - 29.9", label: "Overweight", color: "bg-yellow-500" },
  { range: "≥ 30", label: "Obese", color: "bg-red-500" },
];

export function BMIScale({ currentBMI }: BMIScaleProps) {
  const getIndicatorPosition = (bmi: number) => {
    // Calculate position percentage based on BMI value
    if (bmi < 18.5) return (bmi / 18.5) * 25;
    if (bmi < 25) return 25 + ((bmi - 18.5) / 6.5) * 25;
    if (bmi < 30) return 50 + ((bmi - 25) / 5) * 25;
    return Math.min(100, 75 + ((bmi - 30) / 10) * 25);
  };

  return (
    <div className="mt-8 p-4">
      <h3 className="text-lg font-semibold mb-4">BMI Categories</h3>
      <div className="relative">
        {/* BMI Scale Bar */}
        <div className="h-4 flex rounded-full overflow-hidden">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`${category.color} flex-1`}
              style={{
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* BMI Indicator */}
        {currentBMI && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 -mt-6"
            style={{
              left: `${getIndicatorPosition(currentBMI)}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary mx-auto" />
          </motion.div>
        )}

        {/* Category Labels */}
        <div className="flex justify-between mt-2">
          {categories.map((category, index) => (
            <div
              key={index}
              className="text-xs text-center flex-1"
              style={{ minWidth: 0 }}
            >
              <div className="font-medium truncate">{category.label}</div>
              <div className="text-muted-foreground">{category.range}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
