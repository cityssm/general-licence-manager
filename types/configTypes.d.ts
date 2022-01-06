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
        canLogin?: string[];
        canUpdate?: string[];
        isAdmin?: string[];
    };
    defaults?: ConfigDefaults;
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
    licenseeCity: string;
    licenseeProvince: string;
}
export {};
