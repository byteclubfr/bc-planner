import { expect } from 'chai'
import {
  // Tested
  serialize, addMonth, addDay, endOfMonth, startOfMonth,
  buildMonthsRange, buildMonthDaysRange,
  // Untested
  inclusiveIsBetween, isWeekend, isToday, isAfter, isBefore, isSameDay, isSameMonth,
  formatDay, formatAgo, formatMonth, formatMonthDay
} from '../../app/utils/date'

describe('utils/date', () => {
  it('serialize', () => {
    expect(serialize('2011-11-11')).to.equal('2011-11-11')
    expect(serialize('2016-02-29')).to.equal('2016-02-29')
  })

  it('addMonth', () => {
    [
      ['2011-11-11', '2011-12-11'],
      ['2011-12-11', '2012-01-11'],
      ['2016-10-31', '2016-11-30'],
      ['2016-11-30', '2016-12-30'],
      ['2016-12-31', '2017-01-31'],
      ['2016-01-31', '2016-02-29']
    ].forEach(([date, expected]) => {
      const result = addMonth(new Date(date), 1)
      expect(serialize(result)).to.equal(serialize(new Date(expected)))
    })
  })

  it('addDay', () => {
    [
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
    ].forEach(([date, days, expected]) => {
      const result = addDay(new Date(date), days)
      expect(serialize(result)).to.equal(serialize(new Date(expected)))
    })
  })

  it('endOfMonth', () => {
    [
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
    ].forEach(([a, b]) => {
      const res = endOfMonth(new Date(a)).getTime()
      const expected = (new Date(b)).getTime()
      expect(res).to.equal(expected)
    })
  })

  it('startOfMonth', () => {
    [
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
    ].forEach(([date, expected]) => {
      const result = startOfMonth(new Date(date)).getTime()
      expect(serialize(result)).to.equal(serialize(new Date(expected)))
    })
  })

  it('buildMonthsRange (start ≤ range < end, ignores days, returns serialized dates)', () => {
    [
      ['2011-11-11', '2012-03-01', [ '2011-11-01', '2011-12-01', '2012-01-01', '2012-02-01' ]],
      ['2011-12-11', '2011-12-11', [ '2011-12-01' ]],
      ['2015-02-11', '2015-02-12', [ '2015-02-01' ]],
      ['2015-02-11', '2015-02-10', [ '2015-02-01' ]], // days are ignored, only month counts
      ['2016-02-11', '2017-02-29', [ '2016-02-01', '2016-03-01', '2016-04-01', '2016-05-01', '2016-06-01', '2016-07-01', '2016-08-01', '2016-09-01', '2016-10-01', '2016-11-01', '2016-12-01', '2017-01-01', '2017-02-01' ]], // there's a trick, 2017-02-29 is expected to be considered as 2017-03-01
      ['2017-01-11', '2017-12-01', [ '2017-01-01', '2017-02-01', '2017-03-01', '2017-04-01', '2017-05-01', '2017-06-01', '2017-07-01', '2017-08-01', '2017-09-01', '2017-10-01', '2017-11-01' ]],
      ['2011-11-30', '2012-11-01', [ '2011-11-01', '2011-12-01', '2012-01-01', '2012-02-01', '2012-03-01', '2012-04-01', '2012-05-01', '2012-06-01', '2012-07-01', '2012-08-01', '2012-09-01', '2012-10-01' ]],
      ['2011-12-31', '2012-04-01', [ '2011-12-01', '2012-01-01', '2012-02-01', '2012-03-01' ]],
      ['2015-02-28', '2015-04-01', [ '2015-02-01', '2015-03-01' ]],
      ['2016-09-01', '2017-03-01', [ '2016-09-01', '2016-10-01', '2016-11-01', '2016-12-01', '2017-01-01', '2017-02-01' ]],
      ['2016-01-01', '2015-06-01', [ ]],
      ['2016-06-01', '2016-01-01', [ ]],
      ['2016-06-01', '2016-05-01', [ ]]
    ].forEach(([start, end, expected]) => {
      const result = buildMonthsRange(start, end)
      expect(result, start + ' → ' + end).to.eql(expected)
    })
  })

  it('buildMonthDaysRange (start ≤ range ≤ end, returns Date instances)', () => {
    [
      // Date, start, end, nb days
      ['2011-11-11', '2011-11-01', '2011-11-30', 30 ],
      ['2015-02-11', '2015-02-01', '2015-02-28', 28 ],
      ['2016-02-10', '2016-02-01', '2016-02-29', 29 ],
      ['1900-02-09', '1900-02-01', '1900-02-28', 28 ],
      ['2008-02-08', '2008-02-01', '2008-02-29', 29 ],
      ['2017-01-11', '2017-01-01', '2017-01-31', 31 ],
      ['2016-02-30', '2016-03-01', '2016-03-31', 31 ],
      ['2017-12-32', undefined,    undefined,    0 ]
    ].forEach(([date, start, end, count]) => {
      const result = buildMonthDaysRange(date)
      expect(result[0], 'first day of ' + date).to.equal(start)
      expect(result[result.length - 1], 'last day of ' + date).to.equal(end)
      expect(result, 'days of ' + date).to.have.length(count)
    })
  })
})
