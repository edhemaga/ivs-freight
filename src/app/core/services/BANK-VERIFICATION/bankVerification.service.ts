import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
    BankService,
    CreateBankCommand,
    CreateResponse,
} from 'appcoretruckassist';
import { distinctUntilChanged, Observable, Subject } from 'rxjs';
import {
    accountBankValidation,
    bankRoutingValidator,
    routingBankValidation,
} from '../../components/shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../components/shared/ta-input/ta-input.service';
import { takeUntil } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class BankVerificationService {
    private destroy$ = new Subject<void>();

    constructor(
        private inputService: TaInputService,
        private bankService: BankService
    ) {}

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
            this.inputService.changeValidators(accountControl, false);

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
