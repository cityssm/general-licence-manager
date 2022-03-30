export interface Record {
  recordCreate_userName?: string;
  recordCreate_timeMillis?: number;
  recordCreate_dateString?: string;

  recordUpdate_userName?: string;
  recordUpdate_timeMillis?: number;
  recordUpdate_dateString?: string;
  recordUpdate_timeString?: string;

  recordDelete_userName?: string;
  recordDelete_timeMillis?: number;
  recordDelete_dateString?: string;
}

/*
 * Licence
 */

export interface Licence extends Record {

  licenceId: number | "";
  licenceCategoryKey: string;
  licenceNumber: string;

  licenseeName: string;
  licenseeBusinessName: string;
  licenseeAddress1: string;
  licenseeAddress2: string;
  licenseeCity: string;
  licenseeProvince: string;
  licenseePostalCode: string;

  isRenewal: boolean;

  startDate: number;
  startDateString?: string;
  endDate?: number;
  endDateString?: string;

  issueDate?: number;
  issueDateString?: string;
  issueTime?: number;
  issueTimeString?: string;

  licenceFee: number | "";
  replacementFee: number | "";

  bankInstitutionNumber?: string;
  bankTransitNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;

  relatedLicences?: Licence[];
  licenceCategory?: string;
  licenceFields?: LicenceField[];
  licenceApprovals?: LicenceApproval[];
  licenceTransactions?: LicenceTransaction[];
}

export interface LicenceField {
  licenceId?: number;
  licenceFieldKey: string;
  licenceFieldValue: string;

  licenceField?: string;
  licenceFieldDescription?: string;
  isRequired?: boolean;
  minimumLength?: number;
  maximumLength?: number;
  pattern?: string;
  printKey?: string;
}

export interface LicenceApproval {
  licenceId?: number;
  licenceApprovalKey: string;
  isApproved?: boolean;

  licenceApproval?: string;
  licenceApprovalDescription?: string;
  isRequiredForNew?: boolean;
  isRequiredForRenewal?: boolean;
  printKey?: string;
}

export interface LicenceTransaction extends Record {
  licenceId?: number;
  transactionIndex: number;
  transactionDate?: number;
  transactionDateString?: string;
  transactionTime?: number;
  transactionTimeString?: string;
  bankInstitutionNumber?: string;
  bankTransitNumber?: string;
  bankAccountNumber?: string;
  externalReceiptNumber?: string;
  batchDate?: number;
  batchDateString?: string;
  transactionAmount: number;
  transactionNote?: string;
}

/*
 * Licence Category
 */

export interface LicenceCategory extends Record {
  licenceCategoryKey: string;
  licenceCategory: string;
  bylawNumber: string;
  licenceLengthFunction: string;
  licenceLengthYears: number;
  licenceLengthMonths: number;
  licenceLengthDays: number;
  printEJS?: string;

  licenceCategoryApprovals?: LicenceCategoryApproval[];
  licenceCategoryFees?: LicenceCategoryFee[];
  licenceCategoryFields?: LicenceCategoryField[];

  hasEffectiveFee?: boolean;
}

export interface LicenceCategoryApproval extends Record {
  licenceApprovalKey: string;
  licenceCategoryKey?: string;
  licenceApproval: string;
  licenceApprovalDescription: string;
  isRequiredForNew: boolean;
  isRequiredForRenewal: boolean;
  printKey: string;
  orderNumber?: number;
}

export interface LicenceCategoryFee extends Record {
  licenceFeeId?: number;
  licenceCategoryKey?: string;
  effectiveStartDate?: number;
  effectiveStartDateString?: string;
  effectiveEndDate?: number;
  effectiveEndDateString?: string;
  licenceFee: number;
  renewalFee?: number;
  replacementFee?: number;
}

export interface LicenceCategoryField extends Record {
  licenceFieldKey: string;
  licenceCategoryKey?: string;
  licenceField: string;
  licenceFieldDescription: string;
  isRequired: boolean;
  minimumLength: number;
  maximumLength: number;
  pattern: string;
  printKey: string;
  orderNumber?: number;
}

export interface Batch {
  batchDate: number;
  batchDateString: string;
  transactionCount: number;
}

/*
 * User
 */


export interface User {
  userName: string;
  userProperties?: UserProperties;
}

export interface UserProperties {
  canUpdate: boolean;
  isAdmin: boolean;
}


declare module "express-session" {
  interface Session {
    user: User;
  }
}


export interface PartialSession {
  user: User;
}
