import { AllergyInfo } from '../type'

export enum Allergy {
  EGG = 'EGG',
  FISH = 'FISH',
  GLUTEN = 'GLUTEN',
  LACTOSE = 'LACTOSE',
  PEANUT = 'PEANUT',
  SESAME = 'SESAME',
  SHELLFISH = 'SHELLFISH',
  SOY = 'SOY',
  TREE_NUT = 'TREE_NUT',
  WHEAT = 'WHEAT',
}

const allCharsGroupRev = '[^\\w\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]'
const nonCharPre = `(${allCharsGroupRev}|^)`
const nonCharPost = `(${allCharsGroupRev}|$)`

export const Allergies = Object.freeze<{ [key in Allergy]: AllergyInfo }>({
  [Allergy.EGG]: {
    name: 'Egg',
    icon: '🥚',
    match: matchHof([
      new RegExp(
        nonCharPre +
          '(skrabe|frilands|hel)?' +
          // Main
          '(æg)' +
          '(ge)?' +
          '(hvide|blomme)?' +
          '(pulver)?' +
          '(r|er)?' +
          nonCharPost
      ),
    ]),
  },
  [Allergy.FISH]: {
    name: 'Fish',
    icon: '🐟',
    match: matchHof(['fisk', 'laks', 'tun', 'torsk', 'rødspætte', 'skrubbe', 'kulmule', new RegExp(`(guld|hav|mørk)(bars|taske|sej|kat)`)]),
  },
  [Allergy.GLUTEN]: {
    name: 'Gluten',
    icon: '🍞',
    match: matchHof([
      new RegExp(
        '(?<!gluten.?fri *)' +
          nonCharPre +
          '(fuldkorn)?(s)?' +
          '(øland|durum)(s)?' +
          // Main
          '(hvede|rug|byg|malt|graham)' +
          '(brød)?(s)?' +
          '(sigte)?' +
          '(mel|malt|kerner|flager|ekstrakt)?' +
          nonCharPost
      ),
      new RegExp(
        '(?<!gluten.?fri *[^ ]*)' +
          '(sur)?' +
          // Main
          '(dej)' +
          nonCharPost
      ),
    ]),
  },
  [Allergy.LACTOSE]: {
    name: 'Milk',
    icon: '🍼',
    match: matchHof([
      // = Lactose
      new RegExp(`laktose(?!.?fri)`),
      // = Milk
      // https://regex101.com/r/ULUQbg/1
      new RegExp(
        '(?<!laktose.?fri *)' +
          nonCharPre +
          '(pasteuriseret)?' +
          '(skummet|mini|let|sød|tyk|kærne)?' +
          '(ko|bøffel|gede|fåre)?' +
          // Main
          '(mælk|valle)(s|e)?' +
          '(permeat)?' +
          '(pulver|protein|syre|fedtstof)?(r|er|.er)?' +
          '(kultur|koncentrat)?' +
          nonCharPost
      ),
      // = Cream
      new RegExp(
        '(?<!laktose.?fri *)' +
          nonCharPre +
          '(piske)?' +
          // Main
          '(fløde)' +
          nonCharPost
      ),
      // = Butter
      new RegExp(
        '(?<!laktose.?fri *)' +
          nonCharPre +
          // Main
          '(smør)' +
          nonCharPost
      ),
      // = Chesse
      new RegExp(
        '(?<!laktose.?fri *)' +
          nonCharPre +
          // Main
          '(bøffel)?' +
          '(mozzarella|parmesan|emmentaler|cheddar|gouda|havarti|ricotta)'
      ),
      new RegExp(
        '(?<!laktose.?fri *)' +
          nonCharPre +
          '(fløde|gede|fåre|ko)?' +
          '(blåskimmel|skimmel)?' +
          // Main
          '(ost)(e)?' +
          '(løbe)?' +
          nonCharPost
      ),
    ]),
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
    match: matchHof(['skaldyr', 'rejer', 'krebs', 'hummer', 'krabbe', 'musling', new RegExp(`østers${nonCharPost}`)]),
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
    match: matchHof([
      new RegExp(
        nonCharPre +
          '(fuldkorn)?(s)?' +
          '(øland|durum)(s)?' +
          // Main
          '(hvede|graham)(s)?' +
          '(fuldkorn)?(s)?' +
          '(sigte)?' +
          '(mel|malt|kerner|flager|ekstrakt)?' +
          nonCharPost
      ),
    ]),
  },
})

function matchHof(searches: (string | RegExp)[]): AllergyInfo['match'] {
  return (ingredients) => {
    const testString = Array.isArray(ingredients) ? ingredients.join(' ') : ingredients
    return searches.some((e) => new RegExp(e, 'gi').test(testString))
  }
}
