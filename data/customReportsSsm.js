export const customReports_general = [
    {
        reportName: "ssm-taxiLicences",
        reportTitle: "Taxi, Limo, Shuttle, and Rideshare Licences for Police Services",
        reportDescription: "Includes licence categories and number, licensee names, and expiration dates.",
        sql: "select l.licenceNumber, lc.licenceCategory," +
            " l.licenseeName, l.licenseeBusinessName, userFn_dateIntegerToString(l.endDate) as endDateString," +
            " max(case when lcf.licenceField = 'Insurance Expiration' then lf.licenceFieldValue else '' end) as insuranceExpiration" +
            " from Licences l" +
            " left join LicenceCategories lc on l.licenceCategoryKey = lc.licenceCategoryKey" +
            " left join LicenceFields lf on l.licenceId = lf.licenceId" +
            " left join LicenceCategoryFields lcf on lf.licenceFieldKey = lcf.licenceFieldKey" +
            " where l.recordDelete_timeMillis is null" +
            " and l.issueDate is not null" +
            " and l.licenceCategoryKey in ('01', '02', '04', '05', '06', '37')" +
            " group by l.licenceNumber, lc.licenceCategory, l.licenseeName, l.licenseeBusinessName, l.endDate"
    }
];
