import { expect } from 'chai'
import * as date from '../../app/utils/date'

describe('utils/date', () => {
  it('should serialize dates', () => {
    expect(date.serialize('2011-11-11')).to.equal('2011-11-11')
    expect(date.serialize('2016-02-29')).to.equal('2016-02-29')
  })
})
