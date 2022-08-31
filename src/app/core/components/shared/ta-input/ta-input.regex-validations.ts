import { Validators } from '@angular/forms';

//---------------- Bank Regex, Routing & Accounting Validation ----------------
const brnv = require('bank-routing-number-validator');

export const bankRoutingValidator = (routingNumber: string) => {
  return brnv.ABARoutingNumberIsValid(routingNumber);
};

export const routingBankValidation = [
  Validators.minLength(9),
  Validators.maxLength(9),
];

export const accountBankValidation = [
  Validators.minLength(4),
  Validators.maxLength(17),
];
//-------------------------------------------------------------------------------

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

//---------------- MC/FF ----------------
export const mcFFValidation = [
  Validators.minLength(6),
  Validators.maxLength(6),
];

//---------------- Phone Regex & Phone Extension ----------------
export const phoneRegex = Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/);

export const phoneExtension = [
  Validators.minLength(1),
  Validators.maxLength(8),
];

//---------------- Email Regex ----------------
export const emailRegex = Validators.pattern(
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
);

export const emailValidation = [
  Validators.minLength(5),
  Validators.maxLength(64),
];

//---------------- Address & Address Unit -------------------
export const addressValidation = [
  Validators.minLength(12),
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

//---------------- SSN Regex ----------------
export const ssnNumberRegex = Validators.pattern(/^\d{3}\-\d{2}\-\d{4}$/);

//---------------- Year, month, day ----------------
export const yearValidRegex = Validators.pattern(
  /^(19[0-9]\d|20[0-4]\d|2100)$/
);
export const monthsValidRegex = Validators.pattern(/^([1-9]|1[012])$/);
export const daysValidRegex = Validators.pattern(
  /^([1-9][0-9]?|[12][0-9][0-9]|3[0-5][0-9]|36[0-5])$/
);

//---------------- Insurance Policy ----------------
export const insurancePolicyRegex = [
  Validators.minLength(8),
  Validators.maxLength(14),
];

//---------------- Mile, PerStop ----------------
export const mileValidation = [Validators.min(0), Validators.max(10)];
export const perStopValidation = [Validators.min(0), Validators.max(5000)];
