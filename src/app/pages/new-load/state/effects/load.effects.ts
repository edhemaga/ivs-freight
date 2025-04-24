import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// rxjs
import {
    catchError,
    exhaustMap,
    filter,
    map,
    switchMap,
    withLatestFrom,
} from 'rxjs/operators';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';

// ngrx
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

// Actions
import * as LoadActions from '@pages/new-load/state/actions/load.actions';

// Service
import { LoadService } from '@pages/new-load/services/load.service';
import { ModalService } from '@shared/services';

// Selector
import * as LoadSelectors from '@pages/new-load/state/selectors/load.selectors';

// Components
import { NewLoadModalComponent } from '@pages/new-load/pages/new-load-modal/new-load-modal.component';
import { CaChangeStatusModalComponent } from '@shared/components/ta-shared-modals/ca-change-status-modal/ca-change-status-modal.component';

// Models
import {
    LoadTemplateListResponse,
    LoadListResponse,
    DispatcherFilterResponse,
    LoadStatusFilterResponse,
    UpdateLoadStatusCommand,
    LoadStatus,
    LoadSortBy,
    SortOrder,
    LoadDriverInfo,
} from 'appcoretruckassist';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eLoadRouting, eLoadStatusStringType } from '@pages/new-load/enums';

// Interfaces
import { IStateFilters } from '@shared/interfaces';

// Selectors
import {
    loadIdLoadStatusChangeSelector,
    selectedLoadForStatusChangeSelector,
} from '@pages/new-load/state/selectors/load.selectors';

// Helpers
import { LoadStoreHelper } from '@pages/new-load/utils/helpers';

@Injectable()
export class LoadEffect {
    constructor(
        // Services
        private modalService: ModalService,
        private loadService: LoadService,

        // Store
        private actions$: Actions,
        private store: Store,

        private router: Router
    ) {}

