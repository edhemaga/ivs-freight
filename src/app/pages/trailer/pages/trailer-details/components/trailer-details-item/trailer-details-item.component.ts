import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    ViewChildren,
    type SimpleChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// services
import { DropDownService } from '@shared/services/drop-down.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { TruckTrailerService } from '@shared/components/ta-shared-modals/truck-trailer-modals/services/truck-trailer.service';
import { TrailerService } from '@shared/services/trailer.service';

// components
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';

// animations
import { cardComponentAnimation } from '@shared/animations/card-component.animation';
import { cardAnimation } from '@shared/animations/card.animation';

// decorators
import { Titles } from '@core/decorators/titles.decorator';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// moment
import moment from 'moment';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TruckDetailsEnum } from '@pages/truck/pages/truck-details/enums/truck-details.enum';
import { TrailerDetailsConfig } from '../../models/trailer-details-config.model';
import { RegistrationResponse } from 'appcoretruckassist';
import { eGeneralActions } from '@shared/enums';

@Titles()
@Component({
    selector: 'app-trailer-details-item',
    templateUrl: './trailer-details-item.component.html',
    styleUrls: ['./trailer-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        cardComponentAnimation('showHideCardBody'),
        cardAnimation('cardAnimation'),
    ],
})
export class TrailerDetailsItemComponent
    implements OnInit, OnDestroy, OnChanges
{
    @ViewChildren('fhwaUpload') fhwaUpload: any;
    @ViewChildren('registrationUpload') registrationUpload: any;
    @ViewChildren('titleUpload') titleUpload: any;
    @Input() trailer: any = null;
    private destroy$ = new Subject<void>();
    public note: UntypedFormControl = new UntypedFormControl();
    public registrationNote: UntypedFormControl = new UntypedFormControl();
    public fhwaNote: UntypedFormControl = new UntypedFormControl();
    public titleNote: UntypedFormControl = new UntypedFormControl();
    public svgColorVar: string;
    public trailerName: string;
    public dataRegistration;
    public dataFHWA;
    public toggler: boolean[] = [];
    public currentDate: string;
    public isVoidActive: boolean = false;

    constructor(
        private tableService: TruckassistTableService,
        private confirmationService: ConfirmationService,
        private commonTrailerService: TruckTrailerService,
        private dropDownService: DropDownService,
        private trailerService: TrailerService
    ) {}

    ngOnInit(): void {
        this.note?.patchValue(this.trailer[0]?.data?.note);
        // Confirmation Subscribe

        this.confirmationData();

        this.initTableOptions();

        this.currentDate = moment(new Date()).format();
    }

    public confirmationData(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
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
                            let voidedReg;
                            let unVoidedReg;

                            if (res.array.length) {
                                voidedReg = res?.array[0]?.id;
                                unVoidedReg = res.data.id;
                            } else {
                                voidedReg = res.data.id;
                            }

                            this.trailerService
                                .voidRegistration(voidedReg, unVoidedReg)

                                .pipe(takeUntil(this.destroy$))
                                .subscribe();
                            break;

                        case TruckDetailsEnum.ACTIVATE:
                            this.trailerService
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
    /**Function for toggle page in cards */
    public toggleResizePage(value: number, indexName: string): void {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }

    /**Function for dots in cards */
    public initTableOptions(): void {
        this.dataRegistration = {
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
                    svg: TruckDetailsEnum.EDIT_SVG,
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
    }

    /**Function retrun id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public optionsEvent(file: any, data: any, action: string): void {
        data = this.trailer[0]?.data;
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
            'trailer'
        );
    }

    private deleteRegistrationByIdFunction(id: number): void {
        this.commonTrailerService
            .deleteRegistrationById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deleteInspectionByIdFunction(id: number): void {
        this.commonTrailerService
            .deleteInspectionById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }
    private deleteTitleByIdFunction(id: number): void {
        this.commonTrailerService
            .deleteTitleById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public downloadAllFiles(type: string, index: number): void {
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

    public formatDate(date: string): string {
        return MethodsCalculationsHelper.convertDateFromBackend(date);
    }

    ngOnDestroy(): void {
        this.tableService.sendActionAnimation({});
        this.destroy$.next();
        this.destroy$.complete();
    }
    public checkVoidedAndNotExpired(objects: TrailerDetailsConfig[]): boolean {
        const currentDate = moment().valueOf();
        return objects?.some((object) => {
            const expDate = moment(object.expDate).valueOf();
            const isExpiredOrVoided = expDate < currentDate || object.voidedOn;
            return isExpiredOrVoided;
        });
    }

    private chechVoidStatus(
        id: number,
        data: TrailerDetailsConfig[],
        action: string
    ) {
        const isVoided = data.find((registration) => registration.voidedOn);
        const cdlsArray = data
            .map((registration: RegistrationResponse) => {
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
                  { id: id, type: eGeneralActions.ACTIVATE },
                  data,
                  'registration'
              );
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.trailer.map((object: TrailerDetailsConfig) => {
            if (object.name === TruckDetailsEnum.REGISTRATION) {
                this.isVoidActive = this.checkVoidedAndNotExpired(object.data);
            }
        });
        if (changes.truck?.currentValue != changes.truck?.previousValue) {
            //this.truck = changes.truck?.currentValue;
            //his.initTableOptions();
        }
    }
}
