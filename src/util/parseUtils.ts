import { NutritionDeclaration } from '../type'

export const parseIngredients = () => {
  const ingredientsElement = document.querySelector<HTMLDivElement>('product-detail-declaration div.product-detail__declaration-label')
  if (ingredientsElement == null) return null

  const ingredientsText = ingredientsElement.innerText
    .replace(/(\([^()]*)indeholde *spor([^(]*\))/gi, '')
    .replace(/(^[^\n\r]*)indeholde *spor([^\n\r]*$)/gim, '')

  return ingredientsText
}

export const parseNutrientDeclarations: () => NutritionDeclaration | null = () => {
  const nutritionDeclarationTableElement = document.querySelector('product-detail-declaration table.table')
  if (nutritionDeclarationTableElement == null) return null

  const rawDeclarationsArr = Array.from(nutritionDeclarationTableElement.querySelectorAll('tr.table__row'))
    .map((e) => Array.from(e.querySelectorAll<HTMLTableDataCellElement>('td.table__col')).map((e) => e.innerText.trim().toLowerCase()))
    .filter((e) => e.length === 2)
    .map(([k, v]) => [k.replace(/\s+/gi, '_'), v])
  const decs = Object.fromEntries(rawDeclarationsArr)

  let energyValues = (decs.energi as string)
    .split('/')
    .map((v: string) => processValue(v))
    .sort((a, b) => a - b)

  return {
    ...processResEntry('energy', {
      ...processResEntry('kcal', energyValues[0]),
      ...processResEntry('kj', energyValues[1]),
    }),
    ...processResEntry('fat', {
      ...processResEntry('total', decs.fedt),
      ...processResEntry('saturated', decs.heraf_mættede_fedtsyrer),
    }),
    ...processResEntry('carbohydrate', {
      ...processResEntry('total', decs.kulhydrat),
      ...processResEntry('fiber', decs.kostfibre),
      ...processResEntry('sugar', decs.heraf_sukkerarter),
    }),
    ...processResEntry('protein', decs.protein),
    ...processResEntry('salt', decs.salt),
  }

  function processResEntry(name: string, value?: null): null
  function processResEntry(name: string, value?: string | number): { [key: string]: number }
  function processResEntry<T extends object>(name: string, value?: T): T | null
  function processResEntry(name: string, value?: string | number | object | null) {
    if (typeof value === 'string' || typeof value === 'number' || value == null) {
      return value != null ? { [name]: processValue(value) } : null
    } else {
      return Object.keys(value).length > 0 ? { [name]: value } : null
    }
  }

  function processValue(v: null): undefined
  function processValue(v: string | number): number
  function processValue(v: string | number | null) {
    return v != null
      ? Number(
          String(v)
            .replace(/[^0-9,.]/gi, '')
            .replace(/,/gi, '.')
        )
      : undefined
  }
}
