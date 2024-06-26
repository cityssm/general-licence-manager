import { getDayOfYear } from '@cityssm/modern-julian-date';
import stringHash from 'string-hash';
export function leftPad(unpaddedString, paddingCharacter, finalLength) {
    return unpaddedString
        .padStart(finalLength, paddingCharacter)
        .slice(-1 * finalLength);
}
export function rightPad(unpaddedString, paddingCharacter, finalLength) {
    return unpaddedString
        .padEnd(finalLength, paddingCharacter)
        .slice(0, finalLength);
}
export function calculateFileCreationNumber(batchDate, fileCreationNumberOffset) {
    const dayCount = Math.abs((batchDate.getFullYear() - 2022) * 366 +
        getDayOfYear(batchDate, true) +
        (fileCreationNumberOffset ?? 0));
    return leftPad(dayCount.toString(), '0', 4);
}
export function calculateCustomerNumber(transaction) {
    const textToHash = (transaction.licenseeName ?? '').toLowerCase() +
        '::' +
        (transaction.licenseeBusinessName ?? '').toLowerCase() +
        '::' +
        transaction.bankInstitutionNumber +
        '::' +
        transaction.bankTransitNumber +
        '::' +
        transaction.bankAccountNumber;
    return rightPad(stringHash(textToHash).toString(), ' ', 19);
}
