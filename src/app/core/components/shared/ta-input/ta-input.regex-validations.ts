import { Validators } from '@angular/forms';
import moment from 'moment';

//---------------- Bank Regex, Routing & Accounting Validation ----------------
const brnv = require('bank-routing-number-validator');

export const bankRoutingValidator = (routingNumber: string) => {
  return brnv.ABARoutingNumberIsValid(routingNumber);
};

export const bankValidation = [
  Validators.minLength(2),
  Validators.maxLength(64),
];

export const routingBankValidation = [
  Validators.minLength(9),
  Validators.maxLength(9),
];

export const accountBankValidation = [
  Validators.minLength(5),
  Validators.maxLength(17),
];

//---------------- Bussiness Name, Repair Shop, Fuel Stop ----------------
export const businessNameValidation = [
  Validators.minLength(2),
  Validators.maxLength(64),
];

export const repairShopValidation = [
  Validators.minLength(2),
  Validators.maxLength(64),
];

export const fuelStopValidation = [
  Validators.minLength(2),
  Validators.maxLength(64),
];

//---------------- Ein Regex ----------------
export const einNumberRegex = Validators.pattern(/^\d{2}\-\d{7}$/);

//---------------- SSN Regex ----------------
export const ssnNumberRegex = Validators.pattern(/^\d{3}\-\d{2}\-\d{4}$/);

//---------------- MC/FF --------------------
export const mcFFValidation = [
  Validators.minLength(5),
  Validators.maxLength(6),
];

//---------------- Phone/Fax Regex & Phone Extension ----------------
export const phoneFaxRegex = Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/);

export const phoneExtension = [
  Validators.minLength(1),
  Validators.maxLength(8),
];

//---------------- Address & Address Unit -------------------
export const addressValidation = [
  Validators.minLength(6),
  Validators.maxLength(256),
];

export const addressUnitValidation = [
  Validators.minLength(1),
  Validators.maxLength(10),
];

//---------------- Department -------------------
export const departmentValidation = [
  Validators.minLength(2),
  Validators.maxLength(36),
];

//---------------- First Name -------------------
export const firstNameValidation = [
  Validators.minLength(2),
  Validators.maxLength(26),
];

//---------------- Last Name --------------------
export const lastNameValidation = [
  Validators.minLength(2),
  Validators.maxLength(26),
];

//---------------- Fuel Card ---------------------
export const fuelCardValidation = [
  Validators.minLength(10),
  Validators.maxLength(19),
];

//---------------- Vehicle Unit ------------------
export const vehicleUnitValidation = [
  Validators.minLength(1),
  Validators.maxLength(8),
];

//---------------- VIN Number ------------------
export const vinNumberValidation = [
  Validators.minLength(5),
  Validators.maxLength(17),
];

//---------------- Truck Trailer Model ---------------
export const truckTrailerModelValidation = [
  Validators.minLength(1),
  Validators.maxLength(30),
];

//---------------- Axles Model --------------------
export const axlesValidation = [Validators.min(2), Validators.max(17)];

//---------------- Year, month, day ---------------
export const yearValidRegex = Validators.pattern(
  /^(19[0-9]\d|20[0-4]\d|2100)$/
);
//  Validators.pattern(
//   new RegExp(
//     '^(19[0-9]d|20[0-4]d|' + moment().add(1, 'year').format('YYYY') + ')$'
//   )
// );

export const yearValidation = [
  Validators.minLength(4),
  Validators.maxLength(4),
];
export const monthsValidRegex = Validators.pattern(/^([1-9]|1[012])$/);

export const daysValidRegex = Validators.pattern(
  /^([1-9][0-9]?|[12][0-9][0-9]|3[0-5][0-9]|36[0-5])$/
);

//---------------- Empty Weight -------------------
export const emptyWeightValidation = [
  Validators.minLength(4),
  Validators.maxLength(6), // because of ','
];

//---------------- Insurance Policy ----------------
export const insurancePolicyValidation = [
  Validators.minLength(8),
  Validators.maxLength(14),
];

//---------------- Mileage -------------------------
export const mileageValidation = [
  Validators.minLength(1),
  Validators.maxLength(10),
];

//---------------- License plate -------------------------
export const licensePlateValidation = [
  Validators.minLength(5),
  Validators.maxLength(7),
];

//---------------- Description -------------------------
export const descriptionValidation = [
  Validators.minLength(2),
  Validators.maxLength(160),
];

//---------------- Label --------------------------------
export const labelValidation = [
  Validators.minLength(1),
  Validators.maxLength(32),
];

//---------------- dbaName --------------------------------
export const creditLimitValidation = [
  Validators.minLength(4),
  Validators.maxLength(13),
];

//---------------- dbaName --------------------------------
export const poBoxValidation = [
  Validators.minLength(1),
  Validators.maxLength(6),
];

//---------------- Emergency Name, DBA Name --------------------------------
export const name2_24Validation = [
  Validators.minLength(2),
  Validators.maxLength(24),
];

//---------------- Price --------------------------------
export const priceValidation = [
  Validators.minLength(2),
  Validators.maxLength(24),
];

//---------------- Trailer Volume --------------------------------
export const trailerVolumeValidation = [
  Validators.minLength(5),
  Validators.maxLength(7),
];

//---------------- Repair Odometer --------------------------------
export const repairOdometerValidation = [
  Validators.minLength(1),
  Validators.maxLength(7),
];

//---------------- Repair Odometer --------------------------------
export const invoiceValidation = [
  Validators.minLength(1),
  Validators.maxLength(7),
];

//---------------- Fuel Store Odometer --------------------------------
export const fuelStoreValidation = [
  Validators.minLength(2),
  Validators.maxLength(32),
];

//---------------- Mile, PerStop -------------------
export const mileValidation = [Validators.min(0), Validators.max(10)];

export const perStopValidation = [Validators.min(0), Validators.max(5000)];
