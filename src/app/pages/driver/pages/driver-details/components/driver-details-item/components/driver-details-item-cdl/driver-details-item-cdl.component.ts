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

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { DriverDetailsHelper } from '@pages/driver/pages/driver-details/components/driver-details-item/utils/helpers/driver-details-item.helper';
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';

// enums
import { DriverDetailsItemStringEnum } from '@pages/driver/pages/driver-details/components/driver-details-item/enums/driver-details-item-string.enum';

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

    public cdlData: CdlResponse[];
    public activeCdlArray: CdlResponse[];
    public cdlOptionsDropdownList: DetailsDropdownOptions;

    public currentDate: string;

    public currentCdlIndex: number;

    public toggler: boolean[] = [];

    constructor(
        private modalService: ModalService,
        private mvrService: DriverMvrService,
        private dropDownService: DropDownService
    ) {}

    ngOnInit(): void {
        this.getCurrentDate();
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

    private getActiveCdls(cdlData: CdlResponse[]): void {
        this.activeCdlArray = cdlData?.filter((cdl) => cdl.status === 1);
    }

    public getNameForDrop(cdlId: number): void {
        this.currentCdlIndex = this.cardsData.findIndex(
            (item: CdlResponse) => item.id === cdlId
        );

        this.getDetailsOptions(this.cardsData);

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
                    (isExpDateCard && this.cardsData.length === 1),
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
        console.log('event', event);
        console.log('action', action);
        const name = DropActionNameHelper.dropActionNameDriver(event, action);

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

        let dataForCdl;

        if (
            (this.activeCdlArray.length && event.type === 'activate-item') ||
            event.type === 'deactivate-item'
        ) {
            dataForCdl = this.activeCdlArray;
        } else {

        }
 */
        console.log('name', name);
        /* console.log('dataForCdl', dataForCdl);
        console.log('cdlsData', cdlsData);
 */
        setTimeout(() => {
            this.dropDownService.dropActions(
                event,
                name,
                /*  dataForCdl */ null,
                null,
                null,
                null,
                this.driver.id,
                null,
                null,
                null,
                null,
                null,
                null /* cdlsData */
            );
        }, 200);

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

    public openCommand(cdl?: CdlResponse): void {
        /* let data = this.detailsConfig;

  if (this.activeCdl.length) {
      this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
              data: {
                  ...this.activeCdl[0],
                  state: this.activeCdl[0].state.stateShortName,
                  data,
                  driver: {
                      id: this.detailsConfig[0].data.id,
                      file_id: cdl.id,
                      type: 'renew-licence',
                      renewData: cdl,
                  },
              },
              template: DriverDetailsItemStringEnum.CDL,
              type: 'info',
              subType: 'cdl void',
              cdlStatus: 'New',
              modalHeader: true,
          }
      );
  } else {
      this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
              data: { ...cdl, state: cdl.state.stateShortName, data },
              template: DriverDetailsItemStringEnum.CDL,
              type: 'activate',
              //subType: 'cdl void',
              cdlStatus: 'Activate',
              modalHeader: true,
          }
      );
  } */
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
