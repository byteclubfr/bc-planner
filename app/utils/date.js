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

export function inclusiveIsBetween (date, start, end, granularity = 'day') {
  return date.isSame(start, granularity) || date.isSame(end, granularity) || date.isBetween(start, end, granularity)
}

export function isWeekend (date){
  return date.isoWeekday() >= 6
}
