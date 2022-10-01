export interface AllergyInfo {
  name: string
  icon: string
  match: (ingredients: string | string[]) => boolean
}
