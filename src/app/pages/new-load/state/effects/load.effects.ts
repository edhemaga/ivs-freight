import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// rxjs
import {
    catchError,
    exhaustMap,
    map,
    switchMap,
    withLatestFrom,
} from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';

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

// Models
import {
    LoadTemplateListResponse,
    LoadListResponse,
    DispatcherFilterResponse,
    LoadStatusFilterResponse,
    UpdateLoadStatusCommand,
    LoadStatus,
} from 'appcoretruckassist';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eLoadRouting } from '@pages/new-load/enums';

// Interfaces
import { IStateFilters } from '@shared/interfaces';

// Selectors
import { loadIdLoadStatusChangeSelector } from '@pages/new-load/state/selectors/load.selectors';
import { selectLoads } from '@pages/new-load/state/selectors/load.selectors';

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
                this.store.select(LoadSelectors.filtersSelector)
            ),
            exhaustMap(([action, mode, filters]) =>
                this.getLoadData(mode, false, filters).pipe(
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

    //#region  Filters
    public getLoadsOnFilterChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                LoadActions.onFiltersChange,
                LoadActions.onSeachFilterChange
            ),
            withLatestFrom(
                this.store.select(LoadSelectors.selectedTabSelector),
                this.store.select(LoadSelectors.filtersSelector)
            ),
            exhaustMap(([action, mode, filters]) =>
                this.getLoadData(mode, true, filters).pipe(
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

    //#endregion

    //#region Delete load
    public onDeleteLoadList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.onDeleteLoadList),
            withLatestFrom(this.store.select(selectLoads)),
            switchMap(([action, loads]) => {
                const { isTemplate, count } = action;
                const selectedIds = loads
                    .filter((load) => load.isSelected)
                    .map((load) => load.id);

                return this.loadService
                    .deleteLoads(selectedIds, isTemplate, count === 1)
                    .pipe(map(() => LoadActions.onDeleteLoadListSuccess()));
            })
        )
    );

    public onDeleteLoadListTemplate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.onDeleteLoadListTemplate),
            switchMap(({ templateId }) => {
                return this.loadService
                    .deleteLoads([templateId], true, true)
                    .pipe(map(() => LoadActions.onDeleteLoadListSuccess()));
            })
        )
    );
    //#endregion

    //#region Get load list
    private getLoadData(
        mode: string,
        isFilterChange: boolean,
        filters: IStateFilters
    ): Observable<{
        loadResponse: LoadTemplateListResponse | LoadListResponse;
        dispatcherFilters: DispatcherFilterResponse[];
        statusFilters: LoadStatusFilterResponse[];
    }> {
        const tabValue = eLoadStatusType[mode];
        const isTemplate = tabValue === eLoadStatusType.Template;

        const loadRequest$ = isTemplate
            ? this.loadService.getLoadTemplateList(filters)
            : this.loadService.getLoadList(tabValue, filters);

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

    public updateLoadStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.updateLoadStatus),
            withLatestFrom(this.store.select(loadIdLoadStatusChangeSelector)),
            exhaustMap(([action, loadId]) => {
                const { status } = action || {};
                const updateLoadStatusComand: UpdateLoadStatusCommand = {
                    status: status.statusValue.name as LoadStatus,
                    id: loadId,
                };

                return this.loadService
                    .apiUpdateLoadStatus(updateLoadStatusComand)
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

    public revertLoadStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.revertLoadStatus),
            withLatestFrom(this.store.select(loadIdLoadStatusChangeSelector)),
            exhaustMap(([action, loadId]) => {
                const { status } = action || {};
                const updateLoadStatusComand: UpdateLoadStatusCommand = {
                    status: status.statusValue.name as LoadStatus,
                    id: loadId,
                };

                return this.loadService
                    .apiRevertLoadStatus(updateLoadStatusComand)
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
