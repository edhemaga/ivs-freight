import { Injectable } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';

// RxJS
import {
    catchError,
    map,
    mergeMap,
    exhaustMap,
    switchMap,
    of,
    from,
    tap,
} from 'rxjs';

// Services
import { ModalService } from '@shared/services';
import { AccountService } from '@pages/new-account/services/account.service';

// Actions
import * as AccountActions from '@pages/new-account/state/actions/account.action';

// Components
import { NewAccountModalComponent } from '@pages/new-account/components/new-account-modal/new-account-modal.component';
import { NewDeleteAccountModalComponent } from '@pages/new-account/components/new-delete-account-modal/new-delete-account-modal.component';

// Enums
import { eGeneralActions, eSize } from '@shared/enums';

// Models
import { IMappedAccount } from '../../interfaces/mapped-account.interface';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';

@Injectable()
export class AccountEffect {
    constructor(
        private actions$: Actions,
        private accountService: AccountService,
        private modalService: ModalService
    ) {}

    public loadAccounts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.loadAccounts),
            mergeMap(() =>
                this.accountService.getAccountList().pipe(
                    map((data) => AccountActions.loadAccountsSuccess({ data })),
                    catchError((error) =>
                        of(AccountActions.loadAccountsFailure())
                    )
                )
            )
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
}
