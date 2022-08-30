import { Validators } from '@angular/forms';

//---------------- Bank Regex Routing & Accounting ----------------
const brnv = require('bank-routing-number-validator');

export const bankRoutingValidator = (routingNumber: string) => {
  return brnv.ABARoutingNumberIsValid(routingNumber);
};

export const routingBankRegex = [
  Validators.minLength(9),
  Validators.maxLength(9),
];

export const accountBankRegex = [
  Validators.minLength(4),
  Validators.maxLength(17),
];

//---------------- Bussiness Name ----------------
export const businessNameRegex = [
  Validators.minLength(2),
  Validators.maxLength(64),
];

//---------------- Email Regex ----------------
export const emailRegex = Validators.pattern(
  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
);

//---------------- Phone Regex ----------------
export const phoneRegex = Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/);

//---------------- Ein Regex ----------------
export const einNumberRegex = Validators.pattern(/^\d{2}\-\d{7}$/);

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
