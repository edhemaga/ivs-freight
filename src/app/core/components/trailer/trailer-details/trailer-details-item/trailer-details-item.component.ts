import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnDestroy,
    Input,
    ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TrailerResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { dropActionNameTrailerTruck } from 'src/app/core/utils/function-drop.details-page';
import { CommonTruckTrailerService } from '../../../modals/common-truck-trailer-modals/common-truck-trailer.service';
import { Confirmation } from '../../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';
import { card_component_animation } from '../../../shared/animations/card-component.animations';

@Component({
    selector: 'app-trailer-details-item',
    templateUrl: './trailer-details-item.component.html',
    styleUrls: ['./trailer-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [card_component_animation('showHideCardBody')],
})
export class TrailerDetailsItemComponent implements OnInit, OnDestroy {
    @ViewChildren('fhwaUpload') fhwaUpload: any;
    @ViewChildren('registrationUpload') registrationUpload: any;
    @ViewChildren('titleUpload') titleUpload: any;
    private destroy$ = new Subject<void>();
    @Input() trailer: TrailerResponse | any = null;
    public note: FormControl = new FormControl();
    public registrationNote: FormControl = new FormControl();
    public fhwaNote: FormControl = new FormControl();
    public titleNote: FormControl = new FormControl();
    public trailerData: any;
    public svgColorVar: string;
    public trailerName: string;
    public dataTest: any;
    public dataFHWA: any;
    public toggler: boolean[] = [];
    constructor(
        private tableService: TruckassistTableService,
        private confirmationService: ConfirmationService,
        private notificationService: NotificationService,
        private commonTrailerService: CommonTruckTrailerService,
        private dropDownService: DropDownService
    ) {}

    ngOnInit(): void {
        this.note?.patchValue(this.trailer[0]?.data?.note);
        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: Confirmation) => {
                    switch (res.type) {
                        case 'delete': {
                            if (res.template === 'registration') {
                                this.deleteRegistrationByIdFunction(res.id);
                            } else if (res.template === 'inspection') {
                                this.deleteInspectionByIdFunction(res.id);
                            } else if (res.template === 'title') {
                                this.deleteTitleByIdFunction(res.id);
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
    }
    /**Function for toggle page in cards */
    public toggleResizePage(value: number, indexName: string) {
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
                },
                {
                    title: 'border',
                },
                {
                    title: 'View Details',
                    name: 'view-details',
                    svg: 'assets/svg/common/ic_hazardous-info.svg',
                    show: true,
                },
                {
                    title: 'Renew',
                    name: 'renew',
                    svg: 'assets/svg/common/ic_retry_white.svg',
                    show: true,
                },
                {
                    title: 'Transfer',
                    name: 'transfer',
                    svg: 'assets/svg/common/dropdown-transfer-icon.svg',
                    show: true,
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    show: true,
                },
                {
                    title: 'border',
                },
                {
                    title: 'Void',
                    name: 'activate-item',
                    svg: 'assets/svg/common/ic_cancel_violation.svg',
                    redIcon: true,
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
                },
                {
                    title: 'border',
                },
                {
                    title: 'View Details',
                    name: 'view-details',
                    svg: 'assets/svg/common/ic_hazardous-info.svg',
                    show: true,
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    show: true,
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
                },
            ],
            export: true,
        };
    }
    /**Function retrun id */
    public identity(index: number, item: any): number {
        return item.id;
    }
    public optionsEvent(file: any, data: any, action: string) {
        const name = dropActionNameTrailerTruck(file, action);
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
    private deleteRegistrationByIdFunction(id: number) {
        this.commonTrailerService
            .deleteRegistrationById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                   
                },
                error: () => {
                 
                },
            });
    }

    private deleteInspectionByIdFunction(id: number) {
        this.commonTrailerService
            .deleteInspectionById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                 
                },
                error: () => {
                    
                },
            });
    }
    private deleteTitleByIdFunction(id: number) {
        this.commonTrailerService
            .deleteTitleById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                   
                },
                error: () => {
                  
                },
            });
    }

    public downloadAllFiles(type: string, index: number) {
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

    ngOnDestroy(): void {
        this.tableService.sendActionAnimation({});
        this.destroy$.next();
        this.destroy$.complete();
    }
}
