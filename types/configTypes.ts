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
  },
  defaults?: ConfigDefaults;
  licenceLengthFunctions?: {
    [licenceLengthFunctionName: string]: LicenceLengthFunction;
  };
}

interface ConfigApplication {
  applicationName?: string;
  logoURL?: string;
  httpPort?: number;
  userDomain?: string;
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

export type LicenceNumberFunction = "year-fourDigits" | "year-fiveDigits" | "year-sixDigits";


export type LicenceLengthFunction = (startDate: Date) => Date;
