import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    ViewChildren,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// services
import { DropDownService } from 'src/app/shared/services/drop-down.service';
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { ConfirmationService } from 'src/app/shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { TruckTrailerService } from 'src/app/shared/components/ta-shared-modals/truck-trailer-modals/services/truck-trailer.service';

// components
import { DropActionNameHelper } from 'src/app/shared/utils/helpers/drop-action-name.helper';

// animations
import {
    animate,
    style,
    transition,
    trigger,
    state,
    keyframes,
} from '@angular/animations';
import { cardComponentAnimation } from 'src/app/shared/animations/card-component.animation';

// decorators
import { Titles } from 'src/app/core/decorators/titles.decorator';

// helpers
import { MethodsCalculationsHelper } from 'src/app/shared/utils/helpers/methods-calculations.helper';

// moment
import moment from 'moment';

@Titles()
@Component({
    selector: 'app-trailer-details-item',
    templateUrl: './trailer-details-item.component.html',
    styleUrls: ['./trailer-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        cardComponentAnimation('showHideCardBody'),
        trigger('cardAnimation', [
            state('in', style({ opacity: 1, 'max-height': '0px' })),
            transition(':enter', [
                animate(
                    5100,
                    keyframes([
                        style({ opacity: 0, 'max-height': '0px' }),
                        style({ opacity: 1, 'max-height': '600px' }),
                    ])
                ),
            ]),
            transition(':leave', [
                animate(
                    5100,
                    keyframes([
                        style({ opacity: 1, 'max-height': '600px' }),
                        style({ opacity: 0, 'max-height': '0px' }),
                    ])
                ),
            ]),
        ]),
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
    public dataTest;
    public dataFHWA;
    public toggler: boolean[] = [];
    public currentDate: string;

    constructor(
        private tableService: TruckassistTableService,
        private confirmationService: ConfirmationService,
        private commonTrailerService: TruckTrailerService,
        private dropDownService: DropDownService
    ) {}

    ngOnInit(): void {
        this.note?.patchValue(this.trailer[0]?.data?.note);
        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    switch (res.type) {
                        case 'delete': {
                            if (res.template === 'registration') {
                                this.deleteRegistrationByIdFunction(res?.id);
                            } else if (res.template === 'inspection') {
                                this.deleteInspectionByIdFunction(res?.id);
                            } else if (res.template === 'title') {
                                this.deleteTitleByIdFunction(res?.id);
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
        this.initTableOptions();
        this.currentDate = moment(new Date()).format();
    }

    /**Function for toggle page in cards */
    public toggleResizePage(value: number, indexName: string): void {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }

    /**Function for dots in cards */
    public initTableOptions(): void {
        this.dataTest = {
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
                    title: 'Edit',
                    name: 'edit',
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    show: true,
                    iconName: 'edit',
                },
                {
                    title: 'border',
                },
                {
                    title: 'View Details',
                    name: 'view-details',
                    svg: 'assets/svg/common/ic_hazardous-info.svg',
                    show: true,
                    iconName: 'view-details',
                },
                {
                    title: 'Renew',
                    name: 'renew',
                    svg: 'assets/svg/common/ic_retry_white.svg',
                    show: true,
                    iconName: 'renew',
                },
                {
                    title: 'Transfer',
                    name: 'transfer',
                    svg: 'assets/svg/common/dropdown-transfer-icon.svg',
                    show: true,
                    iconName: 'transfer',
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                    iconName: 'share',
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    show: true,
                    iconName: 'print',
                },
                {
                    title: 'border',
                },
                {
                    title: 'Void',
                    name: 'activate-item',
                    svg: 'assets/svg/common/ic_cancel_violation.svg',
                    redIcon: true,
                    iconName: 'deactivate-item',
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'truck',
                    text: 'Are you sure you want to delete truck(s)?',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    danger: true,
                    show: true,
                    redIcon: true,
                    iconName: 'delete',
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
                    title: 'Edit',
                    name: 'edit',
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    show: true,
                    iconName: 'edit',
                },
                {
                    title: 'border',
                },
                {
                    title: 'View Details',
                    name: 'view-details',
                    svg: 'assets/svg/common/ic_hazardous-info.svg',
                    show: true,
                    iconName: 'view-details',
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                    iconName: 'share',
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    show: true,
                    iconName: 'print',
                },
                {
                    title: 'border',
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    text: 'Are you sure you want to delete driver(s)?',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    danger: true,
                    show: true,
                    redIcon: true,
                    iconName: 'delete',
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
            case 'fhwa': {
                if (
                    this.fhwaUpload._results[index] &&
                    this.fhwaUpload._results[index].downloadAllFiles
                ) {
                    this.fhwaUpload._results[index].downloadAllFiles();
                }
                break;
            }
            case 'registration': {
                if (
                    this.registrationUpload._results[index] &&
                    this.registrationUpload._results[index].downloadAllFiles
                ) {
                    this.registrationUpload._results[index].downloadAllFiles();
                }
                break;
            }
            case 'title': {
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

    ngOnChanges(): void {}
}
