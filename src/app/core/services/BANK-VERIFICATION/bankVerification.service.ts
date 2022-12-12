import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
    BankService,
    CreateBankCommand,
    CreateResponse,
} from 'appcoretruckassist';
import { distinctUntilChanged, Observable } from 'rxjs';
import {
    accountBankValidation,
    bankRoutingValidator,
    routingBankValidation,
} from '../../components/shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../components/shared/ta-input/ta-input.service';

@Injectable({
    providedIn: 'root',
})
export class BankVerificationService {
    constructor(
        private inputService: TaInputService,
        private bankService: BankService
    ) {}

    public onSelectBank(
        bankValue: string,
        routingControl: AbstractControl,
        accountControl: AbstractControl
    ): boolean {
        if (bankValue) {
            this.inputService.changeValidators(
                routingControl,
                true,
                routingBankValidation,
                false
            );
            this.routingNumberTyping(routingControl);

            this.inputService.changeValidators(
                accountControl,
                true,
                accountBankValidation,
                false
            );
            return true;
        } else {
            this.inputService.changeValidators(routingControl, false);
            this.inputService.changeValidators(accountControl, false);
            return false;
        }
    }

    private async routingNumberTyping(routingControl: AbstractControl) {
        routingControl.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe((value) => {
                if (value?.length > 8) {
                    if (bankRoutingValidator(value)) {
                        routingControl.setErrors(null);
                    } else {
                        routingControl.setErrors({ invalid: true });
                    }
                }
            });
    }

    public createBank(name: CreateBankCommand): Observable<CreateResponse> {
        return this.bankService.apiBankPost(name);
    }
}