    //#region List Data
    public getLoadList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                LoadActions.getLoadsPayload,
                LoadActions.getLoadsPayloadOnTabTypeChange
            ),
            withLatestFrom(
                this.store.select(LoadSelectors.selectedTabSelector),
                this.store.select(LoadSelectors.filtersSelector),
                this.store.select(LoadSelectors.pageSelector)
            ),
            exhaustMap(([action, mode, filters, page]) =>
                this.getLoadData(mode, false, filters, page).pipe(
                    map(
                        ({
                            loadResponse,
                            dispatcherFilters,
                            statusFilters,
                        }) => {
                            this.store.dispatch(
                                LoadActions.setFilterDropdownList({
                                    dispatcherFilters,
                                    statusFilters,
                                })
                            );

                            return LoadActions.getLoadsPayloadSuccess({
                                payload: loadResponse,
                            });
                        }
                    )
                )
            )
        )
    );
    //#endregion

    public getLoadsOnPageChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.getLoadsOnPageChange),
            withLatestFrom(
                this.store.select(LoadSelectors.selectedTabSelector),
                this.store.select(LoadSelectors.filtersSelector),
                this.store.select(LoadSelectors.pageSelector),
                this.store.select(LoadSelectors.tableSettingsSelector)
            ),
            exhaustMap(([action, mode, filters, page, tableSettings]) => {
                return this.getLoadData(
                    mode,
                    true,
                    filters,
                    page + 1,
                    tableSettings.sortDirection,
                    tableSettings.sortKey as LoadSortBy
                ).pipe(
                    map(({ loadResponse }) =>
                        LoadActions.getLoadsPagePayloadSuccess({
                            payload: loadResponse,
                        })
                    )
                );
            })
        )
    );
    //#region  Filters
    public getLoadsOnFilterChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                LoadActions.onFiltersChange,
                LoadActions.onSeachFilterChange
            ),
            withLatestFrom(
                this.store.select(LoadSelectors.selectedTabSelector),
                this.store.select(LoadSelectors.filtersSelector),
                this.store.select(LoadSelectors.tableSettingsSelector)
            ),
            exhaustMap(([action, mode, filters, tableSettings]) =>
                this.getLoadData(
                    mode,
                    true,
                    filters,
                    1,
                    tableSettings.sortDirection,
                    tableSettings.sortKey as LoadSortBy
                ).pipe(
                    map(({ loadResponse }) =>
                        LoadActions.getLoadsPayloadSuccess({
                            payload: loadResponse,
                        })
                    )
                )
            )
        )
    );
    //#endregion

    //#region sorting
    public getLoadsOnSortingChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.tableSortingChange),
            withLatestFrom(
                this.store.select(LoadSelectors.selectedTabSelector),
                this.store.select(LoadSelectors.filtersSelector),
                this.store.select(LoadSelectors.tableSettingsSelector),
                this.store.select(LoadSelectors.pageSelector)
            ),
            exhaustMap(([action, mode, filters, tableSettings, page]) =>
                this.getLoadData(
                    mode,
                    true,
                    filters,
                    page,
                    tableSettings.sortDirection,
                    tableSettings.sortKey as LoadSortBy
                ).pipe(
                    map(({ loadResponse }) =>
                        LoadActions.getLoadsPayloadSuccess({
                            payload: loadResponse,
                        })
                    )
                )
            )
        )
    );

    //#endregion

    //#region Modal actions
    public onOpenLoadModal$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LoadActions.onOpenLoadModal),
                map(({ modal }) =>
                    this.modalService.openModal(
                        NewLoadModalComponent,
                        {},
                        modal
                    )
                )
            ),
        { dispatch: false }
    );

    //#endregion

    //#region Details
    public goToLoadDetails$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LoadActions.onLoadDetailsAction),
                map(({ id }) => {
                    this.router.navigate([
                        `/${eLoadRouting.LIST}/${id}/${eLoadRouting.DETAILS}`,
                    ]);
                })
            ),
        { dispatch: false }
    );

    public getLoadById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.onGetLoadById),
            exhaustMap((action) => {
                const { id } = action || {};

                return forkJoin({
                    load: this.loadService.apiGetLoadById(id),
                    minimalList:
                        this.loadService.apiGetLoadDetailsMinimalList(),
                }).pipe(
                    switchMap(({ load, minimalList }) => {
                        const mapLocations = load.stops.map(
                            ({ shipper: { longitude, latitude } }) => ({
                                longitude,
                                latitude,
                            })
                        );

                        return this.loadService
                            .apiGetLoadDetailsRouting(mapLocations)
                            .pipe(
                                map((mapRoutes) =>
                                    LoadActions.onGetLoadByIdSuccess({
                                        load,
                                        minimalList,
                                        mapRoutes,
                                    })
                                )
                            );
                    }),
                    catchError((error) => {
                        this.router.navigate([`/${eLoadRouting.LIST}`]);
                        return of(LoadActions.onGetLoadByIdError());
                    })
                );
            })
        )
    );

    //#endregion

    //#region
    public refreshFilters$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                LoadActions.openChangeStatuDropdown,
                LoadActions.revertLoadStatusSuccess,
                LoadActions.onDeleteLoadSuccess,
                LoadActions.onDeleteLoadListSuccess
            ),
            withLatestFrom(
                this.store.select(LoadSelectors.selectedTabSelector)
            ),
            filter(
                ([_, selectedTab]) =>
                    selectedTab !== eLoadStatusStringType.TEMPLATE
            ),
            switchMap(([_, selectedTab]) => {
                return forkJoin({
                    dispatcherFilters:
                        this.loadService.getDispatcherFilters(selectedTab),
                    statusFilters:
                        this.loadService.getStatusFilters(selectedTab),
                }).pipe(
                    map(({ dispatcherFilters, statusFilters }) => {
                        return LoadActions.setFilterDropdownList({
                            dispatcherFilters,
                            statusFilters,
                        });
                    })
                );
            })
        )
    );

    //#endregion

    //#region Delete load
    public onDeleteLoadList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.onDeleteLoadList),
            switchMap((action) => {
                const { isTemplate, count, selectedIds } = action;

                return this.loadService
                    .deleteLoads(selectedIds, isTemplate, count === 1)
                    .pipe(
                        map(() =>
                            LoadActions.onDeleteLoadListSuccess({ selectedIds })
                        )
                    );
            })
        )
    );

    public onDeleteLoadListTemplate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.onDeleteLoad),
            switchMap(({ id, isTemplate, isDetailsPage }) => {
                return this.loadService
                    .deleteLoads([id], isTemplate, true)
                    .pipe(
                        map(() => {
                            if (isDetailsPage) {
                                this.router.navigate([`/${eLoadRouting.LIST}`]);
                            }

                            return LoadActions.onDeleteLoadListSuccess({
                                selectedIds: [id],
                            });
                        })
                    );
            })
        )
    );
    //#endregion

    //#region Get load list
    private getLoadData(
        mode: string,
        isFilterChange: boolean,
        filters: IStateFilters,
        page?: number,
        sortOrder?: SortOrder,
        sortBy?: LoadSortBy
    ): Observable<{
        loadResponse: LoadTemplateListResponse | LoadListResponse;
        dispatcherFilters: DispatcherFilterResponse[];
        statusFilters: LoadStatusFilterResponse[];
    }> {
        const tabValue = eLoadStatusType[mode];
        const isTemplate = tabValue === eLoadStatusType.Template;

        const loadRequest$ = isTemplate
            ? this.loadService.getLoadTemplateList(
                  filters,
                  page,
                  sortOrder,
                  sortBy
              )
            : this.loadService.getLoadList(
                  tabValue,
                  filters,
                  page,
                  sortOrder,
                  sortBy
              );

        // On filter change or on template we don't have to update filter dropdown list
        const dispatcherFilters$ =
            isTemplate || isFilterChange
                ? of([])
                : this.loadService.getDispatcherFilters(tabValue);

        const statusFilters$ =
            isTemplate || isFilterChange
                ? of([])
                : this.loadService.getStatusFilters(tabValue);

        return forkJoin({
            loadResponse: loadRequest$,
            dispatcherFilters: dispatcherFilters$,
            statusFilters: statusFilters$,
        });
    }

    //#region Change load status
    public openChangeStatusDropdown$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.openChangeStatuDropdown),
            exhaustMap((action) => {
                const { loadId } = action || {};

                return this.loadService
                    .getLoadStatusDropdownOptions(loadId)
                    .pipe(
                        map((response) => {
                            return LoadActions.openChangeStatuDropdownSuccess({
                                possibleStatuses: response,
                                loadId,
                            });
                        }),
                        catchError((error) =>
                            of(
                                LoadActions.openChangeStatuDropdownError({
                                    error,
                                })
                            )
                        )
                    );
            })
        )
    );

    public updateLoadStatusRegular$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.updateLoadStatusRegular),
            withLatestFrom(
                this.store.select(LoadSelectors.loadIdLoadStatusChangeSelector)
            ),
            exhaustMap(([action, loadId]) => {
                const { status } = action || {};
                const updateLoadStatusCommand: UpdateLoadStatusCommand =
                    action.updateLoadStatusCommand ?? {
                        status: status.statusValue.name as LoadStatus,
                        id: loadId,
                    };

                return this.loadService
                    .apiUpdateLoadStatus(updateLoadStatusCommand)
                    .pipe(
                        exhaustMap((response) => {
                            return this.loadService.apiGetLoadById(loadId).pipe(
                                map((load) => {
                                    return LoadActions.updateLoadStatusSuccess({
                                        status: response,
                                        load,
                                    });
                                }),
                                catchError((error) =>
                                    of(
                                        LoadActions.updateLoadStatusError({
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

    public updateLoadStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.updateLoadStatus),
            withLatestFrom(
                this.store.select(
                    LoadSelectors.selectedLoadForStatusChangeSelector
                ),
                this.store.select(LoadSelectors.selectedTabSelector)
            ),
            exhaustMap(([action, load, selectedTab]) => {
                const { status } = action || {};
                const driverInfo = load.driverInfo as LoadDriverInfo;
                const currentStatus = load.status;
                const isActiveTab = selectedTab === eLoadStatusStringType.ACTIVE

                const shouldOpenModal =
                    LoadStoreHelper.isOpenChangeStatusLocationModal(
                        currentStatus,
                        status
                    );

                if (shouldOpenModal && isActiveTab) {
                    const modalRef = this.modalService.openModalNew(
                        CaChangeStatusModalComponent,
                        {
                            ...load,
                            truckNumber: driverInfo?.truckNumber,
                            title: 'Change Status',
                            status,
                        }
                    );

                    return modalRef.closed.pipe(
                        exhaustMap((value) => {
                            if (value) {
                                const updateLoadStatusCommand: UpdateLoadStatusCommand =
                                    LoadStoreHelper.composeUpdateLoadStatusCommand(
                                        value,
                                        status,
                                        load.id
                                    );

                                return of(
                                    LoadActions.updateLoadStatusRegular({
                                        status,
                                        updateLoadStatusCommand,
                                    })
                                );
                            } else {
                                return EMPTY;
                            }
                        })
                    );
                } else {
                    return of(
                        LoadActions.updateLoadStatusRegular({
                            status,
                        })
                    );
                }
            })
        )
    );

    public revertLoadStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.revertLoadStatus),
            withLatestFrom(this.store.select(loadIdLoadStatusChangeSelector)),
            exhaustMap(([action, loadId]) => {
                const { status } = action || {};
                const updateLoadStatusCommand: UpdateLoadStatusCommand = {
                    status: status.statusValue.name as LoadStatus,
                    id: loadId,
                };

                return this.loadService
                    .apiRevertLoadStatus(updateLoadStatusCommand)
                    .pipe(
                        exhaustMap((response) => {
                            return this.loadService.apiGetLoadById(loadId).pipe(
                                map((load) => {
                                    return LoadActions.revertLoadStatusSuccess({
                                        status: response,
                                        load,
                                    });
                                }),
                                catchError((error) =>
                                    of(
                                        LoadActions.revertLoadStatusError({
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
    //#endregion
}
