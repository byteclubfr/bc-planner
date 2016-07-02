import moment from 'moment'
import memoize from 'memoize-immutable'

moment.locale('fr')

// Date => string
export function serialize (date) {
  const d = parse(date)
  const Y = d.getFullYear()
  const M = d.getMonth() + 1
  const D = d.getDate()

  return '' + Y + '-' + (M < 10 ? '0' : '') + M + '-' + (D < 10 ? '0' : '') + D
}

// any => Date
function parse (any) {
  if (any instanceof Date) {
    return any
  } else {
    return new Date(any)
  }
}

// any => Date
function clone (any) {
  return new Date(any)
}

// reminder: month is 1 based
// july daysInMonth(7, 2009) → 31
function daysInMonth (month, year) {
  return new Date(year, month, 0).getDate()
}

// (Date, Date) => Array<string>
export const buildMonthsRange = memoize((start, end) => {
  let range = []
  let curr = startOfMonth(start)
  end = endOfMonth(end)

  if (isSameMonth(curr, end)) {
    return [ serialize(curr) ]
  }

  if (end < curr) {
    return []
  }

  do {
    range.push(serialize(curr))
    curr = addMonth(curr, 1)
  } while (!isSameMonth(curr, end))

  return range
})

// Date => Array<string>
export const buildMonthDaysRange = memoize(date => {
  let range = []
  let curr = startOfMonth(date)
  let end = endOfMonth(date)

  while (isBefore(curr, end)) {
    range.push(serialize(curr))
    curr = addDay(curr, 1)
  }

  return range
})

// (Date, number) => Date
export function addMonth (date, nbMonths) {
  const d = clone(date)
  const origDay = d.getDate() // remember to set back later
  d.setDate(15) // neutral date
  d.setMonth(d.getMonth() + nbMonths)

  const days = daysInMonth(d.getMonth() + 1, d.getFullYear())
  d.setDate(days < origDay ? days : origDay) // cap?
  return d
}

// (Date, number) => Date
export function addDay (date, nbDays) {
  const d = clone(date)
  d.setDate(d.getDate() + nbDays)
  return d
}

// (Date, Date, Date) => boolean
export function inclusiveIsBetween (date, start, end) {
  return isBefore(start, date) && isAfter(end, date)
}

// Date => boolean
export function isWeekend (date){
  const dayOfWeek = parse(date).getDay()
  return dayOfWeek === 6 /* Sat */ || dayOfWeek === 0 /* Sun */
}

// Date => boolean
export function isToday (date) {
  return isSameDay(date, new Date())
}

// Date => Date
export function startOfMonth (date) {
  const d = clone(date)
  d.setDate(1)
  return d
}

// Date => Date
export function endOfMonth (date) {
  const d = addMonth(date, 1)
  d.setDate(0)
  return d
}

// (Date, Date) => boolean (true if date1 >= date2, by day)
export function isAfter (date1, date2) {
  return isBefore(date2, date1)
}

// (Date, Date) => boolean (true if date1 <= date2, by day)
export function isBefore (date1, date2) {
  const d1 = parse(date1)
  const d2 = parse(date2)
  return d1.getYear() < d2.getYear()
      || ( d1.getYear() === d2.getYear()
        && d1.getMonth() < d2.getMonth())
      || ( d1.getYear() === d2.getYear()
        && d1.getMonth() === d2.getMonth()
        && d1.getDate() <= d2.getDate())
}

// (Date, Date) => boolean
export function isSameDay (date1, date2) {
  const d1 = parse(date1)
  const d2 = parse(date2)
  return d1.getYear() === d2.getYear()
      && d1.getMonth() === d2.getMonth()
      && d1.getDate() === d2.getDate()
}

// (Date, Date) => boolean
export function isSameMonth (date1, date2) {
  const d1 = parse(date1)
  const d2 = parse(date2)
  return d1.getYear() === d2.getYear()
      && d1.getMonth() === d2.getMonth()
}

// Date => string (e.g. "ven. 1 juil.")
export function formatDay (date) {
  return moment(parse(date)).format('ddd D MMM')
}

// Date => string (e.g. "il y a 2 jours")
export function formatAgo (date) {
  return moment(parse(date)).fromNow()
}

// Date => string (e.g. "Juillet 2016")
export function formatMonth (date) {
  return moment(parse(date)).format('MMMM YYYY')
}

// Date => string (e.g. "V 01")
export function formatMonthDay (date) {
  const m = moment(date)
  return m.format('dd')[0] + ' ' + m.format('DD')
}

export function formatWeek (date) {
  return 'W ' + moment(parse(date)).format('W')
}
