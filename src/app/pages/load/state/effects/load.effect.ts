import { Injectable } from '@angular/core';
import { act, Actions, createEffect, ofType } from '@ngrx/effects';

// rxjs
import {
    catchError,
    exhaustMap,
    filter,
    map,
    of,
    tap,
    withLatestFrom,
} from 'rxjs';

// services
import { LoadService as LoadLocalService } from '@shared/services/load.service';
import { LoadService, UpdateLoadStatusCommand } from 'appcoretruckassist';
import { CommentsService } from '@shared/services/comments.service';
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { BrokerService } from '@pages/customer/services';

// store
import * as LoadActions from '@pages/load/state/actions/load.action';
import { Store } from '@ngrx/store';
import {
    activeLoadModalDataSelector,
    staticModalDataSelector,
} from '@pages/load/state/selectors/load.selector';

// enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums/index';

// helpers
import { LoadStoreEffectsHelper } from '@pages/load/pages/load-table/utils/helpers';

@Injectable()
export class LoadEffect {
    constructor(
        private actions$: Actions,

        // services
        private loadService: LoadLocalService,
        private brokerService: BrokerService,
        private apiLoadService: LoadService,
        private commentService: CommentsService,
        private modalService: ModalService,
        private tableService: TruckassistTableService,

        // store
        private store: Store
    ) {}

