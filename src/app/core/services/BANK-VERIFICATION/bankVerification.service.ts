import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { distinctUntilChanged, take } from 'rxjs';
import {
  accountBankRegex,
  bankRoutingValidator,
  routingBankRegex,
} from '../../components/shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../components/shared/ta-input/ta-input.service';

@Injectable({
  providedIn: 'root',
})
export class BankVerificationService {
  constructor(private inputService: TaInputService) {}

  public onSelectBank(
    bankValue: string,
    routingControl: AbstractControl,
    accountControl: AbstractControl
  ): boolean {
    if (bankValue) {
      this.inputService.changeValidators(
        routingControl,
        true,
        routingBankRegex
      );
      this.routingNumberTyping(routingControl);
      this.inputService.changeValidators(
        accountControl,
        true,
        accountBankRegex
      );
      return true;
    } else {
      this.inputService.changeValidators(routingControl, false);
      this.inputService.changeValidators(accountControl, false);
      return false;
    }
  }

  private routingNumberTyping(routingControl: AbstractControl) {
    routingControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value && value.split('').length > 8) {
          if (bankRoutingValidator(value)) {
            routingControl.setErrors(null);
          } else {
            routingControl.setErrors({ invalid: true });
          }
        }
      });
  }
}
