import { AdvisoryLevel } from '../constant'
import {
  AdvisoryGeneratorFunction,
  NutritionAdvisory,
  NutritionDeclaration,
} from '../type'

export const DailyIntakeEnergy = 2500

export const genAdvisorySaturatedFat: AdvisoryGeneratorFunction = (
  itemEnergy,
  itemSaturatedFat
) => {
  const energyPart = itemEnergy / DailyIntakeEnergy
  const threshold = (pct: number) => (DailyIntakeEnergy / 9) * pct

  if (itemSaturatedFat > energyPart * threshold(0.15)) {
    return {
      level: AdvisoryLevel.VERY_BAD,
      title: 'Saturated fat',
      levelText: 'Very high',
    }
  } else if (itemSaturatedFat > energyPart * threshold(0.1)) {
    return {
      level: AdvisoryLevel.BAD,
      title: 'Saturated fat',
      levelText: 'High',
    }
  }
}

export const genAdvisorySugar: AdvisoryGeneratorFunction = (
  itemEnergy,
  itemSugar
) => {
  const energyPart = itemEnergy / DailyIntakeEnergy
  const threshold = (pct: number) => (DailyIntakeEnergy / 4) * pct

  if (itemSugar > energyPart * threshold(0.15)) {
    return {
      level: AdvisoryLevel.VERY_BAD,
      title: 'Sugar',
      levelText: 'Very high',
    }
  } else if (itemSugar > energyPart * threshold(0.1)) {
    return { level: AdvisoryLevel.BAD, title: 'Sugar', levelText: 'High' }
  }
}

export const genAdvisoryFiber: AdvisoryGeneratorFunction = (
  itemEnergy,
  itemFiber
) => {
  const energyPart = itemEnergy / DailyIntakeEnergy
  const threshold = (pct: number) => (DailyIntakeEnergy / 250) * 3 * pct

  console.log(energyPart * threshold(1))

  if (itemFiber > energyPart * threshold(1.25)) {
    return {
      level: AdvisoryLevel.VERY_GOOD,
      title: 'Fiber',
      levelText: 'Very high',
    }
  } else if (itemFiber > energyPart * threshold(1)) {
    return { level: AdvisoryLevel.GOOD, title: 'Fiber', levelText: 'High' }
  }
}

export const genAdvisorySalt: AdvisoryGeneratorFunction = (
  itemEnergy,
  itemSalt
) => {
  const energyPart = itemEnergy / DailyIntakeEnergy
  const threshold = (grams: number) => energyPart * grams

  if (itemSalt > threshold(8)) {
    return {
      level: AdvisoryLevel.VERY_BAD,
      title: 'Salt',
      levelText: 'Very high',
    }
  } else if (itemSalt > threshold(6)) {
    return { level: AdvisoryLevel.BAD, title: 'Salt', levelText: 'High' }
  }
}

export const genAdvisories = (nutritionDeclaration: NutritionDeclaration) => {
  const energy = nutritionDeclaration.energy?.kcal
  if (energy == null) return []

  return [
    nutritionDeclaration.fat?.saturated != null
      ? genAdvisorySaturatedFat(energy, nutritionDeclaration.fat.saturated)
      : null,
    nutritionDeclaration.carbohydrate?.sugar != null
      ? genAdvisorySugar(energy, nutritionDeclaration.carbohydrate.sugar)
      : null,
    nutritionDeclaration.carbohydrate?.fiber != null
      ? genAdvisoryFiber(energy, nutritionDeclaration.carbohydrate.fiber)
      : null,
    nutritionDeclaration.salt != null
      ? genAdvisorySalt(energy, nutritionDeclaration.salt)
      : null,
  ].filter((e) => e != null) as NutritionAdvisory[]
}
