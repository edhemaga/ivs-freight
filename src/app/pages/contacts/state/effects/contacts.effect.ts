import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

// rxjs
import {
    catchError,
    exhaustMap,
    filter,
    forkJoin,
    map,
    of,
    tap,
    withLatestFrom,
} from 'rxjs';

// services
import { CompanyContactResponse } from 'appcoretruckassist';
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ContactsService } from '@shared/services/contacts.service';

// store
import * as ContactActions from '@pages/contacts/state/actions/contacts.action';
import { Store } from '@ngrx/store';

// helpers
import { ContactStoreEffectsHelper } from '@pages/contacts/utils/helpers/contact-store-effects.helper';
import { eGeneralActions } from '@shared/enums';
import {
    contactLabelsColorSelector,
    modalDataSelector,
} from '../selectors/contacts.selector';

@Injectable()
export class ContactEffect {
    constructor(
        private actions$: Actions,

        // services
        private contactsService: ContactsService,
        private modalService: ModalService,
        private tableService: TruckassistTableService,

        // store
        private store: Store
    ) {}

    // #region HTTP READ
    public getContactList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ContactActions.getContactsPayload),
            exhaustMap((action) => {
                const { onSearch, showMore } = action || {};

                return this.contactsService
                    .getContacts(
                        onSearch?.labelId,
                        onSearch?.pageIndex,
                        onSearch?.pageSize,
                        onSearch?.companyId,
                        onSearch?.sort,
                        onSearch?.searchOne,
                        onSearch?.searchTwo,
                        onSearch?.searchThree
                    )
                    .pipe(
                        map((contactPagination) => {
                            const { pagination } = contactPagination || {};
                            const { data } = pagination || {};

                            return ContactActions.getContactsPayloadSuccess({
                                data,
                                tableCount: contactPagination.count,
                                showMore,
                            });
                        }),
                        catchError((error) =>
                            of(
                                ContactActions.getContactsPayloadError({
                                    error,
                                })
                            )
                        )
                    );
            })
        )
    );

    public getContactListInitial$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ContactActions.getInitialContacts),
            exhaustMap((action) => {
                const { showMore } = action || {};

                return forkJoin([
                    this.contactsService.getContacts(null, 1, 25),
                    this.contactsService.companyContactLabelsColorList(),
                    this.contactsService.getCompanyContactModal(),
                ]).pipe(
                    map(([contactPagination, contactColors, contactLabels]) => {
                        const { pagination } = contactPagination || {};
                        const { data } = pagination || {};

                        return ContactActions.getInitialContactsSuccess({
                            data,
                            contactColors,
                            contactLabels,
                            tableCount: contactPagination.count,
                            showMore,
                        });
                    }),
                    catchError((error) =>
                        of(ContactActions.getInitialContactsError({ error }))
                    )
                );
            })
        )
    );

    public getContactColorLabelsList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ContactActions.getContactColorLabelsList),
            withLatestFrom(this.store.select(contactLabelsColorSelector)),
            tap((data) => {
                if (!!data[1]) {
                    this.store.dispatch(
                        ContactActions.getContactColorLabelsListSuccess({
                            contactColors: data[1],
                        })
                    );
                }
            }),
            filter((data) => {
                return !data[1];
            }),
            exhaustMap(() => {
                return this.contactsService
                    .companyContactLabelsColorList()
                    .pipe(
                        map((response) => {
                            return ContactActions.getContactColorLabelsListSuccess(
                                {
                                    contactColors: response,
                                }
                            );
                        }),
                        catchError((error) =>
                            of(
                                ContactActions.getContactColorLabelsListError({
                                    error,
                                })
                            )
                        )
                    );
            })
        )
    );

    public getCreateContactModalData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ContactActions.getCreateContactModalData),
            exhaustMap(() => {
                return this.contactsService.getCompanyContactModal().pipe(
                    map((response) => {
                        ContactStoreEffectsHelper.getCreateContactModalData(
                            this.modalService,
                            response
                        );

                        return ContactActions.getCreateContactModalDataSuccess({
                            modal: response,
                        });
                    }),
                    catchError((error) =>
                        of(
                            ContactActions.getCreateContactModalDataError({
                                error,
                            })
                        )
                    )
                );
            })
        )
    );

    public getContactModalData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ContactActions.getContactModalData),
            withLatestFrom(this.store.select(modalDataSelector)),
            tap((data) => {
                if (data[0].isGetNewData) return;
                if (!!data[1]) {
                    this.store.dispatch(
                        ContactActions.getCreateContactModalDataSuccess({
                            modal: data[1],
                        })
                    );
                }
            }),
            filter((data) => {
                return data[0].isGetNewData || !data[1];
            }),
            exhaustMap(() => {
                return this.contactsService.getCompanyContactModal().pipe(
                    map((response) => {
                        return ContactActions.getCreateContactModalDataSuccess({
                            modal: response,
                        });
                    }),
                    catchError((error) =>
                        of(
                            ContactActions.getCreateContactModalDataError({
                                error,
                            })
                        )
                    )
                );
            })
        )
    );

    // #region HTTP WRITE
    public createContact$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ContactActions.createContact),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.contactsService.addCompanyContact(apiParam).pipe(
                    exhaustMap((createResponse) => {
                        const { id } = createResponse || {};

                        return this.contactsService
                            .getCompanyContactById(id)
                            .pipe(
                                exhaustMap(
                                    (contact: CompanyContactResponse) => {
                                        return forkJoin([
                                            this.contactsService.companyContactLabelsColorList(),
                                            this.contactsService.getCompanyContactModal(),
                                        ]).pipe(
                                            map(([colorRes, { labels }]) => {
                                                labels = labels.map((label) => {
                                                    return {
                                                        ...label,
                                                        dropLabel: true,
                                                    };
                                                });

                                                const newContact = {
                                                    ...contact,
                                                    colorLabels: labels,
                                                    colorRes,
                                                };

                                                this.tableService.sendActionAnimation(
                                                    {
                                                        animation:
                                                            eGeneralActions.ADD,
                                                        data: contact,
                                                        id: contact.id,
                                                    }
                                                );

                                                return ContactActions.createContactSuccess(
                                                    {
                                                        contact: newContact,
                                                    }
                                                );
                                            }),
                                            catchError((error) =>
                                                of(
                                                    ContactActions.createContactError(
                                                        { error }
                                                    )
                                                )
                                            )
                                        );
                                    }
                                )
                            );
                    })
                );
            })
        )
    );

    public updateContact$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ContactActions.updateContact),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.contactsService.updateCompanyContact(apiParam).pipe(
                    exhaustMap((updateResponse) => {
                        const { id } = apiParam || {};

                        return this.contactsService
                            .getCompanyContactById(id)
                            .pipe(
                                map((getResponse: CompanyContactResponse) => {
                                    this.tableService.sendActionAnimation({
                                        animation: eGeneralActions.UPDATE,
                                        data: getResponse,
                                        id: getResponse.id,
                                    });

                                    return ContactActions.updateContactSuccess({
                                        contact: getResponse,
                                    });
                                }),
                                catchError((error) =>
                                    of(
                                        ContactActions.updateContactError({
                                            error,
                                        })
                                    )
                                )
                            );
                    })
                );
            })
        )
    );

    public deleteContactById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ContactActions.deleteContactById),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.contactsService
                    .deleteCompanyContactById(apiParam)
                    .pipe(
                        map(() => {
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.DELETE,
                                id: apiParam,
                            });

                            return ContactActions.deleteContactByIdSuccess({
                                contactId: apiParam,
                            });
                        }),
                        catchError((error) =>
                            of(ContactActions.deleteContactByIdError({ error }))
                        )
                    );
            })
        )
    );

    public deleteBulkContact$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ContactActions.deleteBulkContact),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.contactsService.deleteContactList(apiParam).pipe(
                    tap(() => {
                        apiParam.forEach((contactId) => {
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.DELETE,
                                id: contactId,
                            });
                        });

                        this.tableService.sendRowsSelected([]);
                        this.tableService.sendResetSelectedColumns(true);
                    }),
                    map(() =>
                        ContactActions.deleteBulkContactSuccess({
                            ids: apiParam,
                        })
                    ),
                    catchError((error) => {
                        return of(
                            ContactActions.deleteBulkContactError({ error })
                        );
                    })
                );
            })
        )
    );
    // #endregion
}
