import { AdvisoryLevel } from '../constant'

export interface NutritionAdvisory {
  level: AdvisoryLevel
  message: string
}

export type AdvisoryGeneratorFunction = (itemEnergy: number, itemNutrition: number) => NutritionAdvisory | null | undefined | void
