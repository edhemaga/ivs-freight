import { Validators } from '@angular/forms';
import moment from 'moment';

//---------------- Bank Regex, Routing & Accounting Validation
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

//---------------- Bussiness Name, Repair Shop, Fuel Stop
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

//---------------- Ein Regex
export const einNumberRegex = Validators.pattern(/^\d{2}\-\d{7}$/);

//---------------- SSN Regex
export const ssnNumberRegex = Validators.pattern(/^\d{3}\-\d{2}\-\d{4}$/);

//---------------- MC/FF
export const mcFFValidation = [
  Validators.minLength(5),
  Validators.maxLength(6),
];

//---------------- Phone/Fax Regex & Phone Extension
export const phoneFaxRegex = Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/);

export const phoneExtension = [
  Validators.minLength(1),
  Validators.maxLength(8),
];

//---------------- Address & Address Unit
export const addressValidation = [
  Validators.minLength(6),
  Validators.maxLength(256),
];

export const addressUnitValidation = [
  Validators.minLength(1),
  Validators.maxLength(10),
];

//---------------- Department
export const departmentValidation = [
  Validators.minLength(2),
  Validators.maxLength(36),
];

//---------------- First Name
export const firstNameValidation = [
  Validators.minLength(2),
  Validators.maxLength(26),
];

//---------------- Last Name
export const lastNameValidation = [
  Validators.minLength(2),
  Validators.maxLength(26),
];

//---------------- Fuel Card
export const fuelCardValidation = [
  Validators.minLength(10),
  Validators.maxLength(19),
];

//---------------- Vehicle Unit
export const vehicleUnitValidation = [
  Validators.minLength(1),
  Validators.maxLength(8),
];

//---------------- VIN Number
export const vinNumberValidation = [
  Validators.minLength(5),
  Validators.maxLength(17),
];

//---------------- Truck Trailer Model
export const truckTrailerModelValidation = [
  Validators.minLength(1),
  Validators.maxLength(50),
];

//---------------- Axles Model
export const axlesValidation = [Validators.min(2), Validators.max(17)];

//---------------- Year, month, day
const yearRange =
  parseInt(moment().add(1, 'year').format('YY').substring(1)) - 1;

export const yearValidRegex = Validators.pattern(
  new RegExp(
    `^(19[0-9]\\d|20[0-` +
      yearRange +
      `]\\d` +
      `|` +
      moment().add(1, 'year').format('YYYY') +
      ')$'
  )
);

export const yearValidation = [
  Validators.minLength(4),
  Validators.maxLength(4),
];
export const monthsValidRegex = Validators.pattern(/^([1-9]|1[012])$/);

export const daysValidRegex = Validators.pattern(
  /^([1-9][0-9]?|[12][0-9][0-9]|3[0-5][0-9]|36[0-5])$/
);

//---------------- Empty Weight
export const emptyWeightValidation = [
  Validators.minLength(4),
  Validators.maxLength(6), // because of ','
];

//---------------- Insurance Policy
export const insurancePolicyValidation = [
  Validators.minLength(8),
  Validators.maxLength(14),
];

//---------------- Mileage
export const mileageValidation = [
  Validators.minLength(1),
  Validators.maxLength(10),
];

//---------------- License plate
export const licensePlateValidation = [
  Validators.minLength(5),
  Validators.maxLength(7),
];

//---------------- Description
export const descriptionValidation = [
  Validators.minLength(2),
  Validators.maxLength(160),
];

//---------------- Label
export const labelValidation = [
  Validators.minLength(1),
  Validators.maxLength(32),
];

//---------------- dbaName
export const creditLimitValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- po box
export const poBoxValidation = [
  Validators.minLength(1),
  Validators.maxLength(6),
];

//---------------- Emergency Name, DBA Name
export const name2_24Validation = [
  Validators.minLength(2),
  Validators.maxLength(24),
];

//---------------- Price
export const priceValidation = [
  Validators.minLength(1),
  Validators.maxLength(24),
];

//---------------- Trailer Volume
export const trailerVolumeValidation = [
  Validators.minLength(5),
  Validators.maxLength(7),
];

//---------------- Repair Odometer
export const repairOdometerValidation = [
  Validators.minLength(1),
  Validators.maxLength(7),
];

//---------------- Invoice
export const invoiceValidation = [
  Validators.minLength(1),
  Validators.maxLength(7),
];

