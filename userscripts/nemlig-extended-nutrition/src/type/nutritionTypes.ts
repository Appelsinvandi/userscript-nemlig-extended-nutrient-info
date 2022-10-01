export interface NutritionDeclaration {
  energy?: {
    kcal?: number
    kj?: number
  }
  fat?: {
    total?: number
    saturated?: number
  }
  carbohydrate?: {
    total?: number
    fiber?: number
    sugar?: number
  }
  protein?: number
  salt?: number
}
