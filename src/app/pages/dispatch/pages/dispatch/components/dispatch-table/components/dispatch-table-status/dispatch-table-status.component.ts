import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, type OnDestroy } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';

//services
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

//components
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

//helpers
import { DispatchTableHelper } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/helpers/dispatch-table.helper';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { DispatchStatusEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums/dispatch-status.enum';

//models
import {
    DispatchResponse,
    DispatchStatus,
    DispatchStatusResponse,
    CreateDispatchCommand,
    UpdateDispatchCommand,
} from 'appcoretruckassist';
import { DispatchTableStringEnum } from '../../enums/dispatch-table-string.enum';

@Component({
    selector: 'app-dispatch-table-status',
    templateUrl: './dispatch-table-status.component.html',
    styleUrls: ['./dispatch-table-status.component.scss'],
})
export class DispatchTableStatusComponent implements OnInit, OnDestroy {
    @Input() set time(value: string) {
        if (value)
            this.showTime = DispatchTableHelper.calculateDateDifference(value);
    }
    @Input() status?: DispatchStatusResponse;

    @Input() dispatchId?: number;
    @Input() dispatcher?: DispatchResponse;
    @Input() dispatchBoardId?: number;

    @Input() isHoveringRow: boolean;

    private destroy$ = new Subject<void>();

    public showTime: string;

    constructor(
        public datePipe: DatePipe,
        public dispatchService: DispatcherService,
        private modalService: ModalService,
        private confirmationActivationService: ConfirmationActivationService
    ) {}

    ngOnInit(): void {
        this.confirmationDataSubscribe();
    }

    public getStatusDropdonw(tooltip: NgbTooltip): void {
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
                }
            );
        } else {
            if (e?.isRevert) {
                this.revertUpdateStatus();
            } else {
                this.updateStatus(e.id, e.status);
            }
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
                    confirmationResponse.data.nameBack
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
                )
            )
            .subscribe();
    }
    public updateStatus(statusId: number, statusName: DispatchStatus): void {
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
            location,
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
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() =>
                    this.dispatchService.updateDispatchboardRowById(
                        this.dispatchId,
                        this.dispatchBoardId
                    )
                )
            )
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
