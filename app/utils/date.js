export function buildMonthsRange (start, [endYear, endMonth]) {
  let [currYear, currMonth] = start
  let range = [[currYear, currMonth]]

  while (currYear < endYear || currMonth < endMonth) {
    currMonth++
    if (currMonth > 11) {
      currMonth = 0
      currYear++
    }
    range.push([currYear, currMonth])
  }

  return range
}
