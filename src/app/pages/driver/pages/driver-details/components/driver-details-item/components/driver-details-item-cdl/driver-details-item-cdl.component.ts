import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// moment
import moment from 'moment';

// components
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// animations
import { cardComponentAnimation } from '@shared/animations/card-component.animation';
import { cardAnimation } from '@shared/animations/card.animation';

// services
import { ModalService } from '@shared/services/modal.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DriverCdlService } from '@pages/driver/pages/driver-modals/driver-cdl-modal/services/driver-cdl.service';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { DriverDetailsItemHelper } from '@pages/driver/pages/driver-details/components/driver-details-item/utils/helpers/driver-details-item.helper';
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';

// enums
import { DriverDetailsItemStringEnum } from '@pages/driver/pages/driver-details/components/driver-details-item/enums/driver-details-item-string.enum';
import { DropActionsStringEnum } from '@shared/enums/drop-actions-string.enum';

// models
import { CdlResponse, DriverResponse } from 'appcoretruckassist';
import { DetailsDropdownOptions } from '@shared/models/details-dropdown-options.model';

@Component({
    selector: 'app-driver-details-item-cdl',
    templateUrl: './driver-details-item-cdl.component.html',
    styleUrls: ['./driver-details-item-cdl.component.scss'],
    animations: [
        cardComponentAnimation('showHideCardBody'),
        cardAnimation('cardAnimation'),
    ],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,

        // components
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCommonCardComponent,
        TaProgressExpirationComponent,
        TaCustomCardComponent,
    ],
})
export class DriverDetailsItemCdlComponent
    implements OnInit, OnChanges, OnDestroy
{
    @ViewChild('driverCdlFiles') driverCdlFiles: TaUploadFilesComponent;

    @Input() cardsData: CdlResponse[];
    @Input() driver: DriverResponse;

    private destroy$ = new Subject<void>();

    public cdlNote: UntypedFormControl = new UntypedFormControl();

    public cdlData: CdlResponse[] = [];
    public activeCdlArray: CdlResponse[] = [];
    public cdlOptionsDropdownList: DetailsDropdownOptions[] = [];

    public currentDate: string;

    public toggler: boolean[] = [];

    constructor(
        private modalService: ModalService,
        private dropDownService: DropDownService,
        private confirmationService: ConfirmationService,
        private cdlService: DriverCdlService
    ) {}

    ngOnInit(): void {
        this.getCurrentDate();

        this.confirmationSubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.cardsData.currentValue) {
            this.getDetailsOptions(changes.cardsData.currentValue);

            this.getActiveCdls(changes.cardsData.currentValue);

            this.getCdlData(changes.cardsData.currentValue);
        }
    }

    public trackByIdentity(index: number): number {
        return index;
    }

    public formatDate(date: string): string {
        return MethodsCalculationsHelper.convertDateFromBackend(date);
    }

    public getCurrentDate(): void {
        this.currentDate = moment(new Date()).format();
    }

    public toggleResizePage(value: number, indexName: string): void {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ data, type, subType, cdlStatus, template }) => {
                if (template === DriverDetailsItemStringEnum.CDL) {
                    switch (type) {
                        case DriverDetailsItemStringEnum.INFO:
                            const driverId = this.driver?.id;
                            this.deactivateCdlById(data.id);

                            const newCdlData = data?.newCdlID
                                ? this.cdlData.find(
                                      (cdlItem) => cdlItem.id === data?.newCdlID
                                  )
                                : data;

                            const actionName =
                                cdlStatus &&
                                cdlStatus ===
                                    DropActionsStringEnum.ACTIVATE_2.toString()
                                    ? DropActionsStringEnum.ACTIVATE_ITEM
                                    : DropActionsStringEnum.RENEW;

                            if (newCdlData) {
                                setTimeout(() => {
                                    if (
                                        subType !==
                                        DriverDetailsItemStringEnum.VOID_CDL
                                    ) {
                                        this.dropDownService.dropActions(
                                            null,
                                            actionName,
                                            newCdlData,
                                            null,
                                            null,
                                            null,
                                            driverId,
                                            null,
                                            null,
                                            this.driver,
                                            null,
                                            null,
                                            null
                                        );
                                    }

                                    if (
                                        data?.newCdlID &&
                                        actionName !==
                                            DropActionsStringEnum.ACTIVATE_ITEM
                                    )
                                        this.activateCdlById(data?.newCdlID);
                                }, 500);
                            }

                            break;
                        case DriverDetailsItemStringEnum.DELETE:
                            this.deleteCdlById(data.id);

                            if (data?.newCdlID) {
                                setTimeout(() => {
                                    this.activateCdlById(data?.newCdlID);
                                }, 1000);
                            }

                            break;
                        case DriverDetailsItemStringEnum.ACTIVATE:
                            this.activateCdlById(data.id);

                            break;
                        default:
                            break;
                    }
                }
            });
    }

    private getActiveCdls(cdlData: CdlResponse[]): void {
        this.activeCdlArray = cdlData?.filter((cdl) => cdl.status === 1);
    }

    public getCdlData(data: CdlResponse[]): void {
        this.cdlData = [];

        this.cdlData = data?.map((cdl) => {
            const endDate = moment(cdl.expDate);

            const isExpDateCard = moment(cdl.expDate).isBefore(moment());

            const isDeadlineExpDateCard =
                endDate.diff(moment(), DriverDetailsItemStringEnum.DAYS) <= 365;

            return {
                ...cdl,
                showButton:
                    (!isExpDateCard && isDeadlineExpDateCard) ||
                    (isExpDateCard && this.activeCdlArray.length <= 1),
                isExpired: isExpDateCard,
            };
        });
    }

    public getDetailsOptions(data: CdlResponse[]): void {
        const {
            isCdlRenewArray,
            isCdlActivateDeactivateArray,
            isCdlExpiredArray,
        } = this.handleCdlData(data);

        data.forEach((_, index) => {
            this.cdlOptionsDropdownList[index] =
                DriverDetailsItemHelper.getCdlOptionsDropdownList(
                    isCdlRenewArray,
                    isCdlActivateDeactivateArray,
                    isCdlExpiredArray,
                    index
                );
        });
    }

    private handleCdlData(data: CdlResponse[]): {
        isCdlRenewArray: boolean[];
        isCdlActivateDeactivateArray: boolean[];
        isCdlExpiredArray: boolean[];
    } {
        const isCdlRenewArray: boolean[] = [];
        const isCdlActivateDeactivateArray: boolean[] = [];
        const isCdlExpiredArray: boolean[] = [];

        data.forEach((cdl: CdlResponse) => {
            const endDate = moment(cdl.expDate);
            const daysDiff = endDate.diff(
                moment(),
                DriverDetailsItemStringEnum.DAYS
            );

            if (moment(cdl.expDate).isBefore(moment())) {
                isCdlExpiredArray.push(true);
            } else {
                isCdlExpiredArray.push(false);
            }

            if (!cdl.status) {
                isCdlActivateDeactivateArray.push(false);
            } else {
                isCdlActivateDeactivateArray.push(true);
            }

            if (daysDiff < -365) {
                isCdlRenewArray.push(true);
            } else {
                isCdlRenewArray.push(false);
            }
        });

        return {
            isCdlRenewArray,
            isCdlActivateDeactivateArray,
            isCdlExpiredArray,
        };
    }

    public handleActivateRenewClick(cdl: CdlResponse, type: string): void {
        switch (type) {
            case DriverDetailsItemStringEnum.ACTIVATE_LICENCE:
                this.onOpenActivateLicenceModal(cdl);

                break;
            case DriverDetailsItemStringEnum.RENEW_LICENCE:
                this.onOpenRenewLicenceModal(cdl);

                break;
            default:
                break;
        }
    }

    private onOpenRenewLicenceModal(cdl: CdlResponse): void {
        if (this.activeCdlArray?.length) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: DriverDetailsItemStringEnum.SMALL },
                {
                    data: {
                        ...this.activeCdlArray[0],
                        state: this.activeCdlArray[0].state.stateShortName,
                        driver: {
                            id: this.driver.id,
                            file_id: cdl.id,
                            type: DriverDetailsItemStringEnum.RENEW_LICENCE,
                            renewData: cdl,
                        },
                    },
                    template: DriverDetailsItemStringEnum.CDL,
                    type: DriverDetailsItemStringEnum.INFO,
                    subType: DriverDetailsItemStringEnum.CDL_VOID,
                    cdlStatus: DropActionsStringEnum.RENEW_2,
                    modalHeader: true,
                }
            );
        }
    }

    private onOpenActivateLicenceModal(cdl: CdlResponse): void {
        const driverData = {
            driverName:
                this.driver?.firstName +
                DriverDetailsItemStringEnum.EMPTY_STRING +
                this.driver?.lastName,
        };

        if (this.activeCdlArray?.length) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: DriverDetailsItemStringEnum.SMALL },
                {
                    data: {
                        ...this.activeCdlArray[0],
                        state: this.activeCdlArray[0].state.stateShortName,
                        driver: {
                            id: this.driver.id,
                            file_id: cdl.id,
                            type: DriverDetailsItemStringEnum.ACTIVATE_LICENCE,
                            renewData: cdl,
                        },
                        newCdlID: cdl.id,
                    },
                    template: DriverDetailsItemStringEnum.CDL,
                    type: DriverDetailsItemStringEnum.INFO,
                    subType: DriverDetailsItemStringEnum.CDL_VOID,
                    cdlStatus: DropActionsStringEnum.ACTIVATE_2,
                    modalHeader: true,
                    modalHeaderTitle: DriverDetailsItemStringEnum.VOID_CDL_2,
                }
            );
        } else {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: DriverDetailsItemStringEnum.SMALL },
                {
                    data: {
                        ...cdl,
                        state: cdl.state.stateShortName,
                        ...driverData,
                    },
                    template: DriverDetailsItemStringEnum.CDL,
                    type: DriverDetailsItemStringEnum.ACTIVATE,
                    cdlStatus: DriverDetailsItemStringEnum.ACTIVATE_2,
                    modalHeader: true,
                    modalHeaderTitle: DriverDetailsItemStringEnum.ACTIVATE_CDL,
                }
            );
        }
    }

    private onOpenDeactivateLicenceModal(cdl: CdlResponse): void {
        const driverData = {
            driverName:
                this.driver?.firstName +
                DriverDetailsItemStringEnum.EMPTY_STRING +
                this.driver?.lastName,
        };

        const cdls = this.cdlData?.filter((licence) => licence.id !== cdl.id);

        const cdlsDropdownData = cdls.map((cdlItem) => {
            return {
                ...cdlItem,
                name: cdlItem.cdlNumber,
            };
        });

        this.modalService.openModal(
            ConfirmationModalComponent,
            { size: DriverDetailsItemStringEnum.SMALL },
            {
                data: {
                    ...cdl,
                    state: cdl.state.stateShortName,
                    ...driverData,
                },
                template: DriverDetailsItemStringEnum.CDL,
                type: DriverDetailsItemStringEnum.INFO,
                subType: DriverDetailsItemStringEnum.VOID_CDL,
                modalHeader: true,
                modalHeaderTitle: DriverDetailsItemStringEnum.VOID_CDL_2,
                cdlsArray: cdlsDropdownData,
            }
        );
    }

    public onOptions(
        event: { id: number; type: string },
        action: string
    ): void {
        const name = DropActionNameHelper.dropActionNameDriver(event, action);
        const cdl = this.cardsData.find((cdl) => cdl.id === event.id);

        switch (event.type) {
            case DriverDetailsItemStringEnum.EDIT:
            case DriverDetailsItemStringEnum.DELETE_ITEM:
                setTimeout(() => {
                    this.dropDownService.dropActions(
                        event,
                        name,
                        cdl,
                        null,
                        null,
                        null,
                        this.driver.id,
                        null,
                        null,
                        this.driver,
                        null,
                        null,
                        null
                    );
                }, 200);

                break;
            case DriverDetailsItemStringEnum.RENEW:
                this.onOpenRenewLicenceModal(cdl);

                break;
            case DriverDetailsItemStringEnum.ACTIVATE_ITEM:
                this.onOpenActivateLicenceModal(cdl);

                break;
            case DriverDetailsItemStringEnum.DEACTIVATE_ITEM:
                this.onOpenDeactivateLicenceModal(cdl);

                break;
            default:
                break;
        }
    }

    private deactivateCdlById(id: number): void {
        const data = {
            id,
            driverId: this.driver?.id,
            driverStatus: this.driver?.status,
        };

        this.cdlService
            .deactivateCdlById(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private activateCdlById(id: number): void {
        const data = {
            id,
            driverId: this.driver?.id,
            driverStatus: this.driver?.status,
        };

        this.cdlService
            .activateCdlById(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public deleteCdlById(id: number): void {
        const data = {
            id,
            driverId: this.driver?.id,
            driverStatus: this.driver?.status,
        };

        this.cdlService
            .deleteCdlById(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
