import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnDestroy,
    ViewChild,
    Input,
    ViewChildren,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// decorators
import { Titles } from '@core/decorators/titles.decorator';

// moment
import moment from 'moment';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TruckDetailsEnum } from '@pages/truck/pages/truck-details/enums/truck-details.enum';

// models
import { TruckDetailsConfig } from '@pages/truck/pages/truck-details/models/truck-details-config.model';
import { TruckDetailsConfigData } from '@pages/truck/pages/truck-details/models/truck-details-config-data.model';

// services
import { DropDownService } from '@shared/services/drop-down.service';
import { NotificationService } from '@shared/services/notification.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { TruckTrailerService } from '@shared/components/ta-shared-modals/truck-trailer-modals/services/truck-trailer.service';
import { TruckService } from '@shared/services/truck.service';

// helpers
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// animations
import { cardComponentAnimation } from '@shared/animations/card-component.animation';
import { cardAnimation } from '@shared/animations/card.animation';

// components
import { TruckDetailsCardComponent } from '@pages/truck/pages/truck-details/components/truck-details-card/truck-details-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';

// pipes
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';
import { SharedModule } from '@shared/shared.module';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
@Titles()
@Component({
    selector: 'app-truck-details-item',
    templateUrl: './truck-details-item.component.html',
    styleUrls: ['./truck-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,

        //components
        TaInputNoteComponent,
        TaCommonCardComponent,
        TaProgressExpirationComponent,
        TaUploadFilesComponent,
        TruckDetailsCardComponent,
        TaCopyComponent,

        // pipes
        ThousandSeparatorPipe,
        FormatDatePipe,
    ],
    animations: [
        cardComponentAnimation('showHideCardBody'),
        cardAnimation('cardAnimation'),
    ],
})
export class TruckDetailsItemComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
    @ViewChildren('fhwaUpload') fhwaUpload: any;
    @ViewChildren('registrationUpload') registrationUpload: any;
    @ViewChildren('titleUpload') titleUpload: any;
    @Input() truck: any = null;
    public note: UntypedFormControl = new UntypedFormControl();
    public fhwaNote: UntypedFormControl = new UntypedFormControl();
    public purchaseNote: UntypedFormControl = new UntypedFormControl();
    public registrationNote: UntypedFormControl = new UntypedFormControl();
    public titleNote: UntypedFormControl = new UntypedFormControl();
    public toggler: boolean[] = [];
    public cardNumberFake = '125335533513';
    private destroy$ = new Subject<void>();
    truckName: string = '';
    isAccountVisible: boolean = true;
    accountText: string = null;
    public isVoidActive: boolean = false;
    public truckData: any;
    public dataEdit: any;
    public dataFHWA: any;
    public currentDate: any;
    constructor(
        private tableService: TruckassistTableService,
        private confirmationService: ConfirmationService,
        private notificationService: NotificationService,
        private commonTruckService: TruckTrailerService,
        private dropDownService: DropDownService,
        private truckService: TruckService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.truck.map((object: TruckDetailsConfig) => {
            if (object.name === TruckDetailsEnum.REGISTRATION) {
                this.isVoidActive = this.checkVoidedAndNotExpired(object.data);
            }
        });
        if (changes.truck?.currentValue != changes.truck?.previousValue) {
            this.initTableOptions();
        }
    }

    ngOnInit(): void {
        // Confirmation Subscribe

        this.confirmationSubscribe();

        this.initTableOptions();

        this.currentDate = moment(new Date()).format();
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    console.log(res);
                    switch (res.type) {
                        case TableStringEnum.DELETE: {
                            if (
                                res.template === TruckDetailsEnum.REGISTRATION_2
                            ) {
                                this.deleteRegistrationByIdFunction(res?.id);
                            } else if (
                                res.template === TruckDetailsEnum.INSPECTION
                            ) {
                                this.deleteInspectionByIdFunction(res?.id);
                            } else if (
                                res.template === TruckDetailsEnum.TITLE
                            ) {
                                this.deleteTitleByIdFunction(res?.id);
                            }
                            break;
                        }
                        case TruckDetailsEnum.VOID_2:
                            console.log('test');
                            this.truckService
                                .voidRegistration(
                                    res?.array[0]?.id
                                        ? res?.array[0]?.id
                                        : res.data.id,
                                    res?.array[0]?.id
                                        ? res.data.id
                                        : res?.array[0]?.id
                                )
                                .pipe(takeUntil(this.destroy$))
                                .subscribe();
                            break;

                        case TruckDetailsEnum.ACTIVATE:
                            console.log('test2222');

                            this.truckService
                                .voidRegistration(null, res.data.id)
                                .pipe(takeUntil(this.destroy$))
                                .subscribe();
                            break;

                        default: {
                            break;
                        }
                    }
                },
            });
    }

    public onShowDetails(componentData: any) {
        componentData.showDetails = !componentData.showDetails;
    }
    public checkVoidedAndNotExpired(
        objects: TruckDetailsConfigData[]
    ): boolean {
        const currentDate = moment().valueOf();
        return objects.some((object) => {
            const expDate = moment(object.expDate).valueOf();
            const isExpiredOrVoided = expDate < currentDate || object.voidedOn;
            return isExpiredOrVoided;
        });
    }
    /**Funct
    /**Function for dots in cards */
    public initTableOptions(): void {
        this.dataEdit = {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: TableStringEnum.EDIT_2,
                    name: TableStringEnum.EDIT,
                    svg: TruckDetailsEnum.EDIT_SVG,
                    iconName: TableStringEnum.EDIT,
                    show: true,
                },
                {
                    title: TruckDetailsEnum.BORDER,
                },
                {
                    title: TableStringEnum.VIEW_DETAILS_2,
                    name: TableStringEnum.VIEW_DETAILS,
                    svg: TruckDetailsEnum.HAZARDOUS_INFO_SVG,
                    iconName: TableStringEnum.VIEW_DETAILS,
                    show: true,
                },
                {
                    title: TruckDetailsEnum.BORDER,
                },
                {
                    title: TruckDetailsEnum.VOID,
                    name: TruckDetailsEnum.VOID_2,
                    svg: TruckDetailsEnum.CANCEL_VIOLATION_SVG,
                    redIcon: true,
                    iconName: TruckDetailsEnum.DEACTIVATE_ITEM,
                },
                {
                    title: TableStringEnum.DELETE_2,
                    name: TableStringEnum.DELETE_ITEM,
                    type: TableStringEnum.DRIVER,
                    text: TruckDetailsEnum.ARE_YOU_WANT_TO_DELETE_DRIVERS,
                    svg: TruckDetailsEnum.TRASH_UPDATE_SVG,
                    iconName: TableStringEnum.DELETE,
                    danger: true,
                    show: true,
                    redIcon: true,
                },
            ],
            export: true,
        };

        this.dataFHWA = {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: TableStringEnum.EDIT_2,
                    name: TableStringEnum.EDIT,
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    iconName: TableStringEnum.EDIT,
                    show: true,
                },
                {
                    title: TruckDetailsEnum.BORDER,
                },
                {
                    title: TableStringEnum.DELETE_2,
                    name: TableStringEnum.DELETE_ITEM,
                    type: TableStringEnum.DRIVER,
                    text: 'Are you sure you want to delete driver(s)?',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    iconName: TableStringEnum.DELETE,
                    danger: true,
                    show: true,
                    redIcon: true,
                },
            ],
            export: true,
        };
    }

    /**Function retrun id */
    public identity(index: number, _: any): number {
        return index;
    }

    /**Function for toggle page in cards */
    public toggleResizePage(value: number, indexName: string) {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }

    public optionsEvent(file: any, data: any, action: string) {
        data = this.truck[0]?.data;

        const name = DropActionNameHelper.dropActionNameTrailerTruck(
            file,
            action
        );
        this.dropDownService.dropActions(
            file,
            name,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            data,
            'truck'
        );
    }
    private deleteRegistrationByIdFunction(id: number) {
        this.commonTruckService
            .deleteRegistrationById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }
    private chechVoidStatus(
        id: number,
        data: TruckDetailsConfigData[],
        action: string
    ) {
        const isVoided = data.find((registration) => registration.voidedOn);
        const cdlsArray = data
            .map((registration) => {
                const currentDate = moment().valueOf();

                const expDate = moment(registration.expDate).valueOf();
                if (isVoided) {
                    if (expDate > currentDate && !registration.voidedOn) {
                        return {
                            id: registration.id,
                            name: registration.licensePlate,
                        };
                    }
                }
            })
            .filter((registration) => registration !== undefined);

        cdlsArray.length
            ? this.optionsEvent({ id: id, type: 'void' }, data, 'registration')
            : this.optionsEvent(
                  { id: id, type: 'activate' },
                  data,
                  'registration'
              );
    }
    private deleteInspectionByIdFunction(id: number) {
        this.commonTruckService
            .deleteInspectionById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }
    private deleteTitleByIdFunction(id: number) {
        this.commonTruckService
            .deleteTitleById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public hiddenPassword(value: any, numberOfCharacterToHide: number) {
        const lastFourCharaters = value.substring(
            value.length - numberOfCharacterToHide
        );
        let hiddenCharacter = '';

        for (let i = 0; i < numberOfCharacterToHide; i++) {
            hiddenCharacter += '*';
        }
        return hiddenCharacter + lastFourCharaters;
    }

    public showHideValue(value: string) {
        this.isAccountVisible = !this.isAccountVisible;
        if (!this.isAccountVisible) {
            this.accountText = this.hiddenPassword(value, 4);
            return;
        }
        this.accountText = value;
    }

    public downloadAllFiles(type: string, index: number) {
        switch (type) {
            case TruckDetailsEnum.FHWA: {
                if (
                    this.fhwaUpload._results[index] &&
                    this.fhwaUpload._results[index].downloadAllFiles
                ) {
                    this.fhwaUpload._results[index].downloadAllFiles();
                }
                break;
            }
            case TruckDetailsEnum.REGISTRATION_2: {
                if (
                    this.registrationUpload._results[index] &&
                    this.registrationUpload._results[index].downloadAllFiles
                ) {
                    this.registrationUpload._results[index].downloadAllFiles();
                }
                break;
            }
            case TruckDetailsEnum.TITLE: {
                if (
                    this.titleUpload._results[index] &&
                    this.titleUpload._results[index].downloadAllFiles
                ) {
                    this.titleUpload._results[index].downloadAllFiles();
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    public formatDate(mod) {
        return MethodsCalculationsHelper.convertDateFromBackend(mod);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
