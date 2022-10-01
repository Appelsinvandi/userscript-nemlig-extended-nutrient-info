export enum Macronutrient {
  CARBOHYDRATE = 'CARBOHYDRATE',
  FAT = 'FAT',
  PROTEIN = 'PROTEIN',
}

export const MacronutrientEnergyDensity = Object.freeze<{
  [key in Macronutrient]: number
}>({
  [Macronutrient.FAT]: 9,
  [Macronutrient.CARBOHYDRATE]: 4,
  [Macronutrient.PROTEIN]: 4,
})
