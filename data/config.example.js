export const config = {
    application: {
        applicationName: "General Licence Manager",
        userDomain: "domain"
    },
    activeDirectory: {
        url: "ldap://dc.domain.com",
        baseDN: "dc=domain,dc=com",
        username: "username@domain.com",
        password: "p@ssword"
    },
    users: {
        canLogin: ["updateUser", "adminUser"],
        canUpdate: ["updateUser"],
        isAdmin: ["adminUser"]
    },
    defaults: {
        licenseeCity: "Sault Ste. Marie",
        licenseeProvince: "ON",
        licenceNumberFunction: "year-fourDigits"
    }
};
