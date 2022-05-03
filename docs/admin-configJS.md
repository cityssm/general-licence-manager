[Home](https://cityssm.github.io/general-licence-manager/)
•
[Help](https://cityssm.github.io/general-licence-manager/docs/)

# Admin - config.js

The `data/config.js` file is used to customize your application.
On first install, the file does not exist.  You can create one from scratch,
or get started by using the
[`data/config.example.js`](https://github.com/cityssm/general-licence-manager/blob/main/data/config.example.js)
file as a template.

If you wish to use TypeScript to validate your config.js file,
see [`types/configTypes.d.ts`](https://github.com/cityssm/general-licence-manager/blob/main/types/configTypes.d.ts).

```javascript
export const config = {};

// your configuration

export default config;
```

* * *

## config.application = {};

| Property Name      | Type    | Description                                                 | Default Value              |
| ------------------ | ------- | ----------------------------------------------------------- | -------------------------- |
| `applicationName`  | string  | Make the application your own by changing the name.         | `"General Licence System"` |
| `logoURL`          | string  | The path to a custom logo.  Square-shaped images work best. | `"/images/stamp.png"`      |
| `httpPort`         | number  | The listening port for HTTP.                                | `7000`                     |
| `userDomain`       | string  | The Active Directory domain for application users.          | `null`                     |
| `useTestDatabases` | boolean | Whether or not the application should use a test database.  | `false`                    |

* * *

## config.session = {};

| Property Name  | Type    | Description                                                                        | Default Value                        |
| -------------- | ------- | ---------------------------------------------------------------------------------- | ------------------------------------ |
| `cookieName`   | string  | The name of the session cookie.                                                    | `"general-licence-manager-user-sid"` |
| `secret`       | string  | The secret used to sign the session cookie.                                        | `"cityssm/general-licence-manager"`  |
| `maxAgeMillis` | number  | The session timeout in milliseconds.                                               | `3600000`                            |
| `doKeepAlive`  | boolean | When `true`, the browser will ping the web application to keep the session active. | `false`                              |

* * *

## config.activeDirectory = {};

See the configuration for [activedirectory2 on npm](https://www.npmjs.com/package/activedirectory2).

| Property Name | Type   | Sample Value             |
| ------------- | ------ | ------------------------ |
| `url`         | string | `"ldap://dc.domain.com"` |
| `baseDN`      | string | `"dc=domain,dc=com"`     |
| `userName`    | string | `username@domain.com`    |
| `password`    | string | `p@ssword`               |

* * *

## config.users = {};

| Property Name | Type      | Description                                                            |
| ------------- | --------- | ---------------------------------------------------------------------- |
| `testing`     | string\[] | Test users able to log in when application.useTestDatabases is true.   |
| `canLogin`    | string\[] | All users (without their domain), that have access to the application. |
| `canUpdate`   | string\[] | All users (without their domain), that have update access.             |
| `isAdmin`     | string\[] | All users (without their domain), that can access administrator areas. |

* * *

## config.defaults = {};

| Property Name           | Type   | Description                                     | Default Value       |
| ----------------------- | ------ | ----------------------------------------------- | ------------------- |
| `licenceNumberFunction` | string | The format for new licence numbers.             | `"year-fourDigits"` |
| `licenseeCity`          | string | The default licensee city for new licences.     | `""`                |
| `licenseeProvince`      | string | The default licensee province for new licences. | `"ON"`              |

* * *

## config.settings = {};

| Property Name         | Type    | Description                                           | Default Value |
| --------------------- | ------- | ----------------------------------------------------- | ------------- |
| `licenceAlias`        | string  | The singular, proper case word to use for "licence".  | `"Licence"`   |
| `licenceAliasPlural`  | string  | The plural, proper case word to use for "licences".   | `"Licences"`  |
| `licenseeAlias`       | string  | The singular, proper case word to use for "licensee". | `"Licensee"`  |
| `licenseeAliasPlural` | string  | The plural, proper case word to use for "licensees".  | `"Licensees"` |
| `renewalAlias`        | string  | The singular, proper case word to use for "renewal".  | `"Renewal"`   |
| `includeBatches`      | boolean | Whether batch transaction features should be enabled. | `false`       |
