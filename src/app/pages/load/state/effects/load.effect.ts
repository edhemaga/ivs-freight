import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

// rxjs
import { catchError, exhaustMap, map, of } from 'rxjs';

// services
import { LoadService as LoadLocalService } from '@shared/services/load.service';
import { LoadService, UpdateLoadStatusCommand } from 'appcoretruckassist';
import { CommentsService } from '@shared/services/comments.service';
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// store
import * as LoadActions from '@pages/load/state/actions/load.action';

// enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums/index';

// helpers
import { LoadStoreEffectsHelper } from '@pages/load/pages/load-table/utils/helpers/load-store-effects.helper';

@Injectable()
export class LoadEffect {
    constructor(
        private actions$: Actions,

        // services
        private loadService: LoadLocalService,
        private apiLoadService: LoadService,
        private commentService: CommentsService,
        private modalService: ModalService,
        private tableService: TruckassistTableService,
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
                            showMore
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
                            showMore
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
                    map((response) => LoadActions.getLoadByIdSuccess({ load: response })),
                    catchError((error) => of(LoadActions.getLoadByIdError({ error })))
                )
            })
        )
    );

    public getLoadByIdEditModal$ = createEffect(() => 
        this.actions$.pipe(
            ofType(LoadActions.getEditLoadModalData),
            exhaustMap((action) => {
                return this.loadService.apiGetLoadModal().pipe(
                    exhaustMap((modalResponse) => {
                        const { apiParam, selectedTab, eventType } = action || {};

                        return this.loadService.apiGetLoadPossibleStatusesDropdownOptions(apiParam).pipe(
                            exhaustMap((statusDropdownResponse) => {

                                return this.loadService.apiGetLoadById(apiParam).pipe(
                                    map((loadResponse) => {
                                        LoadStoreEffectsHelper.getLoadOrTemplateByIdEditModal(this.modalService, selectedTab, eventType, loadResponse, statusDropdownResponse, modalResponse);

                                        return LoadActions.getEditLoadModalDataSuccess({ load: loadResponse, modal: modalResponse });
                                    }),
                                    catchError((error) => of(LoadActions.getEditLoadModalDataError({ error })))
                                )
                            })
                        )
                    })
                )
            })
        )
    );

    public getTemplateByIdEditModal$ = createEffect(() => 
        this.actions$.pipe(
            ofType(LoadActions.getEditLoadTemplateModalData),
            exhaustMap((action) => {
                return this.loadService.apiGetLoadModal().pipe(
                    exhaustMap((modalResponse) => {
                        const { apiParam, selectedTab, eventType } = action || {};

                        return this.loadService.apiGetLoadTemplateById(apiParam).pipe(
                            map((loadResponse) => {
                                LoadStoreEffectsHelper.getLoadOrTemplateByIdEditModal(this.modalService, selectedTab, eventType, loadResponse, null, modalResponse);

                                return LoadActions.getEditLoadTemplateModalDataSuccess({ loadTemplate: loadResponse, modal: modalResponse });
                            }),
                            catchError((error) => of(LoadActions.getEditLoadTemplateModalDataError({ error })))
                        )
                    })
                )
            })
        )
    );

    public getCreateLoadModalData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(LoadActions.getCreateLoadModalData),
            exhaustMap(() => {
                return this.loadService.apiGetLoadModal().pipe(
                    map((response) => {
                        LoadStoreEffectsHelper.getCreateLoadModalData(this.modalService, response);

                        return LoadActions.getCreateLoadModalDataSuccess({ modal: response });
                    }),
                    catchError((error) => of(LoadActions.getCreateLoadModalDataError({ error })))
                )
            })
        )
    );

    public getConvertToLoadModalData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(LoadActions.getConvertToLoadModalData),
            exhaustMap((action) => {
                return this.loadService.apiGetLoadModal().pipe(
                    exhaustMap((modalResponse) => {
                        const { apiParam, selectedTab, eventType } = action || {};

                        return this.loadService.apiGetLoadTemplateById(apiParam).pipe(
                            map((loadResponse) => {
                                LoadStoreEffectsHelper.getConvertToLoadOrTemplateModalData(this.modalService, selectedTab, eventType, loadResponse, modalResponse);

                                return LoadActions.getConvertToLoadModalDataSuccess({ load: loadResponse, modal: modalResponse });
                            }),
                            catchError((error) => of(LoadActions.getConvertToLoadModalDataError({ error })))
                        )
                    })
                )
            })
        )
    );

    public getConvertToTemplateModalData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(LoadActions.getConvertToLoadTemplateModalData),
            exhaustMap((action) => {
                return this.loadService.apiGetLoadModal().pipe(
                    exhaustMap((modalResponse) => {
                        const { apiParam, selectedTab, eventType } = action || {};

                        return this.loadService.apiGetLoadById(apiParam).pipe(
                            map((loadTemplateResponse) => {
                                LoadStoreEffectsHelper.getConvertToLoadOrTemplateModalData(this.modalService, selectedTab, eventType, loadTemplateResponse, modalResponse);

                                return LoadActions.getConvertToLoadTemplateModalDataSuccess({ loadTemplate: loadTemplateResponse, modal: modalResponse });
                            }),
                            catchError((error) => of(LoadActions.getConvertToLoadTemplateModalDataError({ error })))
                        )
                    })
                )
            })
        )
    );

    public getLoadStatusFilter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.getLoadStatusFilter),
            exhaustMap((action) => {
                const { apiParam, selectedTab } = action || {};

                return this.loadService.getLoadStatusFilter(apiParam).pipe(
                    map((dispatcherFilter) => {
                        LoadStoreEffectsHelper.getLoadStatusFilter(this.tableService, dispatcherFilter, selectedTab);

                        return LoadActions.getLoadStatusFilterSuccess({ dispatcherFilter });
                    }),
                    catchError((error) => of(LoadActions.getLoadStatusFilterError({ error })))
                )
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
                    _apiParam = LoadStoreEffectsHelper.composeUpdateLoadStatusCommand(confirmation);
                else
                    _apiParam = apiParam;

                return this.apiLoadService.apiLoadStatusPut(_apiParam).pipe(
                    map((response) => {
                        const { id: loadId } = _apiParam || {};

                        return LoadActions.updateLoadStatusSuccess({ loadId, status: response })
                    }),
                    catchError((error) => of(LoadActions.updateLoadStatusError({ error })))
                )
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

                        return LoadActions.revertLoadStatusSuccess({ loadId: id, status: response })
                    }),
                    catchError((error) => of(LoadActions.revertLoadStatusError({ error })))
                )
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
                            map((getResponse) => LoadActions.createLoadSuccess({ load: getResponse })),
                            catchError((error) => of(LoadActions.createLoadError({ error })))
                        )
                    })
                )
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

                        return LoadActions.createLoadTemplateSuccess({ loadTemplate: data })
                    }),
                    catchError((error) => of(LoadActions.createLoadTemplateError({ error })))
                )
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

                                return LoadActions.createCommentSuccess({ loadId: entityTypeId, comment: getResponse, metadata })
                            }),
                            catchError((error) => of(LoadActions.createCommentError({ error })))
                        )
                    })
                )
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

                        return this.loadService.getLoadList({ loadId: id }).pipe(
                            map((getResponse) => {
                                const { pagination } = getResponse || {};
                                const { data } = pagination || {};

                                return LoadActions.updateLoadSuccess({ load: data[0] });
                            }),
                            catchError((error) => of(LoadActions.updateLoadError({ error })))
                        )
                    })
                )
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

                        return LoadActions.updateLoadTemplateSuccess({ loadTemplate: data })
                    }),
                    catchError((error) => of(LoadActions.updateLoadTemplateError({ error })))
                )
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
                        return this.apiLoadService.apiLoadStatusPut(apiParamStatus).pipe(
                            exhaustMap((statusResponse) => {
                                const { id } = apiParamLoad || {};

                                return this.loadService.getLoadList({ loadId: id }).pipe(
                                    map((response) => LoadActions.updateLoadAndStatusSuccess({ response, status: statusResponse })),
                                    catchError((error) => of(LoadActions.updateLoadAndStatusError({ error })))
                                )
                            })
                        )
                    })
                )
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
                        return this.loadService.apiRevertLoadStatus(apiParamStatus).pipe(
                            exhaustMap((statusResponse) => {
                                const { id } = apiParamLoad || {};

                                return this.loadService.getLoadList({ loadId: id }).pipe(
                                    map((response) => LoadActions.updateLoadAndRevertStatusSuccess({ response, status: statusResponse })),
                                    catchError((error) => of(LoadActions.updateLoadAndRevertStatusError({ error })))
                                )
                            })
                        )
                    })
                )
            })
        )
    );

    public deleteLoadById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.deleteLoadById),
            exhaustMap((action) => {
                const { apiParam } = action || {};

                return this.loadService.deleteLoadById(apiParam).pipe(
                    map(() => LoadActions.deleteLoadByIdSuccess({ loadId: apiParam })),
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

                return this.loadService.apiDeleteBulkLoadTemplates(apiParam).pipe(
                    map(() => LoadActions.deleteBulkLoadSuccess({ ids: apiParam })),
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
                    map(() => LoadActions.deleteBulkLoadTemplateSuccess({ ids: apiParam })),
                    catchError((error) =>
                        of(LoadActions.deleteBulkLoadTemplateError({ error }))
                    )
                )
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

                        return LoadActions.deleteCommentByIdSuccess({ loadId, commentId: apiParam });
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
            ofType(LoadActions.getDispatcherList),
            exhaustMap((action) => {
                const { loadStatusType } = action || {};
                return this.loadService.getLoadDispatcherFilter(loadStatusType).pipe(
                    map((dispatcherList) => {

                        return LoadActions.getDispatcherListSuccess({ dispatcherList });
                    }),
                    catchError((error) =>
                        of(LoadActions.getDispatcherListError({ error }))
                    )
                );
            })
        )
    );
    // #endregion
}
