import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
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
import { DriverMvrService } from '@pages/driver/pages/driver-modals/driver-mvr-modal/services/driver-mvr.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DriverCdlService } from '@pages/driver/pages/driver-modals/driver-cdl-modal/services/driver-cdl.service';
import { DetailsDataService } from '@shared/services/details-data.service';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { DriverDetailsHelper } from '@pages/driver/pages/driver-details/components/driver-details-item/utils/helpers/driver-details-item.helper';
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';

// enums
import { DriverDetailsItemStringEnum } from '@pages/driver/pages/driver-details/components/driver-details-item/enums/driver-details-item-string.enum';
import { DropActionsStringEnum } from '@shared/enums/drop-actions-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';

// models
import { CdlResponse, DriverResponse } from 'appcoretruckassist';
import { DetailsDropdownOptions } from '@pages/driver/pages/driver-details/models/details-dropdown-options.model';

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
    @Input() cardsData: CdlResponse[];
    @Input() driver: DriverResponse;

    private destroy$ = new Subject<void>();

    public cdlNote: UntypedFormControl = new UntypedFormControl();

    public cdlData: CdlResponse[] = [];
    public activeCdlArray: CdlResponse[] = [];
    public cdlOptionsDropdownList: DetailsDropdownOptions;

    public currentDate: string;

    public currentCdlIndex: number;

    public toggler: boolean[] = [];

    constructor(
        private modalService: ModalService,
        private mvrService: DriverMvrService,
        private dropDownService: DropDownService,
        private confirmationService: ConfirmationService,
        private cdlService: DriverCdlService,
        private detailsDataService: DetailsDataService
    ) {}

    ngOnInit(): void {
        this.getCurrentDate();

        this.confirmationSubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getCdlData();

        this.getActiveCdls(changes.cardsData.currentValue);

        this.getDetailsOptions(changes.cardsData.currentValue);
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
            .subscribe(({ data, cdlStatus, type, subType }) => {
                console.log('type', type);
                console.log('cdlStatus', cdlStatus);
                console.log('subType', subType);
                console.log('data', data);

                switch (type) {
                    case DriverDetailsItemStringEnum.INFO:
                        const driverId = data?.driver?.id;
                        const newCdlId =
                            data?.newCdlID ?? this.detailsDataService.cdlId;
                        const idCondition =
                            this.detailsDataService.cdlId !== data?.id ||
                            data?.newCdlID;

                        console.log('idCondition', idCondition);
                        console.log('driverId', driverId);
                        console.log('newCdlId', newCdlId);

                        this.deactivateCdlById(data.id, driverId);

                        if (
                            cdlStatus &&
                            (cdlStatus ===
                                DropActionsStringEnum.RENEW_2.toString() ||
                                cdlStatus ===
                                    DropActionsStringEnum.NEW.toString())
                        ) {
                            const newCdlData = newCdlId
                                ? this.cdlData.find(
                                      (cdlItem) => cdlItem.id === newCdlId
                                  )
                                : data;

                            const actionName =
                                cdlStatus ===
                                DropActionsStringEnum.RENEW_2.toString()
                                    ? DropActionsStringEnum.RENEW
                                    : DropActionsStringEnum.ACTIVATE_ITEM;

                            if (newCdlData) {
                                setTimeout(() => {
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
                                }, 500);
                            }
                        }

                        /*  



                        if (cdlStatus) {
                            if (cdlStatus === 'New') {
                                this.deactivateCdl(data.id, driverId);

                                if (idCondition) {
                                    setTimeout(() => {
                                        this.activateCdl(newCdlId);
                                    }, 1000);
                                }
                            } else {
                                this.activateCdl(data.id);
                            }
                        } else if (subType === DropActionsStringEnum.CDL_VOID) {
                            console.log('void cdl');

                            this.deactivateCdl(data.id, driverId);

                            if (idCondition) {
                                setTimeout(() => {
                                    this.activateCdl(newCdlId);
                                }, 1000);
                            }
                        } else {
                            this.activateCdl(data.id);
                        }
 */
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
                        if (
                            cdlStatus &&
                            cdlStatus === DriverDetailsItemStringEnum.ACTIVATE_2
                        ) {
                            this.activateCdlById(data.id);
                        }
                        break;

                    /*
                      case DriverDetailsItemStringEnum.SMALL:
                      if (res.cdlStatus === 'New') {
                      }
                  case 'deactivate': {
                      this.changeDriverStatus(res.id);
                      break;
                  }
                */
                    default:
                        break;
                }
            });
    }

    private getActiveCdls(cdlData: CdlResponse[]): void {
        this.activeCdlArray = cdlData?.filter((cdl) => cdl.status === 1);
    }

    public getNameForDrop(cdlId: number): void {
        this.currentCdlIndex = this.cardsData.findIndex(
            (item: CdlResponse) => item.id === cdlId
        );

        this.getDetailsOptions(this.cdlData);

        this.getCdlData();
    }

    public getCdlData(): void {
        this.cdlData = this.cardsData?.map((cdl: CdlResponse) => {
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

        console.log('cdlData', this.cdlData);
    }

    public getDetailsOptions(data: CdlResponse[]): void {
        const {
            isCdlRenewArray,
            isCdlActivateDeactivateArray,
            isCdlExpiredArray,
        } = this.handleCdlData(data);

        this.cdlOptionsDropdownList =
            DriverDetailsHelper.getCdlOptionsDropdownList(
                isCdlRenewArray,
                isCdlActivateDeactivateArray,
                isCdlExpiredArray,
                this.currentCdlIndex
            );
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
                isCdlActivateDeactivateArray.push(true);
            } else {
                isCdlActivateDeactivateArray.push(false);
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

    public onFileAction(event: File, type: string): void {}

    public onOptions(
        event: { id: number; type: string },
        action: string
    ): void {
        console.log('onOptions event', event);
        console.log('onOptions action', action);

        const name = DropActionNameHelper.dropActionNameDriver(event, action);

        let cdl;
        if (event.type === DriverDetailsItemStringEnum.ACTIVATE_ITEM) {
            const selectedCdl = this.cdlData.find(
                (cdlItem) => cdlItem.id === event.id
            );
            console.log('selectedCdl', selectedCdl);

            if (selectedCdl)
                cdl = {
                    ...selectedCdl,
                };
        } else {
            cdl = {
                ...this.activeCdlArray[0],
            };
        }

        console.log('onOptions cdl', cdl);
        console.log('onOptions cdlData', this.cdlData);
        /* const cdlsData = [];

        if (
            this.activeCdlArray.length &&
            this.activeCdlArray[0].id == event.id &&
            (event.type === 'deactivate-item' || event.type === 'delete-item')
        ) {
            this.mvrService
                .getMvrModal(this.driver.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(({ cdls }) => {
                    cdls?.map((cdl) => {
                        if (cdl.id !== event.id) {
                            cdlsData.push({
                                ...cdl,
                                name: cdl.cdlNumber,
                            });
                        }
                    });
                });
        }

        
 */

        switch (event.type) {
            case DriverDetailsItemStringEnum.EDIT:
            case DriverDetailsItemStringEnum.DELETE_ITEM:
            case DriverDetailsItemStringEnum.DEACTIVATE_ITEM:
            case DriverDetailsItemStringEnum.ACTIVATE_ITEM:
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
                        null /* cdlsData */
                    );
                }, 200);

                break;
            case DriverDetailsItemStringEnum.RENEW:
                this.onOpenRenewLicenceModal(this.activeCdlArray[0]);

                break;
            default:
                break;
        }

        /* null,
            'renew',
            data,
            null,
            null,
            null,
            driverId,
            null,
            null,
            null,
            null,
            null,
            null; */

        /*    dropDownData: any,
        name: string,
        dataCdl?: any,
        dataMvr?: any,
        dataMedical?: any,
        dataTest?: any,
        driverId?: number,
        truckId?: number,
        trailerId?: number,
        data?: any,
        nameTruck?: string,
        hasActiveCdl?: boolean,
        cdlsArray?: any */
    }

    private onOpenActivateLicenceModal(cdl: CdlResponse): void {
        if (this.activeCdlArray?.length) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: DropActionsStringEnum.SMALL },
                {
                    data: {
                        ...this.activeCdlArray[0],
                        state: this.activeCdlArray[0].state?.stateShortName,
                        driver: {
                            id: this.driver.id,
                            file_id: cdl.id,
                            type: DriverDetailsItemStringEnum.ACTIVATE_LICENCE,
                            renewData: cdl,
                        },
                        driverName:
                            this.driver?.firstName +
                            ' ' +
                            this.driver?.lastName,
                    },
                    template: DropActionsStringEnum.CDL,
                    type: DropActionsStringEnum.INFO,
                    subType: DropActionsStringEnum.CDL_VOID,
                    cdlStatus: DropActionsStringEnum.NEW,
                    modalHeader: true,
                    modalHeaderTitle: ConfirmationModalStringEnum.VOID_CDL,
                }
            );
        } else {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: DropActionsStringEnum.SMALL },
                {
                    data: {
                        ...cdl,
                        state: cdl.state?.stateShortName,
                        driver: {
                            id: this.driver.id,
                            file_id: cdl.id,
                            type: DriverDetailsItemStringEnum.ACTIVATE_LICENCE,
                            renewData: cdl,
                        },
                        driverName:
                            this.driver?.firstName +
                            ' ' +
                            this.driver?.lastName,
                    },
                    template: DropActionsStringEnum.CDL,
                    type: DropActionsStringEnum.ACTIVATE,
                    cdlStatus: DropActionsStringEnum.ACTIVATE_2,
                    modalHeader: true,
                }
            );
        }
    }

    private onOpenRenewLicenceModal(cdl: CdlResponse): void {
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

    public openCommand(cdl: CdlResponse, type: string): void {
        console.log('openCommand cdl', cdl);
        console.log('openCommand type', type);

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
        /* let data = this.detailsConfig;

  if (this.activeCdl.length) {
      this.modalService.openModal(
          ConfirmationModalComponent,
          { size: DriverDetailsItemStringEnum.SMALL},
          {
              data: {
                  ...this.activeCdl[0],
                  state: this.activeCdl[0].state.stateShortName,
                  data,
                  driver: {
                      id: this.detailsConfig[0].data.id,
                      file_id: cdl.id,
                      type: DriverDetailsItemStringEnum.RENEW_LICENCE,
                      renewData: cdl,
                  },
              },
              template: DriverDetailsItemStringEnum.CDL,
              type: DriverDetailsItemStringEnum.SMALL,
              subType: DriverDetailsItemStringEnum.CDL_VOID,
              cdlStatus: 'New',
              modalHeader: true,
          }
      );
  } else {
      this.modalService.openModal(
          ConfirmationModalComponent,
          { size: DriverDetailsItemStringEnum.SMALL},
          {
              data: { ...cdl, state: cdl.state.stateShortName, data },
              template: DriverDetailsItemStringEnum.CDL,
              type: 'activate',
              //subType: DriverDetailsItemStringEnum.CDL_VOID,
              cdlStatus: 'Activate',
              modalHeader: true,
          }
      );
  } */
    }

    private deactivateCdlById(id: number, driverId: number): void {
        this.cdlService
            .deactivateCdlById(id, driverId)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private activateCdlById(id: number): void {
        this.cdlService
            .activateCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public deleteCdlById(id: number) {
        this.cdlService
            .deleteCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
