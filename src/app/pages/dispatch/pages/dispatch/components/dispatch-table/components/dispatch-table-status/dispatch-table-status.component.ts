import { DatePipe } from '@angular/common';
import {
    Component,
    Input,
    OnInit,
    Output,
    OnDestroy,
    EventEmitter,
} from '@angular/core';

import { filter, Subject, switchMap, takeUntil, tap } from 'rxjs';

// modules
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// services
import { DispatcherService } from '@pages/dispatch/services';
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

// components
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// helpers
import { LoadStatusHelper } from '@shared/utils/helpers/load-status.helper';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import {
    DispatchTableStringEnum,
    DispatchStatusEnum,
} from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums';

// models
import {
    DispatchResponse,
    DispatchStatus,
    DispatchStatusResponse,
    CreateDispatchCommand,
    UpdateDispatchCommand,
    AddressResponse,
    ParkingSlotShortResponse,
} from 'appcoretruckassist';
import { LastStatusPassed } from '@shared/models/card-models/card-table-data.model';

@Component({
    selector: 'app-dispatch-table-status',
    templateUrl: './dispatch-table-status.component.html',
    styleUrls: ['./dispatch-table-status.component.scss'],
})
export class DispatchTableStatusComponent implements OnInit, OnDestroy {
    @Input() set time(timePassed: LastStatusPassed) {
        if (timePassed)
            this.showTime = LoadStatusHelper.calculateStatusTime(timePassed);
    }

    @Input() set parkingSlot(value: ParkingSlotShortResponse) {
        this._parkingSlot = value;
    }

    @Input() status?: DispatchStatusResponse;

    @Input() dispatchId?: number;
    @Input() dispatcher?: DispatchResponse;
    @Input() dispatchBoardId?: number;

    @Input() isHoveringRow: boolean;

    @Input() isUnlockable: boolean;

    @Output() updateStatusEmitter: EventEmitter<boolean> = new EventEmitter();

    private destroy$ = new Subject<void>();

    public showTime: string;

    // parking
    public _parkingSlot: ParkingSlotShortResponse;

    constructor(
        public datePipe: DatePipe,
        public dispatchService: DispatcherService,
        private modalService: ModalService,
        private confirmationActivationService: ConfirmationActivationService
    ) {}

    ngOnInit(): void {
        this.confirmationDataSubscribe();
    }

    public getStatusDropdown(tooltip: NgbPopover): void {
        if (tooltip.isOpen()) {
            tooltip.close();
        } else {
            tooltip.open();
        }
    }

    public upadateStatus(e: {
        id: number;
        status: DispatchStatus;
        dataFront: DispatchStatus;
        isRevert?: boolean;
    }): void {
        if (
            [
                DispatchStatusEnum[1],
                DispatchStatusEnum[2],
                DispatchStatusEnum[3],
                DispatchStatusEnum[4],
                DispatchStatusEnum[5],
                DispatchStatusEnum[6],
                DispatchStatusEnum[7],
                DispatchStatusEnum[8],
            ].includes(e.status) &&
            !e?.isRevert
        ) {
            const mappedEvent = {
                ...this.dispatcher,
                data: {
                    ...this.dispatcher,
                    nameBack: e.status,
                    nameFront: e.dataFront,
                },
            };
            this.modalService.openModal(
                ConfirmationActivationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    type: TableStringEnum.STATUS,
                    template: TableStringEnum.STATUS_2,
                    subType: TableStringEnum.STATUS_2,
                    modalTitle: this.dispatcher?.activeLoad?.loadNumber,
                    modalSecondTitle: this.dispatcher?.truck?.truckNumber,
                    parking: this._parkingSlot?.parking,
                }
            );
        } else {
            if (e?.isRevert) {
                this.revertUpdateStatus();
            } else {
                this.updateStatus(e.id, e.status);
            }

            this.updateStatusEmitter.emit(true);
        }
    }

    private confirmationDataSubscribe(): void {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(
                takeUntil(this.destroy$),
                filter(
                    (confirmationResponse) =>
                        confirmationResponse.id === this.dispatchId
                )
            )
            .subscribe((confirmationResponse) => {
                this.updateStatus(
                    confirmationResponse.data.id,
                    confirmationResponse.data.nameBack,
                    confirmationResponse.newLocation ?? null
                );
            });
    }
    public revertUpdateStatus(): void {
        this.dispatchService
            .revertDispatchStatus(this.dispatcher.id)
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() =>
                    this.dispatchService.updateDispatchboardRowById(
                        this.dispatchId,
                        this.dispatchBoardId
                    )
                ),
                tap(() => this.updateStatusEmitter.emit(false))
            )
            .subscribe();
    }
    public updateStatus(
        statusId: number,
        statusName: DispatchStatus,
        newLocation?: AddressResponse
    ): void {
        const previousData = this.dispatcher;

        const {
            id,
            status,
            order,
            truck,
            trailer,
            driver,
            coDriver,
            location,
            note,
            parkingSlot,
            latitude,
            longitude,
        } = previousData;

        const updatedPreviousData:
            | CreateDispatchCommand
            | UpdateDispatchCommand = {
            id,
            status: status
                ? (statusName as DispatchStatus)
                : DispatchTableStringEnum.OFF,
            order,
            truckId: truck?.id ?? null,
            trailerId: trailer?.id ?? null,
            driverId: driver?.id ?? null,
            coDriverId: coDriver?.id ?? null,
            location: newLocation?.address ?? location,
            latitude: newLocation?.longLat?.latitude ?? latitude,
            longitude: newLocation?.longLat?.longitude ?? longitude,
            note,
            loadIds: [],
            hoursOfService: null,
            parkingSlotId: parkingSlot?.id ?? null,
        };

        const newData: CreateDispatchCommand | UpdateDispatchCommand = {
            ...updatedPreviousData,
            status: statusName,
            ...this.setCreateUpdateOptionalProperties(
                updatedPreviousData.id,
                'status',
                statusName
            ),
        };

        this.dispatchService
            .updateDispatchBoard(newData, this.dispatcher.id)
            .subscribe();
    }

    private setCreateUpdateOptionalProperties<T>(
        id: number,
        key: string,
        value: T
    ): CreateDispatchCommand | UpdateDispatchCommand {
        return {
            ...(id &&
                key === DispatchTableStringEnum.TRUCK_ID &&
                !value && { location: null }),
            ...(!id && { dispatchBoardId: this.dispatchBoardId }),
            ...(!id &&
                key === DispatchTableStringEnum.LOCATION && {
                    truckId: this.dispatcher.truck.id,
                }),
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
