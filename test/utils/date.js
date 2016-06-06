import { expect } from 'chai'
import {
  // Tested
  serialize, addMonth, addDay, endOfMonth, startOfMonth,
  // Untested
  buildMonthsRange, buildMonthDaysRange,
  inclusiveIsBetween, isWeekend, isToday, isAfter, isBefore, isSameDay, isSameMonth,
  formatDay, formatAgo, formatMonth, formatMonthDay
} from '../../app/utils/date'

describe('utils/date', () => {
  it('serialize', () => {
    expect(serialize('2011-11-11')).to.equal('2011-11-11')
    expect(serialize('2016-02-29')).to.equal('2016-02-29')
  })

  it('addMonth', () => {
    const dates = [
      ['2011-11-11', '2011-12-11'],
      ['2011-12-11', '2012-01-11'],
      ['2016-10-31', '2016-11-30'],
      ['2016-11-30', '2016-12-30'],
      ['2016-12-31', '2017-01-31'],
      ['2016-01-31', '2016-02-29']
    ]
    dates.forEach(([date, expected]) => {
      const result = addMonth(new Date(date), 1)
      expect(serialize(result)).to.equal(serialize(new Date(expected)))
    })
  })

  it('addDay', () => {
    const dates = [
      ['2011-11-11', 30, '2011-12-11'],
      ['2012-12-11', 10, '2012-12-21'],
      ['2016-12-30', 20, '2017-01-19'],
      ['2016-10-31', 1, '2016-11-01'],
      ['2016-11-30', 1, '2016-12-01'],
      ['2016-12-31', 1, '2017-01-01'],
      // Bissextiles
      ['2016-02-29', 1, '2016-03-01'], // yep
      ['2012-02-29', 1, '2012-02-30'], // nope
      ['2008-02-29', 1, '2008-03-01'] // yep
    ]
    dates.forEach(([date, days, expected]) => {
      const result = addDay(new Date(date), days)
      expect(serialize(result)).to.equal(serialize(new Date(expected)))
    })
  })

  it('endOfMonth', () => {
    const dates = [
      ['2011-11-11', '2011-11-30'],
      ['2011-12-11', '2011-12-31'],
      ['2015-02-11', '2015-02-28'],
      ['2016-02-11', '2016-02-29'],
      ['2017-01-11', '2017-01-31'],
      ['2011-11-30', '2011-11-30'],
      ['2011-12-31', '2011-12-31'],
      ['2015-02-28', '2015-02-28'],
      ['2016-02-29', '2016-02-29'],
      ['2017-01-31', '2017-01-31']
    ]
    dates.forEach(([a, b]) => {
      const res = endOfMonth(new Date(a)).getTime()
      const expected = (new Date(b)).getTime()
      expect(res).to.equal(expected)
    })
  })

  it('startOfMonth', () => {
    const dates = [
      ['2011-11-11', '2011-11-01'],
      ['2011-12-11', '2011-12-01'],
      ['2015-02-11', '2015-02-01'],
      ['2016-02-11', '2016-02-01'],
      ['2017-01-11', '2017-01-01'],
      ['2011-11-30', '2011-11-01'],
      ['2011-12-31', '2011-12-01'],
      ['2015-02-28', '2015-02-01'],
      ['2016-02-29', '2016-02-01'],
      ['2017-01-31', '2017-01-01']
    ]
    dates.forEach(([date, expected]) => {
      const result = startOfMonth(new Date(date)).getTime()
      expect(serialize(result)).to.equal(serialize(new Date(expected)))
    })
  })
})
