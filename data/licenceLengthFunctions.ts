import type { LicenceLengthFunction } from "../types/configTypes";


const endOfMonthNextYear = (startDate: Date, javascriptMonthNumber: number): Date => {

  const endDate = new Date();
  endDate.setFullYear(startDate.getFullYear() + 1);
  endDate.setMonth(javascriptMonthNumber + 1);
  endDate.setDate(0);

  return endDate;
};


export const endOfMarchNextYear: LicenceLengthFunction =
  (startDate) => {
    return endOfMonthNextYear(startDate, 3 - 1);
  };
