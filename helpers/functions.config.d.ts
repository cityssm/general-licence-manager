import { configDefaultValues } from '../data/config.defaultValues.js';
import type { AdditionalFeeFunction, LicenceLengthFunction, ReportDefinition } from '../types/configTypes.js';
export declare function getConfigProperty<K extends keyof typeof configDefaultValues>(propertyName: K, fallbackValue?: (typeof configDefaultValues)[K]): (typeof configDefaultValues)[K];
export declare const keepAliveMillis: number;
export declare function getLicenceLengthFunctionNames(): string[];
export declare function getLicenceLengthFunction(licenceLengthFunctionName: string): LicenceLengthFunction;
export declare function getAdditionalFeeFunctionNames(): string[];
export declare function getAdditionalFeeFunction(additionalFeeFunctionName: string): AdditionalFeeFunction;
export declare function getCustomReport(reportName: string): ReportDefinition | undefined;
