import type * as configTypes from "../types/configTypes";

export const config: configTypes.Config = {
  defaults: {
    licenseeCity: "Sault Ste. Marie",
    licenseeProvince: "ON",
    licenceNumberFunction: "year-fourDigits"
  },
  users: {
    testing: ["*testing"],
    canLogin: ["*testing"],
    canUpdate: ["*testing"],
    isAdmin: ["*testing"]
  }
};
