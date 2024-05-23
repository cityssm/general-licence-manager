export interface GLM {
  urlPrefix: string
  populateAliases: (containerElement: HTMLElement) => void
  getBankName: (
    bankInstitutionNumber: string,
    bankTransitNumber: string,
    callbackFunction: (bankName: string) => void
  ) => void
  getDayName: (dateString: string) => string
}
