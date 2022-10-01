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
      genMatch([['æg'], ['ge']], {
        preFixes: [['skrabe', 'friland', 'hel'], ['s']],
        postFixes: [
          ['hvide', 'blomme', 'pulver'],
          ['r', 'er'],
        ],
      }),
    ]),
  },
  [Allergy.FISH]: {
    name: 'Fish',
    icon: '🐟',
    match: matchHof([
      'fisk',
      'laks',
      'tun',
      'torsk',
      'rødspætte',
      'skrubbe',
      'kulmule',
      new RegExp(`(guld|hav|mørk)(bars|taske|sej|kat)`),
    ]),
  },
  [Allergy.GLUTEN]: {
    name: 'Gluten',
    icon: '🍞',
    match: matchHof([
      genMatch([['hvede', 'graham', 'rug', 'byg', 'malt'], ['s']], {
        preFixes: [['fuldkorn', 'øland', 'durum'], ['s']],
        postFixes: [
          [
            'fuldkorn',
            'brød',
            'sigte',
            'mel',
            'malt',
            'kerner',
            'flager',
            'ekstrakt',
          ],
          ['s'],
        ],
        negativeMatchBefore: 'gluten.?fri *',
      }),
    ]),
  },
  [Allergy.LACTOSE]: {
    name: 'Milk',
    icon: '🍼',
    match: matchHof([
      // = Lactose
      new RegExp(`laktose(?!.?fri)`),
      // = Milk
      genMatch(
        [
          ['mælk', 'valle'],
          ['s', 'e'],
        ],
        {
          preFixes: [
            [
              'pasteuriseret',
              'skummet',
              'mini',
              'let',
              'sød',
              'tyk',
              'kærne',
              'ko',
              'bøffel',
              'gede',
              'fåre',
            ],
          ],
          postFixes: [
            [
              'permeat',
              'pulver',
              'protein',
              'syre',
              'fedtstof',
              'kultur',
              'koncentrat',
            ],
            ['r', 'er', '.er'],
          ],
          negativeMatchBefore: 'laktose.?fri *',
        }
      ),
      // = Cream
      genMatch([['fløde']], {
        preFixes: [['piske']],
        negativeMatchBefore: 'laktose.?fri *',
      }),
      // = Butter
      genMatch([['smør']], {
        negativeMatchBefore: 'laktose.?fri *',
      }),
      // = Chesse
      genMatch(
        [
          [
            'mozzarella',
            'parmesan',
            'emmentaler',
            'cheddar',
            'gouda',
            'havarti',
            'ricotta',
          ],
        ],
        {
          preFixes: [['bøffel']],
          negativeMatchBefore: 'laktose.?fri *',
        }
      ),
      genMatch([['ost'], ['e']], {
        preFixes: [['fløde', 'gede', 'fåre', 'ko', 'blå', 'skimmel']],
        postFixes: [['løbe']],
        negativeMatchBefore: 'laktose.?fri *',
      }),
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
    match: matchHof([
      'skaldyr',
      'rejer',
      'krebs',
      'hummer',
      'krabbe',
      'musling',
      new RegExp(`østers${nonCharPost}`),
    ]),
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
      genMatch([['hvede', 'graham'], ['s']], {
        preFixes: [['fuldkorn', 'øland', 'durum'], ['s']],
        postFixes: [
          [
            'fuldkorn',
            'brød',
            'sigte',
            'mel',
            'malt',
            'kerner',
            'flager',
            'ekstrakt',
          ],
          ['s'],
        ],
        negativeMatchBefore: 'gluten.?fri *',
      }),
    ]),
  },
})

function matchHof(searches: (string | RegExp)[]): AllergyInfo['match'] {
  return (ingredients) => {
    const testString = Array.isArray(ingredients)
      ? ingredients.join(' ')
      : ingredients
    return searches.some((e) => new RegExp(e, 'gi').test(testString))
  }
}

type MatchPart = [matches: string[], plurals?: string[]]
interface GenMatchOpts {
  preFixes?: MatchPart
  postFixes?: MatchPart
  negativeMatchBefore?: string
  negativeMatchAfter?: string
}
function genMatch(
  main: MatchPart,
  {
    preFixes,
    postFixes,
    negativeMatchBefore,
    negativeMatchAfter,
  }: GenMatchOpts = {}
) {
  let res = ''

  if (negativeMatchBefore != null) res += `(?<!${negativeMatchBefore})`
  res += nonCharPre

  if (preFixes != null) {
    res += '('
    res += `(${preFixes[0].join('|')})`
    if (preFixes[1] != null) res += `(${preFixes[1].join('|')})?`
    res += ')*'
  }

  res += `(${main[0].join('|')})`
  if (main[1] != null) res += `(${main[1].join('|')})?`

  if (postFixes != null) {
    res += '('
    res += `(${postFixes[0].join('|')})`
    if (postFixes?.[1] != null) res += `(${postFixes[1].join('|')})?`
    res += ')*'
  }

  res += nonCharPost
  if (negativeMatchAfter != null) res += `(?!${negativeMatchAfter})`

  return new RegExp(res, 'gi')
}
