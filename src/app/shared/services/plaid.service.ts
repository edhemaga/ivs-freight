import { Injectable } from '@angular/core';
import { Observable, filter, switchMap, from, forkJoin, mergeMap } from 'rxjs';

// Services
import {
    AccessTokenResponse,
    AccountDetailsResponse,
    AchDetail,
    CompanyService,
    LinkTokenResponse,
} from 'appcoretruckassist';

// Models
import { IPlaid } from '@shared/models';
import { IBankAccount } from '@pages/settings/models';

// Enums
import { EBankAccountStatus } from '@pages/settings/enums';

// Plaid
declare const Plaid: IPlaid;

@Injectable({
    providedIn: 'root',
})
export class PlaidService {
    constructor(private companyService: CompanyService) {}
    public getPlaidVerification(): Observable<
        [AccessTokenResponse, AccountDetailsResponse]
    > {
        return this.companyService.apiCompanyPlaidLinkTokenGet().pipe(
            filter((res: LinkTokenResponse) => !!res?.link_token),
            switchMap((res: LinkTokenResponse) => {
                return from(
                    new Promise<string>((resolve, reject) => {
                        const plaid = Plaid.create({
                            token: res.link_token,
                            onSuccess: resolve,
                            onExit: (err) => reject(err),
                        });
                        plaid.open();
                    })
                );
            }),
            mergeMap((publicToken: string) =>
                forkJoin([
                    this.companyService.apiCompanyPlaidTokenExchangePost({
                        publicToken,
                    }),
                    this.companyService.apiCompanyPlaidAuthGetPost({
                        accessToken: publicToken,
                    }),
                ])
            )
        );
    }
    public compareVerificationResults(
        details: AccountDetailsResponse,
        addedAccount: IBankAccount
    ): void {
        if (details.institution_name !== addedAccount.bankId) {
            addedAccount.status = EBankAccountStatus.FAILED;
            return;
        }
        const foundAccount: AchDetail = details.account_detail.find(
            (detail) =>
                detail.routing === addedAccount.routing &&
                detail.account === addedAccount.account
        );

        addedAccount.status = foundAccount
            ? EBankAccountStatus.VERIFIED
            : EBankAccountStatus.FAILED;
    }
}
