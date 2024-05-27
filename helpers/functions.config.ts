// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import { Configurator } from '@cityssm/configurator'

import { configDefaultValues } from '../data/config.defaultValues.js'
import { config } from '../data/config.js'
import type {
  AdditionalFeeFunction,
  LicenceLengthFunction,
  ReportDefinition
} from '../types/configTypes.js'

const configurator = new Configurator(
  configDefaultValues,
  config as unknown as Record<string, unknown>
)

export function getConfigProperty<K extends keyof typeof configDefaultValues>(
  propertyName: K,
  fallbackValue?: (typeof configDefaultValues)[K]
): (typeof configDefaultValues)[K] {
  return configurator.getConfigProperty(
    propertyName,
    fallbackValue
  ) as (typeof configDefaultValues)[K]
}

export const keepAliveMillis = getConfigProperty('session.doKeepAlive')
  ? Math.max(
      getConfigProperty('session.maxAgeMillis') / 2,
      getConfigProperty('session.maxAgeMillis') - 10 * 60 * 1000
    )
  : 0

export function getLicenceLengthFunctionNames(): string[] {
  return Object.keys(getConfigProperty('licenceLengthFunctions'))
}

export function getLicenceLengthFunction(
  licenceLengthFunctionName: string
): LicenceLengthFunction {
  return getConfigProperty('licenceLengthFunctions')[licenceLengthFunctionName]
}

export function getAdditionalFeeFunctionNames(): string[] {
  return Object.keys(getConfigProperty('additionalFeeFunctions')) || []
}

export function getAdditionalFeeFunction(
  additionalFeeFunctionName: string
): AdditionalFeeFunction {
  return getConfigProperty('additionalFeeFunctions')[additionalFeeFunctionName]
}

export function getCustomReport(
  reportName: string
): ReportDefinition | undefined {
  return getConfigProperty('customReports').find((possibleReportDefinition) => {
    return possibleReportDefinition.reportName === reportName
  })
}
