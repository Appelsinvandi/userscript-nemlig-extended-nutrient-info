const renderSeparatorStyles = ['margin: 16px auto 20px', 'border: none', 'border-top: 1px solid lightgrey', 'width: 80%'].join('; ')
export function renderSeparator() {
  return `<hr style="${renderSeparatorStyles};" />`
}
