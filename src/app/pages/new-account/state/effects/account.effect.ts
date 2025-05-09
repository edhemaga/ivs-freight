import { Injectable } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';

// RxJS
import { catchError, map, mergeMap, exhaustMap, of } from 'rxjs';

// Services
import { ModalService } from '@shared/services';
import { AccountService } from '@pages/new-account/services/account.service';

// Actions
import * as AccountActions from '@pages/new-account/state/actions/account.action';

// Components
import { NewAccountModalComponent } from '@pages/new-account/components/new-account-modal/new-account-modal.component';

// Enums
import { eGeneralActions } from '@shared/enums';
import { IMappedAccount } from '../../interfaces/mapped-account.interface';

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
            mergeMap((item) =>
                this.modalService.openModal(
                    NewAccountModalComponent,
                    {
                        size: 'medium',
                    },
                    {
                        type: item?.isEdit && eGeneralActions.EDIT_LOWERCASE,
                        id: item.id,
                    }
                )
            )
        )
    );

    public onAddAccount$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.onAddAccount),
            exhaustMap((data: { account: IMappedAccount }) =>
                this.accountService.addCompanyAccount(data.account).pipe(
                    map((res: { id: number }) => {
                        this.modalService.closeModal();
                        return AccountActions.onAddAccountSuccess({
                            account: {
                                id: res.id,
                                ...data.account,
                            },
                        });
                    }),
                    catchError((error) => {
                        return of(AccountActions.onAddAccountError({ error }));
                    })
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
                    catchError((error) => {
                        return of(AccountActions.onEditAccountError({ error }));
                    })
                )
            )
        )
    );
}
