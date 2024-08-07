import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, type OnDestroy } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';

//services
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

//components
import { LoadStatusStringComponent } from '@pages/load/components/load-status-string/load-status-string.component';
import { TaStatusComponentComponent } from '@shared/components/ta-status-component/ta-status-component.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
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
} from 'appcoretruckassist';

@Component({
    selector: 'app-dispatch-table-status',
    templateUrl: './dispatch-table-status.component.html',
    styleUrls: ['./dispatch-table-status.component.scss'],
    standalone: true,
    imports: [
        AngularSvgIconModule,
        CommonModule,
        NgbModule,

        //components
        LoadStatusStringComponent,
        TaStatusComponentComponent,
        TaAppTooltipV2Component,
    ],
})
export class DispatchTableStatusComponent implements OnInit, OnDestroy {
    @Input() set time(value: string) {
        if (value) {
            this.showTime = DispatchTableHelper.calculateDateDifference(value);
        }
    }
    @Input() status?: DispatchStatusResponse;

    @Input() dispatchId?: number;
    @Input() dispatcher?: DispatchResponse;
    @Input() dispatchBoardId?: number;

    public showTime: string;
    private destroy$ = new Subject<void>();

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
            ].includes(e.status)
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
            this.updateStatus(e.id, e.status);
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

    public updateStatus(statusId: number, statusName: DispatchStatus): void {
        this.dispatchService
            .updateDispatchStatus({
                id: statusId,
                status: statusName,
            })
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
