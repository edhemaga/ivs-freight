import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// Store
import { OwnerActiveQuery } from '@pages/owner/state/owner-active-state/owner-active.query';
import { OwnerActiveStore } from '@pages/owner/state/owner-active-state/owner-active.store';
import { OwnerInactiveQuery } from '@pages/owner/state/owner-inactive-state/owner-inactive.query';
import { OwnerInactiveStore } from '@pages/owner/state/owner-inactive-state/owner-inactive.store';

// Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { FormDataService } from '@shared/services/form-data.service';

// Enums
import { TableActionsStringEnum } from '@shared/enums/table-actions-string.enum';
import { eGeneralActions } from '@shared/enums';

// models
import {
    CreateResponse,
    GetOwnerListResponse,
    OwnerModalResponse,
    OwnerResponse,
    OwnerService as OwnerBackendService,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class OwnerService {
    constructor(
        //Services
        private ownerService: OwnerBackendService,
        private tableService: TruckassistTableService,
        private ownerActiveStore: OwnerActiveStore,
        private ownerInactiveStore: OwnerInactiveStore,
        private formDataService: FormDataService,

        //Store
        private ownerActiveQuery: OwnerActiveQuery,
        private ownerInactiveQuery: OwnerInactiveQuery
    ) {}

    // Add Owner
    public addOwner(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.ownerService.apiOwnerPost().pipe(
            tap((res: any) => {
                this.getOwnerById(res.id).subscribe({
                    next: (owner: OwnerResponse | any) => {
                        this.ownerActiveStore.add(owner);

                        const ownerCount = JSON.parse(
                            localStorage.getItem(
                                TableActionsStringEnum.OWNER_TABLE_COUNT
                            )
                        );

                        ownerCount.active++;

                        localStorage.setItem(
                            TableActionsStringEnum.OWNER_TABLE_COUNT,
                            JSON.stringify({
                                active: ownerCount.active,
                                inactive: ownerCount.inactive,
                            })
                        );

                        this.tableService.sendActionAnimation({
                            animation: TableActionsStringEnum.ADD,
                            data: owner,
                            id: owner.id,
                        });
                    },
                });
            })
        );
    }

    // Update Owner
    public updateOwner(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.ownerService.apiOwnerPut().pipe(
            tap(() => {
                this.getOwnerById(data.id).subscribe({
                    next: (owner: OwnerResponse | any) => {
                        if (!owner.truckCount && !owner.trailerCount) {
                            this.ownerInactiveStore.remove(
                                ({ id }) => id === data.id
                            );

                            owner.fileCount = owner.files.length;
                            owner.address = owner.address.address;

                            this.ownerInactiveStore.add(owner);
                        } else {
                            this.ownerActiveStore.remove(
                                ({ id }) => id === data.id
                            );

                            owner.fileCount = owner.files.length;
                            owner.address = owner.address.address;

                            this.ownerActiveStore.add(owner);
                        }

                        this.tableService.sendActionAnimation({
                            animation: TableActionsStringEnum.UPDATE,
                            tab:
                                !owner.truckCount && !owner.trailerCount
                                    ? TableActionsStringEnum.INACTIVE
                                    : TableActionsStringEnum.ACTIVE,
                            data: owner,
                            id: owner.id,
                        });
                    },
                });
            })
        );
    }

    // Get Owner List
    public getOwner(
        active?: number,
        companyOwnerId?: number,
        long?: number,
        lat?: number,
        distance?: number,
        truckTypeIds?: Array<number>,
        trailerTypeIds?: Array<number>,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<GetOwnerListResponse> {
        return this.ownerService.apiOwnerListGet(
            active,
            companyOwnerId,
            long,
            lat,
            distance,
            truckTypeIds,
            trailerTypeIds,
            pageIndex,
            pageSize,
            companyId,
            sort,
            null,
            null,
            search,
            search1,
            search2
        );
    }

    // Get Owner By Id
    public getOwnerById(id: number): Observable<OwnerResponse> {
        return this.ownerService.apiOwnerIdGet(id);
    }

    // Get Owner Dropdowns
    public getOwnerDropdowns(): Observable<OwnerModalResponse> {
        return this.ownerService.apiOwnerModalGet();
    }

    // Delete Owner List
    public deleteOwnerList(
        ids: number[],
        selectedTab: string
    ): Observable<any> {
        return this.ownerService.apiOwnerListDelete(ids).pipe(
            tap(() => {
                let storeOwners =
                    selectedTab === TableActionsStringEnum.ACTIVE
                        ? this.ownerActiveQuery.getAll()
                        : this.ownerInactiveQuery.getAll();

                storeOwners.map((owner: any) => {
                    ids.map((d) => {
                        if (d === owner.id) {
                            selectedTab === TableActionsStringEnum.ACTIVE
                                ? this.ownerActiveStore.remove(
                                      ({ id }) => id === owner.id
                                  )
                                : this.ownerInactiveStore.remove(
                                      ({ id }) => id === owner.id
                                  );
                        }
                    });
                });

                const ownerCount = JSON.parse(
                    localStorage.getItem(
                        TableActionsStringEnum.OWNER_TABLE_COUNT
                    )
                );

                localStorage.setItem(
                    TableActionsStringEnum.OWNER_TABLE_COUNT,
                    JSON.stringify({
                        active:
                            selectedTab === TableActionsStringEnum.ACTIVE
                                ? storeOwners.length - ids.length
                                : ownerCount.active,
                        inactive:
                            selectedTab === TableActionsStringEnum.INACTIVE
                                ? storeOwners.length - ids.length
                                : ownerCount.inactive,
                    })
                );
            })
        );
    }

    // Delete Owner By Id
    public deleteOwnerById(
        ownerId: number,
        tableSelectedTab?: string
    ): Observable<any> {
        return this.ownerService.apiOwnerIdDelete(ownerId).pipe(
            tap(() => {
                const ownerCount = JSON.parse(
                    localStorage.getItem(
                        TableActionsStringEnum.OWNER_TABLE_COUNT
                    )
                );

                if (tableSelectedTab === TableActionsStringEnum.ACTIVE) {
                    this.ownerActiveStore.remove(({ id }) => id === ownerId);

                    ownerCount.active--;
                } else if (
                    tableSelectedTab === TableActionsStringEnum.INACTIVE
                ) {
                    this.ownerInactiveStore.remove(({ id }) => id === ownerId);

                    ownerCount.inactive--;
                }

                localStorage.setItem(
                    TableActionsStringEnum.OWNER_TABLE_COUNT,
                    JSON.stringify({
                        active: ownerCount.active,
                        inactive: ownerCount.inactive,
                    })
                );

                this.tableService.sendActionAnimation({
                    animation: eGeneralActions.DELETE_LOWERCASE,
                    tab: tableSelectedTab,
                    id: ownerId,
                });
            })
        );
    }

    public updateNote(data: {
        selectedTab: string;
        id: number;
        value: string;
    }): void {
        const storeOwners =
            data.selectedTab === TableActionsStringEnum.ACTIVE
                ? this.ownerActiveQuery.getAll()
                : this.ownerInactiveQuery.getAll();

        storeOwners.map((owner) => {
            if (data.id === owner.id) {
                data.selectedTab === TableActionsStringEnum.ACTIVE
                    ? this.ownerActiveStore.update(owner.id, (entity) => ({
                          ...entity,
                          note: data.value,
                      }))
                    : this.ownerInactiveStore.update(owner.id, (entity) => ({
                          ...entity,
                          note: data.value,
                      }));
            }
        });
    }
}
