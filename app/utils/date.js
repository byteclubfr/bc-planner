import moment from 'moment'
import { isArray } from 'lodash/fp'


// TODO memoize
export function buildMonthsRange (start, [endYear, endMonth]) {
  console.log('RANGE', start, [endYear, endMonth])
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

function parse (date) {
  if (date instanceof Date) {
    return date
  } else if (isArray(date)) {

  } else {
    return new Date(date)
  }
}

export function inclusiveIsBetween (date, start, end, granularity = 'day') {
  return date.isSame(start, granularity) || date.isSame(end, granularity) || date.isBetween(start, end, granularity)
}

export function isWeekend (date){
  return date.isoWeekday() >= 6
}

export function isToday (date) {
  return moment().isSame(date, 'day')
}

export function startOfMonth (date) {
  console.log('START OF MONTH', date)
}

export function endOfMonth (date) {
}

export function isAfter (before, date) {
}

export function isBefore (after, date) {
}

export function isSameDay (d1, d2) {

}
