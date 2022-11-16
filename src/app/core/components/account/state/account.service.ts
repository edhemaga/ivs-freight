import { CompanyAccountService } from './../../../../../../appcoretruckassist/api/companyAccount.service';
import { Injectable } from '@angular/core';
import {
    AccountColorResponse,
    CompanyAccountLabelService,
    CompanyAccountModalResponse,
    CompanyAccountResponse,
    CreateCompanyAccountCommand,
    CreateCompanyAccountLabelCommand,
    CreateResponse,
    GetCompanyAccountLabelListResponse,
    UpdateCompanyAccountCommand,
    UpdateCompanyAccountLabelCommand,
} from 'appcoretruckassist';
import { Observable, tap } from 'rxjs';
import { AccountStore } from './account-state/account.store';
import { AccountQuery } from './account-state/account.query';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';

@Injectable({
    providedIn: 'root',
})
export class AccountTService {
    constructor(
        private accountService: CompanyAccountService,
        private tableService: TruckassistTableService,
        private accountStore: AccountStore,
        private accountQuery: AccountQuery,
        private accountLabelService: CompanyAccountLabelService
    ) {}

    // Add Account
    public addCompanyAccount(
        data: CreateCompanyAccountCommand
    ): Observable<CreateResponse> {
        return this.accountService.apiCompanyaccountPost(data).pipe(
            tap((res: any) => {
                const subAccount = this.getCompanyAccountById(res.id).subscribe(
                    {
                        next: (account: CompanyAccountResponse | any) => {
                            this.accountStore.add(account);

                            const accountCount = JSON.parse(
                                localStorage.getItem('accountTableCount')
                            );

                            accountCount.active++;

                            localStorage.setItem(
                                'accountTableCount',
                                JSON.stringify({
                                    account: accountCount.account,
                                })
                            );

                            this.tableService.sendActionAnimation({
                                animation: 'add',
                                data: account,
                                id: account.id,
                            });

                            subAccount.unsubscribe();
                        },
                    }
                );
            })
        );
    }

    // Update Account
    public updateCompanyAccount(
        data: UpdateCompanyAccountCommand
    ): Observable<any> {
        return this.accountService.apiCompanyaccountPut(data).pipe(
            tap(() => {
                const subAccount = this.getCompanyAccountById(
                    data.id
                ).subscribe({
                    next: (account: CompanyAccountResponse | any) => {
                        this.accountStore.remove(({ id }) => id === data.id);

                        this.accountStore.add(account);

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: account,
                            id: account.id,
                        });

                        subAccount.unsubscribe();
                    },
                });
            })
        );
    }

    // Get Account List
    public getAccounts(
        labelId?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<CompanyAccountResponse> {
        return this.accountService.apiCompanyaccountListGet(
            labelId,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

    // Get Account By Id
    public getCompanyAccountById(
        id: number
    ): Observable<CompanyAccountResponse> {
        return this.accountService.apiCompanyaccountIdGet(id);
    }

    // Delete Account List
    public deleteAccountList(accountsToDelete: any[]): Observable<any> {
        let deleteOnBack = accountsToDelete.map((owner: any) => {
            return owner.id;
        });

        return this.accountService
            .apiCompanyaccountListDelete(deleteOnBack)
            .pipe(
                tap(() => {
                    let storeAccounts = this.accountQuery.getAll();
                    let countDeleted = 0;

                    storeAccounts.map((account: any) => {
                        deleteOnBack.map((d) => {
                            if (d === account.id) {
                                this.accountStore.remove(
                                    ({ id }) => id === account.id
                                );
                                countDeleted++;
                            }
                        });
                    });

                    localStorage.setItem(
                        'accountTableCount',
                        JSON.stringify({
                            account: storeAccounts.length - countDeleted,
                        })
                    );
                })
            );
    }

    // Delete Account By Id
    public deleteCompanyAccountById(accountId: number): Observable<any> {
        return this.accountService.apiCompanyaccountIdDelete(accountId).pipe(
            tap(() => {
                this.accountStore.remove(({ id }) => id === accountId);

                const accountCount = JSON.parse(
                    localStorage.getItem('accountTableCount')
                );

                accountCount.account--;

                localStorage.setItem(
                    'accountTableCount',
                    JSON.stringify({
                        account: accountCount.account,
                    })
                );

                this.tableService.sendActionAnimation({
                    animation: 'delete',
                    id: accountId,
                });
            })
        );
    }

    //--------------------- Get Account Modal ---------------------
    public companyAccountModal(): Observable<CompanyAccountModalResponse> {
        return this.accountService.apiCompanyaccountModalGet();
    }

    // --------------------- ACCOUNT LABEL ---------------------
    public companyAccountLabelsList(): Observable<GetCompanyAccountLabelListResponse> {
        return this.accountLabelService.apiCompanyaccountlabelListGet();
    }

    public companyAccountLabelsColorList(): Observable<
        Array<AccountColorResponse>
    > {
        return this.accountLabelService.apiCompanyaccountlabelColorListGet();
    }

    public addCompanyAccountLabel(
        data: CreateCompanyAccountLabelCommand
    ): Observable<CreateResponse> {
        return this.accountLabelService.apiCompanyaccountlabelPost(data);
    }

    public updateCompanyAccountLabel(
        data: UpdateCompanyAccountLabelCommand
    ): Observable<any> {
        return this.accountLabelService.apiCompanyaccountlabelPut(data);
    }
}
