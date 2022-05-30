export interface Config {
  application?: ConfigApplication;
  session?: ConfigSession;
  reverseProxy?: {
    disableCompression: boolean;
    disableEtag: boolean;
    urlPrefix: string;
  };
  activeDirectory?: ConfigActiveDirectory;
  users?: {
    testing?: string[];
    canLogin?: string[];
    canUpdate?: string[];
    isAdmin?: string[];
  };
  defaults?: ConfigDefaults;
  settings?: {
    licenceAlias?: string;
    licenceAliasPlural?: string;
    licenseeAlias?: string;
    licenseeAliasPlural?: string;
    renewalAlias?: string;
    includeBatches?: boolean;
    includeReplacementFee?: boolean;
  };
  exports?: {
    batches?: ConfigBatchExport;
  };
  licenceLengthFunctions?: {
    [licenceLengthFunctionName: string]: LicenceLengthFunction;
  };
  additionalFeeFunctions?: {
    [additionalFeeFunctionName: string]: AdditionalFeeFunction;
  };
}

interface ConfigApplication {
  applicationName?: string;
  logoURL?: string;
  httpPort?: number;
  userDomain?: string;
  useTestDatabases?: boolean;
}


interface ConfigSession {
  cookieName?: string;
  secret?: string;
  maxAgeMillis?: number;
  doKeepAlive?: boolean;
}


export interface ConfigActiveDirectory {
  url: string;
  baseDN: string;
  username: string;
  password: string;
}


interface ConfigDefaults {
  licenceNumberFunction: LicenceNumberFunction;
  licenseeCity: string;
  licenseeProvince: string;
}


export type ConfigBatchExport = ConfigBatchExport_RBCPreauthorized;


export interface ConfigBatchExport_RBCPreauthorized {
  exportType: "rbcPreauthorized";
  isTesting: boolean;
  header: {
    clientNumber: string;
    clientName: string;
    fileCreationNumberOffset: number;
    currencyType: "CAD" | "USD";
  },
  record: {
    transactionCode: "430";
    languageCode: "E" | "F";
    clientShortName: string;
    destinationCountry: "CAN" | "USA";
  }
}


export type LicenceNumberFunction = "year-fourDigits" | "year-fiveDigits" | "year-sixDigits";


export type LicenceLengthFunction = (startDate: Date) => Date;


export type AdditionalFeeFunction = (baseLicenceFee: number) => number;
