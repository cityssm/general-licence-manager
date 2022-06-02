import * as configFunctions from "./functions.config.js";
export const calculateAdditionalFeeAmount = (licenceCategoryAdditionalFee, baseLicenceFee) => {
    const baseLicenceFeeFloat = typeof (baseLicenceFee) === "string"
        ? Number.parseFloat(baseLicenceFee)
        : baseLicenceFee;
    let additionalFeeAmount = licenceCategoryAdditionalFee.additionalFeeNumber;
    switch (licenceCategoryAdditionalFee.additionalFeeType) {
        case "percent":
            additionalFeeAmount = baseLicenceFeeFloat * (additionalFeeAmount / 100);
            break;
        case "function":
            additionalFeeAmount = configFunctions.getAdditionalFeeFunction(licenceCategoryAdditionalFee.additionalFeeFunction)(baseLicenceFeeFloat);
            break;
    }
    return additionalFeeAmount;
};
