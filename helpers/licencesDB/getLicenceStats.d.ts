interface LicenceStats {
    startDateMin: number;
    startDateStringMin?: string;
    startYearMin?: number;
    startDateMax: number;
    startDateStringMax?: string;
    startYearMax?: number;
}
export declare const getLicenceStats: () => LicenceStats;
export default getLicenceStats;
