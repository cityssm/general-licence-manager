interface LicenceStats {
    startDateMin: number | null;
    startDateStringMin?: string;
    startYearMin?: number;
    startDateMax: number;
    startDateStringMax?: string;
    startYearMax?: number;
}
export default function getLicenceStats(): LicenceStats;
export {};
