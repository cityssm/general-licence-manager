import type { LicenceLengthFunction } from '../types/configTypes.js'

const endOfMonthNextYear = (
  startDate: Date,
  javascriptMonthNumber: number
): Date => {
  const endDate = new Date()
  endDate.setDate(1)
  endDate.setFullYear(startDate.getFullYear() + 1)
  endDate.setMonth(javascriptMonthNumber + 1)
  endDate.setDate(0)

  return endDate
}

export const endOfMarchNextYear: LicenceLengthFunction = (startDate) => {
  return endOfMonthNextYear(startDate, 3 - 1)
}
