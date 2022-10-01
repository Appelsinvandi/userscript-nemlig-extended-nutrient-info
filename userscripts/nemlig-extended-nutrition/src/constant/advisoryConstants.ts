export enum AdvisoryLevel {
  VERY_BAD = 'VERY_BAD',
  BAD = 'BAD',
  NEUTRAL = 'NEUTRAL',
  GOOD = 'GOOD',
  VERY_GOOD = 'VERY_GOOD',
}

export const AdvisoryLevelIcon = Object.freeze<{
  [key in AdvisoryLevel]: string
}>({
  [AdvisoryLevel.VERY_BAD]: '😱',
  [AdvisoryLevel.BAD]: '😰',
  [AdvisoryLevel.NEUTRAL]: '🙂',
  [AdvisoryLevel.GOOD]: '😋',
  [AdvisoryLevel.VERY_GOOD]: '😍',
})
