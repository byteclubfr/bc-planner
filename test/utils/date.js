import { expect } from 'chai'
import {
  serialize, addMonth, addDay, endOfMonth, startOfMonth,
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
      ['2016-10-31', 1,  '2016-11-01'],
      ['2016-11-30', 1,  '2016-12-01'],
      ['2016-12-31', 1,  '2017-01-01'],
      // Remove days
      ['2011-12-11', -30, '2011-11-11'],
      ['2012-12-21', -10, '2012-12-11'],
      ['2017-01-19', -20, '2016-12-30'],
      ['2016-11-01', -1,  '2016-10-31'],
      ['2016-12-01', -1,  '2016-11-30'],
      ['2017-01-01', -1,  '2016-12-31'],
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

  it('inclusiveIsBetween', () => {
    [
      ['2011-11-11', '2012-03-01', '2012-02-29', true ], // 02-29 → 03-01 → should still be true
      ['2011-12-11', '2011-12-11', '2011-12-11', true ],
      ['2011-12-11', '2011-12-11', '2012-12-01', false ],
      ['2015-02-11', '2015-02-12', '2015-02-11', true ],
      ['2015-02-11', '2015-02-12', '2015-02-12', true ],
      ['2015-02-11', '2015-02-12', '2015-02-13', false ],
      ['2015-02-11', '2015-02-10', '2015-02-10', false ], // start should be lesser then end
      ['2015-02-11', '2015-02-10', '2015-02-11', false ], // start should be lesser then end
      ['2016-02-11', '2017-02-29', '2017-02-28', true ],
      ['2016-02-11', '2017-02-29', '2017-02-29', true ],
      ['2016-02-11', '2017-02-29', '2017-02-30', false ]
    ].forEach(([start, end, date, expected]) => {
      const result = inclusiveIsBetween(date, start, end)
      expect(result, start + ' ≤ ' + date + ' ≤ ' + end).to.equal(expected)
    })
  })

  it('isWeekend', () => {
    [
      ['2011-11-11', false], // Fri
      ['2011-12-11', true],  // Sun
      ['2015-02-11', false], // Wed
      ['2016-02-11', false], // Thu
      ['2017-01-11', false], // Wed
      ['2011-11-30', false], // Wed
      ['2011-12-31', true],  // Sat
      ['2015-02-28', true],  // Sat
      ['2016-02-29', false], // Mon
      ['2017-01-31', false]  // Tue
    ].forEach(([date, expected]) => {
      const result = isWeekend(date)
      expect(result, new Date(date)).to.equal(expected)
    })
  })

  it('isToday', () => {
    const today = new Date()
    const tomorrow = addDay(today, 1)
    const yesterday = addDay(today, -1)
    expect(isToday(today)).to.be.true
    expect(isToday(tomorrow)).to.be.false
    expect(isToday(yesterday)).to.be.false
  })

  it('isAfter (first ≥ second, days only)', () => {
    [
      ['2011-12-31 05:00', '2011-12-31 06:00', true ], // ignore hour
      ['2011-12-31 06:00', '2011-12-31 05:00', true ], // ignore hour
      ['2011-12-31', '2011-12-30', true ],
      ['2011-12-31', '2011-01-01', true ],
      ['2011-12-31', '2012-01-01', false ],
      ['2011-02-28', '2011-02-29', false ],
      ['2011-02-28', '2011-01-29', true ],
      ['2011-02-28', '2011-02-27', true ]
    ].forEach(([ start, end, expected ]) => {
      const result = isAfter(start, end)
      expect(result, start + ' ≥ ' + end).to.equal(expected)
    })
  })

  it('isBefore (first ≤ second, days only)', () => {
    [
      ['2011-12-31 05:00', '2011-12-31 06:00', true ], // ignore hour
      ['2011-12-31 06:00', '2011-12-31 05:00', true ], // ignore hour
      ['2011-12-31', '2011-12-30', false ],
      ['2011-12-31', '2011-01-01', false ],
      ['2011-12-31', '2012-01-01', true ],
      ['2011-02-28', '2011-02-29', true ],
      ['2011-02-28', '2011-01-29', false ],
      ['2011-02-28', '2011-02-27', false ]
    ].forEach(([ start, end, expected ]) => {
      const result = isBefore(start, end)
      expect(result, start + ' ≤ ' + end).to.equal(expected)
    })
  })

  it('isSameDay (same year, month, and day)', () => {
    [
      ['2011-12-31 05:00', '2011-12-31 06:00', true ], // ignore hour
      ['2011-12-31 06:00', '2011-12-31 05:00', true ], // ignore hour
      ['2011-01-02', '2011-02-02', false], // not same month
      ['2011-01-02', '2012-01-02', false], // not same year
      ['2011-01-02', '2011-01-02', true],
      ['2011-02-29', '2011-03-01', true] // converting 02-29 to 03-01
    ].forEach(([date1, date2, expected]) => {
      const result = isSameDay(date1, date2)
      expect(result, date1 + ' ~ ' + date2).to.equal(expected)
    })
  })

  it('isSameMonth (same year and month)', () => {
    [
      ['2011-12-31 05:00', '2011-12-31 06:00', true ], // ignore hour
      ['2011-12-12 06:00', '2011-12-31 05:00', true ], // ignore hour and day
      ['2011-01-02', '2011-02-02', false], // not same month
      ['2011-01-02', '2012-01-02', false], // not same year
      ['2011-01-02', '2011-01-02', true],
      ['2011-01-02', '2011-01-03', true], // ignore day
      ['2011-02-29', '2011-03-01', true] // converting 02-29 to 03-01
    ].forEach(([date1, date2, expected]) => {
      const result = isSameMonth(date1, date2)
      expect(result, date1 + ' ~ ' + date2).to.equal(expected)
    })
  })

  it('formatDay (uses moment)', () => {
    expect(formatDay('2016-07-01')).to.equal('ven. 1 juil.')
  })

  it('formatAgo (uses moment)', () => {
    const today = new Date()
    const twoDaysAgo = addDay(today, -2)
    expect(formatAgo(twoDaysAgo)).to.equal('il y a 2 jours')
  })

  it('formatMonthMonth (uses moment)', () => {
    expect(formatMonth('2016-07-01')).to.equal('juillet 2016')
  })

  it('formatMonthDay (uses moment)', () => {
    expect(formatMonthDay('2016-07-01')).to.equal('V 01')
  })

})
