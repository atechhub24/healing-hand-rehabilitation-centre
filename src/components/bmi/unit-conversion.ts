// Height conversion functions
export const convertHeight = {
  cmToFeet: (cm: number) => cm / 30.48,
  feetToCm: (feet: number) => feet * 30.48,
  cmToMeters: (cm: number) => cm / 100,
  metersToCm: (meters: number) => meters * 100,
};

// Weight conversion functions
export const convertWeight = {
  kgToPounds: (kg: number) => kg * 2.20462,
  poundsToKg: (pounds: number) => pounds / 2.20462,
  kgToStones: (kg: number) => kg * 0.157473,
  stonesToKg: (stones: number) => stones / 0.157473,
};

export type HeightUnit = "cm" | "ft" | "m";
export type WeightUnit = "kg" | "lbs" | "st";

export const heightUnitLabels: Record<HeightUnit, string> = {
  cm: "Centimeters",
  ft: "Feet",
  m: "Meters",
};

export const weightUnitLabels: Record<WeightUnit, string> = {
  kg: "Kilograms",
  lbs: "Pounds",
  st: "Stones",
};

// Convert any height to cm (our base unit)
export const convertToCm = (value: number, fromUnit: HeightUnit): number => {
  switch (fromUnit) {
    case "ft":
      return convertHeight.feetToCm(value);
    case "m":
      return convertHeight.metersToCm(value);
    default:
      return value;
  }
};

// Convert any weight to kg (our base unit)
export const convertToKg = (value: number, fromUnit: WeightUnit): number => {
  switch (fromUnit) {
    case "lbs":
      return convertWeight.poundsToKg(value);
    case "st":
      return convertWeight.stonesToKg(value);
    default:
      return value;
  }
};

// Format the display value based on the unit
export const formatHeightDisplay = (
  value: number,
  unit: HeightUnit
): string => {
  switch (unit) {
    case "ft":
      const feet = Math.floor(convertHeight.cmToFeet(value));
      const inches = Math.round((convertHeight.cmToFeet(value) - feet) * 12);
      return `${feet}'${inches}"`;
    case "m":
      return `${convertHeight.cmToMeters(value).toFixed(2)}`;
    default:
      return `${Math.round(value)}`;
  }
};

export const formatWeightDisplay = (
  value: number,
  unit: WeightUnit
): string => {
  switch (unit) {
    case "lbs":
      return `${Math.round(convertWeight.kgToPounds(value))}`;
    case "st":
      const stones = Math.floor(convertWeight.kgToStones(value));
      const pounds = Math.round(
        (convertWeight.kgToStones(value) - stones) * 14
      );
      return `${stones}st ${pounds}lbs`;
    default:
      return `${Math.round(value)}`;
  }
};
