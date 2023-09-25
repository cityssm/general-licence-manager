export const config = {
    application: {
        useTestDatabases: true
    },
    defaults: {
        licenseeCity: 'Sault Ste. Marie',
        licenseeProvince: 'ON',
        licenceNumberFunction: 'year-fourDigits'
    },
    users: {
        testing: ['*testView', '*testUpdate', '*testAdmin'],
        canLogin: ['*testView', '*testUpdate', '*testAdmin'],
        canUpdate: ['*testUpdate'],
        isAdmin: ['*testAdmin']
    },
    settings: {
        includeBatches: true,
        includeYearEnd: true
    },
    exports: {
        batches: {
            exportType: 'rbcPreauthorized',
            isTesting: true,
            header: {
                clientName: 'TESTING',
                clientNumber: '0000',
                fileCreationNumberOffset: 0,
                currencyType: 'CAD'
            },
            record: {
                clientShortName: 'TEST',
                destinationCountry: 'CAN',
                languageCode: 'E',
                transactionCode: '430'
            }
        }
    }
};