//---------------- Fuel Store Odometer
export const fuelStoreValidation = [
  Validators.minLength(2),
  Validators.maxLength(32),
];

//---------------- CDL Validation
export const cdlUSValidation = [
  Validators.minLength(1),
  Validators.maxLength(19),
];

export const cdlCANADAValidation = [
  Validators.minLength(5),
  Validators.maxLength(15),
];

//---------------- Username
export const usernameValidation = [
  Validators.minLength(2),
  Validators.maxLength(30),
];

//---------------- Password
export const passwordValidation = [
  Validators.minLength(8),
  Validators.maxLength(64),
];

//---------------- Full Name
export const fullNameValidation = [
  Validators.minLength(2),
  Validators.maxLength(32),
];

//---------------- Title
export const titleValidation = [
  Validators.minLength(2),
  Validators.maxLength(64),
];

//---------------- Url
export const urlValidation = [
  Validators.minLength(4),
  Validators.maxLength(255),
];

//---------------- USDOT
export const usdotValidation = [
  Validators.minLength(6),
  Validators.maxLength(8),
];

//---------------- IRP
export const irpValidation = [Validators.minLength(5), Validators.maxLength(5)];

//---------------- IFTA
export const iftaValidation = [
  Validators.minLength(13),
  Validators.maxLength(13),
];

//---------------- Toll
export const tollValidation = [
  Validators.minLength(8),
  Validators.maxLength(8),
];

//---------------- SCAC
export const scacValidation = [
  Validators.minLength(2),
  Validators.maxLength(4),
];

//---------------- Prefix
export const prefixValidation = [
  Validators.minLength(1),
  Validators.maxLength(4),
];

//---------------- Starting
export const startingValidation = [
  Validators.minLength(1),
  Validators.maxLength(6),
];

//---------------- Suffix
export const suffixValidation = [
  Validators.minLength(1),
  Validators.maxLength(4),
];

//---------------- Customer Pay Term
export const customerPayTermValidation = [
  Validators.minLength(1),
  Validators.maxLength(3),
];

//---------------- Customer Credit
export const customerCreditValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- NickName
export const nicknameValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- Default Base
export const defaultBaseValidation = [
  Validators.minLength(4),
  Validators.maxLength(10),
];

//---------------- Producer Name
export const producerNameValidation = [
  Validators.minLength(2),
  Validators.maxLength(64),
];

//---------------- Insurer Name
export const insurerNameValidation = [
  Validators.minLength(2),
  Validators.maxLength(64),
];

//---------------- Each Occurenece
export const eachOccurrenceValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- Personal & Advert Inj Expenses
export const personalAvertInjValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- Medical Expenses
export const medicalExpensesValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- Bodily Injury
export const bodilyInjuryValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- Damage
export const damageValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- General Aggregate
export const generalAggregateValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- Products - Comp/OP Agg.
export const productsCompOpAggValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- Combined Single limit
export const combinedSingleLimitValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- Single Conveyance
export const singleConveyanceValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- Deductable
export const deductableValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- Comprehen. Collision
export const comprehenCollisionValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- Trailer Value Insurance Policy
export const trailerValueInsurancePolicyValidation = [
  Validators.minLength(4),
  Validators.maxLength(11),
];

//---------------- Parking Name
export const parkingNameValidation = [
  Validators.minLength(1),
  Validators.maxLength(64),
];

//---------------- Parking Slot
export const parkingSlotValidation = [
  Validators.minLength(1),
  Validators.maxLength(64),
];

//---------------- Full Parking Slot
export const fullParkingSlotValidation = [
  Validators.minLength(1),
  Validators.maxLength(128),
];

//---------------- Rent
export const rentValidation = [
  Validators.minLength(4),
  Validators.maxLength(8),
];

//---------------- Office Name
export const officeNameValidation = [
  Validators.minLength(2),
  Validators.maxLength(64),
];

//---------------- Terminal Name
export const terminalNameValidation = [
  Validators.minLength(2),
  Validators.maxLength(64),
];

//---------------- Salary
export const salaryValidation = [
  Validators.minLength(4),
  Validators.maxLength(8),
];

//---------------- CVC
export const cvcValidation = [Validators.minLength(3), Validators.maxLength(4)];

//---------------- Mile, PerStop
export const mileValidation = [Validators.min(0), Validators.max(10)];

export const perStopValidation = [Validators.min(0), Validators.max(5000)];
