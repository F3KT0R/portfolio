/** The tabletop modifier: 10–11 is +0 and every two points either way moves it by one. */
export function attributeModifier(score: number) {
  const value = Math.floor((score - 10) / 2)
  return value >= 0 ? `+${value}` : `${value}`
}
