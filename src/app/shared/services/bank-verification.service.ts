import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';

// validations
import {
    routingBankValidation,
    accountBankValidation,
    bankRoutingValidator,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// services
import { TaInputService } from '@shared/services/ta-input.service';

// models
import {
    BankService,
    CreateBankCommand,
    CreateResponse,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class BankVerificationService {
    private destroy$ = new Subject<void>();

    constructor(
        private inputService: TaInputService,
        private bankService: BankService
    ) { }

    public async onSelectBank(
        bankValue: string,
        routingControl: AbstractControl,
        accountControl: AbstractControl
    ): Promise<boolean> {
        if (bankValue) {
            this.inputService.changeValidators(
                routingControl,
                true,
                routingBankValidation,
                false
            );

            await this.routingNumberTyping(routingControl);

            this.inputService.changeValidators(
                accountControl,
                true,
                accountBankValidation,
                false
            );

            return new Promise((resolve, _) => {
                resolve(true);
            });
        } else {
            this.inputService.changeValidators(routingControl, false);

            return new Promise((resolve, _) => {
                const timeout = setTimeout(() => {
                    resolve(false);
                    clearTimeout(timeout);
                }, 100);
            });
        }
    }

    private async routingNumberTyping(routingControl: AbstractControl) {
        routingControl.valueChanges
            .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe(async (value) => {
                if (value?.length > 8) {
                    if (await bankRoutingValidator(value)) {
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
