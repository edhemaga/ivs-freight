import { Validators } from "@angular/forms";

export const emailRegex = Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);
export const phoneRegex = Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/);
export const einNumberRegex = Validators.pattern(/^\d{2}\-\d{7}$/);
export const ssnNumberRegex = Validators.pattern(/^\d{3}\-\d{2}\-\d{4}$/);
export const yearValidRegex = Validators.pattern(/^(19[0-9]\d|20[0-4]\d|2100)$/);


export const routingBankRegex = [Validators.minLength(9), Validators.maxLength(9)];
export const accountBankRegex = [Validators.minLength(4), Validators.maxLength(17)];
export const insurancePolicyRegex = [Validators.minLength(8), Validators.maxLength(14)];