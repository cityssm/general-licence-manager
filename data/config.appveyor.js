export const config = {
    application: {
        useTestDatabases: true
    },
    defaults: {
        licenseeCity: "Sault Ste. Marie",
        licenseeProvince: "ON",
        licenceNumberFunction: "year-fourDigits"
    },
    users: {
        testing: ["*testView", "*testUpdate", "*testAdmin"],
        canLogin: ["*testView", "*testUpdate", "*testAdmin"],
        canUpdate: ["*testUpdate"],
        isAdmin: ["*testAdmin"]
    }
};
