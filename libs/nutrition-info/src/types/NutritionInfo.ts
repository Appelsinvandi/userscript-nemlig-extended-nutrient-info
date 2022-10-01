export type NutritionInfo = {
  energy?: {
    /** **💁‍♀️ Unit: *kj*** */
    total: number
  }
  fat?: {
    /** **💁‍♀️ Unit: *g*** */
    total: number
    /** **💁‍♀️ Unit: *g*** */
    saturated?: number
  }
  carbohydrate?: {
    /** **💁‍♀️ Unit: *g*** */
    total: number
    /** **💁‍♀️ Unit: *g*** */
    fiber?: number
    /** **💁‍♀️ Unit: *g*** */
    sugar?: number
  }
  protein?: {
    /** **💁‍♀️ Unit: *g*** */
    total: number
  }
  salt?: {
    /** **💁‍♀️ Unit: *g*** */
    total: number
  }
}
