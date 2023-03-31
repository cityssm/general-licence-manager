const endOfMonthNextYear = (startDate, javascriptMonthNumber) => {
    const endDate = new Date();
    endDate.setDate(1);
    endDate.setFullYear(startDate.getFullYear() + 1);
    endDate.setMonth(javascriptMonthNumber + 1);
    endDate.setDate(0);
    return endDate;
};
export const endOfMarchNextYear = (startDate) => {
    return endOfMonthNextYear(startDate, 3 - 1);
};
