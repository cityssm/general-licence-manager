import { Configurator } from '@cityssm/configurator';
import { configDefaultValues } from '../data/config.defaultValues.js';
import { config } from '../data/config.js';
const configurator = new Configurator(configDefaultValues, config);
export function getConfigProperty(propertyName, fallbackValue) {
    return configurator.getConfigProperty(propertyName, fallbackValue);
}
export const keepAliveMillis = getConfigProperty('session.doKeepAlive')
    ? Math.max(getConfigProperty('session.maxAgeMillis') / 2, getConfigProperty('session.maxAgeMillis') - 10 * 60 * 1000)
    : 0;
export function getLicenceLengthFunctionNames() {
    return Object.keys(getConfigProperty('licenceLengthFunctions'));
}
export function getLicenceLengthFunction(licenceLengthFunctionName) {
    return getConfigProperty('licenceLengthFunctions')[licenceLengthFunctionName];
}
export function getAdditionalFeeFunctionNames() {
    return Object.keys(getConfigProperty('additionalFeeFunctions')) || [];
}
export function getAdditionalFeeFunction(additionalFeeFunctionName) {
    return getConfigProperty('additionalFeeFunctions')[additionalFeeFunctionName];
}
export function getCustomReport(reportName) {
    return getConfigProperty('customReports').find((possibleReportDefinition) => {
        return possibleReportDefinition.reportName === reportName;
    });
}
