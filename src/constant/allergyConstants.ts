import { AllergyInfo } from '../type'

export enum Allergy {
  EGG = 'EGG',
  FISH = 'FISH',
  LACTOSE = 'LACTOSE',
  PEANUT = 'PEANUT',
  SESAME = 'SESAME',
  SHELLFISH = 'SHELLFISH',
  SOY = 'SOY',
  TREE_NUT = 'TREE_NUT',
  WHEAT = 'WHEAT',
}

export const Allergies = Object.freeze<{ [key in Allergy]: AllergyInfo }>({
  [Allergy.EGG]: {
    name: 'Egg',
    icon: '🥚',
    match: matchHof([/\bæg\b/, /\bægge/]),
  },
  [Allergy.FISH]: {
    name: 'Fish',
    icon: '🐟',
    match: matchHof(['fisk', 'laks', 'tun', 'torsk', 'rødspætte', 'skrubbe', 'kulmule', /(guld|hav|mørk)(bars|taske|sej|kat)/]),
  },
  [Allergy.LACTOSE]: {
    name: 'Milk',
    icon: '🍼',
    match: matchHof([/(?<!laktosefri *)mælk(?!esyre)/, /laktose(?! *fri)/, /(?<!laktosefri *)fløde/, /(?<!laktosefri *)smør/]),
  },
  [Allergy.PEANUT]: {
    name: 'Peanut',
    icon: '🥜',
    match: matchHof(['jordnød', 'peanut']),
  },
  [Allergy.SESAME]: {
    name: 'Sesame',
    icon: '🌱',
    match: matchHof(['sesam']),
  },
  [Allergy.SHELLFISH]: {
    name: 'Shellfish',
    icon: '🦐',
    match: matchHof(['skaldyr', 'rejer', 'krebs', 'hummer', 'krabbe', 'musling', /østers(?!ø)/]),
  },
  [Allergy.SOY]: {
    name: 'Soy',
    icon: '🌳',
    match: matchHof(['soja']),
  },
  [Allergy.TREE_NUT]: {
    name: 'Tree nut',
    icon: '🌰',
    match: matchHof(['valnød', 'mandle', 'hassel', 'cashew', 'pistacie']),
  },
  [Allergy.WHEAT]: {
    name: 'Wheat',
    icon: '🌾',
    match: matchHof(['hvede']),
  },
})

function matchHof(searches: (string | RegExp)[]): AllergyInfo['match'] {
  return (ingredients) => {
    const testString = Array.isArray(ingredients) ? ingredients.join(' ') : ingredients
    return searches.some((e) => new RegExp(e, 'gi').test(testString))
  }
}
