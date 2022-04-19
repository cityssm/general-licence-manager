import type * as configTypes from "../types/configTypes";

export const config: configTypes.Config = {
  application: {
    useTestDatabases: true
  },
  defaults: {
    licenseeCity: "Sault Ste. Marie",
    licenseeProvince: "ON",
    licenceNumberFunction: "year-fourDigits"
  },
  users: {
    testing: ["*testView", "*testUpdate", "*testAdmin"],
    canLogin: ["*testView", "*testUpdate", "*testAdmin"],
    canUpdate: ["*testUpdate"],
    isAdmin: ["*testAdmin"]
  },
  settings: {
    includeBatches: true
  }
};