    // #region HTTP READ
    public getLoadList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.getLoadsPayload),
            exhaustMap((action) => {
                const { apiParam, showMore } = action || {};
                const { statusType } = apiParam || {};

                return this.loadService.getLoadList(apiParam).pipe(
                    map((response) => {
                        const {
                            pagination,
                            templateCount,
                            pendingCount,
                            activeCount,
                            closedCount,
                        } = response || {};
                        const { data } = pagination || {};

                        return LoadActions.getLoadsPayloadSuccess({
                            data,
                            templateCount,
                            pendingCount,
                            activeCount,
                            closedCount,
                            selectedTab: statusType,
                            showMore,
                        });
                    }),
                    catchError((error) =>
                        of(LoadActions.getLoadsPayloadError({ error }))
                    )
                );
            })
        )
    );

    public getTemplateList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.getTemplatesPayload),
            exhaustMap((action) => {
                const { apiParam, showMore } = action || {};

                return this.loadService.getLoadTemplateList(apiParam).pipe(
                    map((response) => {
                        const {
                            pagination,
                            templateCount,
                            pendingCount,
                            activeCount,
                            closedCount,
                        } = response || {};
                        const { data } = pagination || {};

                        return LoadActions.getTemplatesPayloadSuccess({
                            data,
                            templateCount,
                            pendingCount,
                            activeCount,
                            closedCount,
                            selectedTab: eLoadStatusType.Template,
                            showMore,
                        });
                    }),
                    catchError((error) =>
                        of(LoadActions.getTemplatesPayloadError({ error }))
                    )
                );
            })
        )
    );

    public getLoadById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.getLoadById),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.loadService.apiGetLoadById(apiParam).pipe(
                    map((response) =>
                        LoadActions.getLoadByIdSuccess({ load: response })
                    ),
                    catchError((error) =>
                        of(LoadActions.getLoadByIdError({ error }))
                    )
                );
            })
        )
    );

    public getLoadByIdEditModal$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.getEditLoadModalData),
            withLatestFrom(this.store.select(activeLoadModalDataSelector)),
            tap((data) => {
                const { selectedTab, eventType } = data[0];

                LoadStoreEffectsHelper.getLoadOrTemplateByIdEditModal(
                    this.modalService,
                    selectedTab,
                    eventType
                );
            }),
            filter((data) => {
                return !data[1];
            }),
            exhaustMap((data) => {
                return this.loadService.apiGetLoadModal().pipe(
                    exhaustMap((modalResponse) => {
                        const { apiParam } = data[0] || {};

                        return this.loadService
                            .apiGetLoadPossibleStatusesDropdownOptions(apiParam)
                            .pipe(
                                exhaustMap((statusDropdownResponse) => {
                                    return this.loadService
                                        .apiGetLoadById(apiParam)
                                        .pipe(
                                            map((loadResponse) => {
                                                return LoadActions.getEditLoadModalDataSuccess(
                                                    {
                                                        load: loadResponse,
                                                        modal: modalResponse,
                                                    }
                                                );
                                            }),
                                            catchError((error) =>
                                                of(
                                                    LoadActions.getEditLoadModalDataError(
                                                        { error }
                                                    )
                                                )
                                            )
                                        );
                                })
                            );
                    })
                );
            })
        )
    );

    public getTemplateByIdEditModal$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.getEditLoadTemplateModalData),
            withLatestFrom(
                this.store.select(activeLoadModalDataSelector),
                this.store.select(staticModalDataSelector)
            ),
            tap((data) => {
                const { selectedTab, eventType } = data[0];

                LoadStoreEffectsHelper.getLoadOrTemplateByIdEditModal(
                    this.modalService,
                    selectedTab,
                    eventType
                );
            }),
            filter((data) => {
                return !data[1];
            }),
            exhaustMap((data) => {
                return this.loadService.apiGetLoadModal().pipe(
                    exhaustMap((modalResponse) => {
                        const { apiParam } = data[0];

                        return this.loadService
                            .apiGetLoadTemplateById(apiParam)
                            .pipe(
                                map((loadResponse) => {
                                    return LoadActions.getEditLoadTemplateModalDataSuccess(
                                        {
                                            loadTemplate: loadResponse,
                                            modal: modalResponse,
                                        }
                                    );
                                }),
                                catchError((error) =>
                                    of(
                                        LoadActions.getEditLoadTemplateModalDataError(
                                            { error }
                                        )
                                    )
                                )
                            );
                    })
                );
            })
        )
    );

    public getCreateLoadModalData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.getCreateLoadModalData),
            withLatestFrom(
                this.store.select(staticModalDataSelector),
                this.store.select(activeLoadModalDataSelector)
            ),
            tap((data) => {
                if (!!data[1]) {
                    LoadStoreEffectsHelper.getCreateLoadModalData(
                        this.modalService
                    );

                    this.store.dispatch(
                        LoadActions.getCreateLoadModalDataSuccess({
                            modal: data[1],
                            activeLoadModalData: data[2],
                        })
                    );
                }
            }),
            filter((data) => {
                return !data[1];
            }),
            exhaustMap(() => {
                return this.loadService.apiGetLoadModal().pipe(
                    tap((response) =>
                        LoadStoreEffectsHelper.getCreateLoadModalData(
                            this.modalService
                        )
                    ),
                    map((response) => {
                        return LoadActions.getCreateLoadModalDataSuccess({
                            modal: response,
                        });
                    }),
                    catchError((error) =>
                        of(LoadActions.getCreateLoadModalDataError({ error }))
                    )
                );
            })
        )
    );

    public getConvertToLoadModalData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.getConvertToLoadModalData),
            tap((action) => {
                const { selectedTab, eventType } = action;

                LoadStoreEffectsHelper.getConvertToLoadOrTemplateModalData(
                    this.modalService,
                    selectedTab,
                    eventType
                );
            }),
            exhaustMap((action) => {
                return this.loadService.apiGetLoadModal().pipe(
                    exhaustMap((modalResponse) => {
                        const { apiParam } = action || {};

                        return this.loadService
                            .apiGetLoadTemplateById(apiParam)
                            .pipe(
                                map((loadResponse) => {
                                    return LoadActions.getConvertToLoadModalDataSuccess(
                                        {
                                            load: loadResponse,
                                            modal: modalResponse,
                                        }
                                    );
                                }),
                                catchError((error) =>
                                    of(
                                        LoadActions.getConvertToLoadModalDataError(
                                            { error }
                                        )
                                    )
                                )
                            );
                    })
                );
            })
        )
    );

    public getConvertToTemplateModalData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.getConvertToLoadTemplateModalData),
            tap((action) => {
                const { selectedTab, eventType } = action;

                LoadStoreEffectsHelper.getConvertToLoadOrTemplateModalData(
                    this.modalService,
                    selectedTab,
                    eventType
                );
            }),
            exhaustMap((action) => {
                return this.loadService.apiGetLoadModal().pipe(
                    exhaustMap((modalResponse) => {
                        const { apiParam } = action || {};

                        return this.loadService.apiGetLoadById(apiParam).pipe(
                            map((loadTemplateResponse) => {
                                return LoadActions.getConvertToLoadTemplateModalDataSuccess(
                                    {
                                        loadTemplate: loadTemplateResponse,
                                        modal: modalResponse,
                                    }
                                );
                            }),
                            catchError((error) =>
                                of(
                                    LoadActions.getConvertToLoadTemplateModalDataError(
                                        { error }
                                    )
                                )
                            )
                        );
                    })
                );
            })
        )
    );

    public getLoadStatusFilter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.getLoadStatusFilter),
            exhaustMap((action) => {
                const { loadStatusType } = action || {};
                return this.loadService
                    .getLoadStatusFilter(loadStatusType)
                    .pipe(
                        map((statusList) => {
                            return LoadActions.getLoadStatusFilterSuccess({
                                statusList,
                            });
                        }),
                        catchError((error) =>
                            of(LoadActions.getLoadStatusFilterError({ error }))
                        )
                    );
            })
        )
    );
    // #endregion

    // #region HTTP WRITE
    public updateLoadStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.updateLoadStatus),
            exhaustMap((action) => {
                const { apiParam, confirmation } = action || {};
                let _apiParam: UpdateLoadStatusCommand;

                if (confirmation)
                    _apiParam =
                        LoadStoreEffectsHelper.composeUpdateLoadStatusCommand(
                            confirmation
                        );
                else _apiParam = apiParam;

                return this.apiLoadService.apiLoadStatusPut(_apiParam).pipe(
                    map((response) => {
                        const { id: loadId } = _apiParam || {};

                        return LoadActions.updateLoadStatusSuccess({
                            loadId,
                            status: response,
                        });
                    }),
                    catchError((error) =>
                        of(LoadActions.updateLoadStatusError({ error }))
                    )
                );
            })
        )
    );

    public revertLoadStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.revertLoadStatus),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.loadService.apiRevertLoadStatus(apiParam).pipe(
                    map((response) => {
                        const { id } = apiParam;

                        return LoadActions.revertLoadStatusSuccess({
                            loadId: id,
                            status: response,
                        });
                    }),
                    catchError((error) =>
                        of(LoadActions.revertLoadStatusError({ error }))
                    )
                );
            })
        )
    );

    // TODO: awaits for CAR-2848 to be done from BE
    public createLoad$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.createLoad),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.loadService.apiCreateLoad(apiParam).pipe(
                    exhaustMap((createResponse) => {
                        // TODO: cast to any type because response type and data are not redudant
                        const { data } = <any>createResponse || {};
                        const { id } = data || {};

                        return this.loadService.apiGetLoadById(id).pipe(
                            map((getResponse) =>
                                LoadActions.createLoadSuccess({
                                    load: getResponse,
                                })
                            ),
                            catchError((error) =>
                                of(LoadActions.createLoadError({ error }))
                            )
                        );
                    })
                );
            })
        )
    );

    public createLoadTemplate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.createLoadTemplate),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.loadService.apiCreateLoadTemplate(apiParam).pipe(
                    map((createResponse) => {
                        const { data } = createResponse || {};

                        return LoadActions.createLoadTemplateSuccess({
                            loadTemplate: data,
                        });
                    }),
                    catchError((error) =>
                        of(LoadActions.createLoadTemplateError({ error }))
                    )
                );
            })
        )
    );

    public createComment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.createComment),
            exhaustMap((action) => {
                const { apiParam, metadata } = action || {};

                return this.loadService.apiCreateComment(apiParam).pipe(
                    exhaustMap((createResponse) => {
                        const { id } = createResponse || {};

                        return this.loadService.apiGetCommentById(id).pipe(
                            map((getResponse) => {
                                const { entityTypeId } = apiParam || {};

                                return LoadActions.createCommentSuccess({
                                    loadId: entityTypeId,
                                    comment: getResponse,
                                    metadata,
                                });
                            }),
                            catchError((error) =>
                                of(LoadActions.createCommentError({ error }))
                            )
                        );
                    })
                );
            })
        )
    );

    public updateLoad$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.updateLoad),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.loadService.apiUpdateLoad(apiParam).pipe(
                    exhaustMap((updateResponse) => {
                        const { id } = updateResponse || {};

                        return this.loadService
                            .getLoadList({ loadId: id })
                            .pipe(
                                map((getResponse) => {
                                    const { pagination } = getResponse || {};
                                    const { data } = pagination || {};

                                    return LoadActions.updateLoadSuccess({
                                        load: data[0],
                                    });
                                }),
                                catchError((error) =>
                                    of(LoadActions.updateLoadError({ error }))
                                )
                            );
                    })
                );
            })
        )
    );

    public updateLoadTemplate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.updateLoadTemplate),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.loadService.apiUpdateLoadTemplate(apiParam).pipe(
                    map((updateResponse) => {
                        const { data } = updateResponse || {};

                        return LoadActions.updateLoadTemplateSuccess({
                            loadTemplate: data,
                        });
                    }),
                    catchError((error) =>
                        of(LoadActions.updateLoadTemplateError({ error }))
                    )
                );
            })
        )
    );

    public updateLoadAndStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.updateLoadAndStatus),
            exhaustMap((action) => {
                const { apiParamLoad, apiParamStatus } = action || {};

                return this.loadService.apiUpdateLoad(apiParamLoad).pipe(
                    exhaustMap(() => {
                        return this.apiLoadService
                            .apiLoadStatusPut(apiParamStatus)
                            .pipe(
                                exhaustMap((statusResponse) => {
                                    const { id } = apiParamLoad || {};

                                    return this.loadService
                                        .getLoadList({ loadId: id })
                                        .pipe(
                                            map((response) =>
                                                LoadActions.updateLoadAndStatusSuccess(
                                                    {
                                                        response,
                                                        status: statusResponse,
                                                    }
                                                )
                                            ),
                                            catchError((error) =>
                                                of(
                                                    LoadActions.updateLoadAndStatusError(
                                                        { error }
                                                    )
                                                )
                                            )
                                        );
                                })
                            );
                    })
                );
            })
        )
    );

    public updateLoadAndRevertStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.updateLoadAndRevertStatus),
            exhaustMap((action) => {
                const { apiParamLoad, apiParamStatus } = action || {};

                return this.loadService.apiUpdateLoad(apiParamLoad).pipe(
                    exhaustMap(() => {
                        return this.loadService
                            .apiRevertLoadStatus(apiParamStatus)
                            .pipe(
                                exhaustMap((statusResponse) => {
                                    const { id } = apiParamLoad || {};

                                    return this.loadService
                                        .getLoadList({ loadId: id })
                                        .pipe(
                                            map((response) =>
                                                LoadActions.updateLoadAndRevertStatusSuccess(
                                                    {
                                                        response,
                                                        status: statusResponse,
                                                    }
                                                )
                                            ),
                                            catchError((error) =>
                                                of(
                                                    LoadActions.updateLoadAndRevertStatusError(
                                                        { error }
                                                    )
                                                )
                                            )
                                        );
                                })
                            );
                    })
                );
            })
        )
    );

    public deleteLoadById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.deleteLoadById),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.loadService.deleteLoadById(apiParam).pipe(
                    map(() =>
                        LoadActions.deleteLoadByIdSuccess({ loadId: apiParam })
                    ),
                    catchError((error) =>
                        of(LoadActions.deleteLoadByIdError({ error }))
                    )
                );
            })
        )
    );

    public deleteLoadTemplateById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.deleteLoadTemplateById),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.loadService.deleteLoadTemplateById(apiParam).pipe(
                    map(() =>
                        LoadActions.deleteLoadTemplateByIdSuccess({
                            loadTemplateId: apiParam,
                        })
                    ),
                    catchError((error) =>
                        of(LoadActions.deleteLoadTemplateByIdError({ error }))
                    )
                );
            })
        )
    );

    public deleteBulkLoad$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.deleteBulkLoad),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.loadService
                    .apiDeleteBulkLoadTemplates(apiParam)
                    .pipe(
                        map(() =>
                            LoadActions.deleteBulkLoadSuccess({ ids: apiParam })
                        ),
                        catchError((error) =>
                            of(LoadActions.deleteBulkLoadError({ error }))
                        )
                    );
            })
        )
    );

    public deleteBulkLoadTemplate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.deleteBulkLoadTemplate),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.loadService.apiDeleteBulkLoads(apiParam).pipe(
                    map(() =>
                        LoadActions.deleteBulkLoadTemplateSuccess({
                            ids: apiParam,
                        })
                    ),
                    catchError((error) =>
                        of(LoadActions.deleteBulkLoadTemplateError({ error }))
                    )
                );
            })
        )
    );

    public deleteCommentById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.deleteCommentById),
            exhaustMap((action) => {
                const { apiParam, loadId } = action || {};

                return this.commentService.deleteCommentById(apiParam).pipe(
                    map(() => {
                        return LoadActions.deleteCommentByIdSuccess({
                            loadId,
                            commentId: apiParam,
                        });
                    }),
                    catchError((error) =>
                        of(LoadActions.deleteCommentByIdError({ error }))
                    )
                );
            })
        )
    );

    public getDispatcherList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.getLoadDetailsById),
            exhaustMap((action) => {
                const { loadId } = action || {};
                return this.loadService.getLoadById(loadId).pipe(
                    map((details) => {
                        return LoadActions.getLoadDetails({
                            details,
                        });
                    }),
                    catchError((error) =>
                        of(LoadActions.getLoadDetailsError({ error }))
                    )
                );
            })
        )
    );
    // #endregion

    public getLoadDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.getDispatcherList),
            exhaustMap((action) => {
                const { loadStatusType } = action || {};
                return this.loadService
                    .getLoadDispatcherFilter(loadStatusType)
                    .pipe(
                        map((dispatcherList) => {
                            return LoadActions.getDispatcherListSuccess({
                                dispatcherList,
                            });
                        }),
                        catchError((error) =>
                            of(LoadActions.getDispatcherListError({ error }))
                        )
                    );
            })
        )
    );
}
