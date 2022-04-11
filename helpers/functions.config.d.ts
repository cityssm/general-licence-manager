import type * as configTypes from "../types/configTypes";
export declare function getProperty(propertyName: "application.applicationName"): string;
export declare function getProperty(propertyName: "application.logoURL"): string;
export declare function getProperty(propertyName: "application.httpPort"): number;
export declare function getProperty(propertyName: "application.userDomain"): string;
export declare function getProperty(propertyName: "activeDirectory"): configTypes.ConfigActiveDirectory;
export declare function getProperty(propertyName: "users.testing"): string[];
export declare function getProperty(propertyName: "users.canLogin"): string[];
export declare function getProperty(propertyName: "users.canUpdate"): string[];
export declare function getProperty(propertyName: "users.isAdmin"): string[];
export declare function getProperty(propertyName: "defaults.licenseeCity"): string;
export declare function getProperty(propertyName: "defaults.licenseeProvince"): string;
export declare function getProperty(propertyName: "defaults.licenceNumberFunction"): configTypes.LicenceNumberFunction;
export declare function getProperty(propertyName: "settings.licenceAlias"): string;
export declare function getProperty(propertyName: "settings.licenceAliasPlural"): string;
export declare function getProperty(propertyName: "settings.licenseeAlias"): string;
export declare function getProperty(propertyName: "settings.licenseeAliasPlural"): string;
export declare function getProperty(propertyName: "settings.renewalAlias"): string;
export declare function getProperty(propertyName: "settings.includeBatches"): boolean;
export declare function getProperty(propertyName: "exports.batches"): configTypes.ConfigBatchExport;
export declare function getProperty(propertyName: "licenceLengthFunctions"): {
    [licenceLengthFunctionName: string]: configTypes.LicenceLengthFunction;
};
export declare function getProperty(propertyName: "reverseProxy.disableCompression"): boolean;
export declare function getProperty(propertyName: "reverseProxy.disableEtag"): boolean;
export declare function getProperty(propertyName: "reverseProxy.urlPrefix"): string;
export declare function getProperty(propertyName: "session.cookieName"): string;
export declare function getProperty(propertyName: "session.doKeepAlive"): boolean;
export declare function getProperty(propertyName: "session.maxAgeMillis"): number;
export declare function getProperty(propertyName: "session.secret"): string;
export declare const keepAliveMillis: number;
export declare const getLicenceLengthFunctionNames: () => string[];
export declare const getLicenceLengthFunction: (licenceLengthFunctionName: string) => configTypes.LicenceLengthFunction;
