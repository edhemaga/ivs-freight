import { Injectable } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

// RxJS
import {
    catchError,
    map,
    exhaustMap,
    switchMap,
    of,
    from,
    tap,
    forkJoin,
    withLatestFrom,
    filter,
} from 'rxjs';

// Services
import { ModalService } from '@shared/services';
import { AccountService } from '@pages/new-account/services/account.service';

// Actions
import * as AccountActions from '@pages/new-account/state/actions/account.action';

// Selectors
import * as AccountSelector from '@pages/new-account/state/selectors/account.selector';

// Components
import { NewAccountModalComponent } from '@pages/new-account/components/new-account-modal/new-account-modal.component';
import { NewDeleteAccountModalComponent } from '@pages/new-account/components/new-delete-account-modal/new-delete-account-modal.component';
import { CardColumnsModalComponent } from '@shared/components/card-columns-modal/card-columns-modal.component';

// Enums
import {
    eGeneralActions,
    eSharedString,
    eSize,
    TableStringEnum,
} from '@shared/enums';

// Interfaces
import { IMappedAccount } from '../../interfaces/mapped-account.interface';
import { ICardValueData } from '@shared/interfaces';

// Configs
import { AccountCardDataConfig } from '@pages/new-account/pages/account-card/utils/configs/account-card-data.config';

@Injectable()
export class AccountEffect {
    constructor(
        private actions$: Actions,
        private store: Store,

        private accountService: AccountService,
        private modalService: ModalService
    ) {}

    public getAccountOnFilterChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                AccountActions.onFiltersChange,
                AccountActions.onSearchFilterChange,
                AccountActions.tableSortingChange
            ),
            withLatestFrom(
                this.store.select(AccountSelector.tableSettingsSelector),
                this.store.select(AccountSelector.filterSelector)
            ),
            switchMap(([_, tableSettings, filters]) => {
                return this.accountService
                    .getAccountList(1, filters, tableSettings)
                    .pipe(
                        map((data) =>
                            AccountActions.loadAccountsSuccess({
                                data,
                            })
                        ),
                        catchError(() =>
                            of(AccountActions.loadAccountsFailure())
                        )
                    );
            })
        )
    );

    public loadAccounts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.loadAccounts),
            withLatestFrom(
                this.store.select(AccountSelector.filterSelector),
                this.store.select(AccountSelector.tableSettingsSelector)
            ),
            switchMap(([_, filters, tableSettings]) => {
                return forkJoin([
                    this.accountService.getAccountList(
                        1,
                        filters,
                        tableSettings
                    ),
                ]).pipe(
                    map(([data]) =>
                        AccountActions.loadAccountsSuccess({
                            data,
                        })
                    ),
                    catchError(() => of(AccountActions.loadAccountsFailure()))
                );
            })
        )
    );

    public getAccountsListOnPageChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.getAccountsOnPageChange),
            withLatestFrom(
                this.store.select(AccountSelector.pageSelector),
                this.store.select(AccountSelector.filterSelector),
                this.store.select(AccountSelector.tableSettingsSelector)
            ),
            switchMap(([_, page, filters, tableSettings]) => {
                console.log(this);
                return this.accountService
                    .getAccountList(page, filters, tableSettings)
                    .pipe(
                        map((data) =>
                            AccountActions.loadAccountsOnPageChangeSuccess({
                                payload: data,
                            })
                        ),
                        catchError(() =>
                            of(AccountActions.loadAccountsFailure())
                        )
                    );
            })
        )
    );

    public openModal$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.onOpenModal),
            exhaustMap((item) =>
                this.modalService.openModal(
                    NewAccountModalComponent,
                    {
                        size: eSize.MEDIUM_LOWERCASE,
                    },
                    {
                        type: item?.isEdit && eGeneralActions.EDIT_LOWERCASE,
                        ...item,
                    }
                )
            )
        )
    );

    public onAddAccount$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.onAddAccount),
            exhaustMap((data: { account: IMappedAccount; isAddNew: boolean }) =>
                this.accountService.addCompanyAccount(data?.account).pipe(
                    map((res: { id: number }) => {
                        const newAccount: IMappedAccount = {
                            id: res?.id,
                            ...data.account,
                        };
                        return AccountActions.onAddAccountSuccess({
                            account: {
                                ...newAccount,
                            },
                        });
                    }),
                    tap(() => {
                        !data?.isAddNew && this.modalService.closeModal();
                    }),
                    catchError((error) =>
                        of(AccountActions.onAddAccountError({ error }))
                    )
                )
            )
        )
    );

    public onEditAccount$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.onEditAccount),
            exhaustMap((data: { account: IMappedAccount }) =>
                this.accountService.editCompanyAccount(data.account).pipe(
                    map(() => {
                        this.modalService.closeModal();
                        return AccountActions.onEditAccountSuccess(data);
                    }),
                    catchError((error) =>
                        of(AccountActions.onEditAccountError({ error }))
                    )
                )
            )
        )
    );

    public onDeleteAccount$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.onDeleteAccount),
            exhaustMap(
                (data: {
                    account: IMappedAccount;
                    activeModal: NgbActiveModal;
                }) => {
                    const id: number = data?.account?.id;
                    const activeModal: NgbActiveModal = data?.activeModal;

                    return from(
                        this.modalService.openModalNew(
                            NewDeleteAccountModalComponent,
                            [data.account]
                        )?.closed
                    ).pipe(
                        switchMap((isConfirmed: boolean) => {
                            if (isConfirmed)
                                return this.accountService
                                    .deleteCompanyAccount(id)
                                    .pipe(
                                        map(() => {
                                            activeModal.close();
                                            return AccountActions.onDeleteAccountSuccess(
                                                { id, activeModal }
                                            );
                                        }),
                                        catchError((error) =>
                                            of(
                                                AccountActions.onEditAccountError(
                                                    {
                                                        error,
                                                    }
                                                )
                                            )
                                        )
                                    );
                            else activeModal?.close();
                        }),
                        catchError((error) =>
                            of(AccountActions.onEditAccountError({ error }))
                        )
                    );
                }
            )
        )
    );

    public openColumnsModal$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.openColumnsModal),
            withLatestFrom(
                this.store.select(AccountSelector.frontSideDataSelector),
                this.store.select(AccountSelector.backSideDataSelector)
            ),
            switchMap(([_, frontSideData, backSideData]) => {
                const title = eSharedString.ACCOUNT_CAPITALIZED;

                const action = {
                    data: {
                        cardsAllData: AccountCardDataConfig.CARD_ALL_DATA,
                        front_side: frontSideData,
                        back_side: backSideData,
                        numberOfRows: frontSideData.length,
                        checked: true,
                    },
                    title,
                };

                return from(
                    this.modalService.openModal(
                        CardColumnsModalComponent,
                        { size: TableStringEnum.SMALL },
                        action
                    )
                ).pipe(
                    filter((result) => !!result),
                    map((result) =>
                        AccountActions.setColumnsModalResult({
                            frontSideData: result.selectedColumns.front_side
                                .slice(0, result.selectedColumns.numberOfRows)
                                .map(
                                    (front: ICardValueData) => front.inputItem
                                ),
                            backSideData: result.selectedColumns.back_side
                                .slice(0, result.selectedColumns.numberOfRows)
                                .map((back: ICardValueData) => back.inputItem),
                        })
                    )
                );
            })
        )
    );
}
