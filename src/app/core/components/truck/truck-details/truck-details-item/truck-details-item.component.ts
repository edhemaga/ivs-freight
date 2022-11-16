import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnDestroy,
    ViewChild,
    Input,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TruckResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { dropActionNameTrailerTruck } from 'src/app/core/utils/function-drop.details-page';
import { onFileActionMethods } from 'src/app/core/utils/methods.globals';
import { CommonTruckTrailerService } from '../../../modals/common-truck-trailer-modals/common-truck-trailer.service';
import { Confirmation } from '../../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';
import { card_component_animation } from '../../../shared/animations/card-component.animations';

@Component({
    selector: 'app-truck-details-item',
    templateUrl: './truck-details-item.component.html',
    styleUrls: ['./truck-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [card_component_animation('showHideCardBody')],
})
export class TruckDetailsItemComponent implements OnInit, OnDestroy {
    @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
    @Input() truck: TruckResponse | any = null;
    public note: FormControl = new FormControl();
    public fhwaNote: FormControl = new FormControl();
    public purchaseNote: FormControl = new FormControl();
    public registrationNote: FormControl = new FormControl();
    public titleNote: FormControl = new FormControl();
    public toggler: boolean[] = [];
    public cardNumberFake = '125335533513';
    private destroy$ = new Subject<void>();
    truckName: string = '';
    isAccountVisible: boolean = true;
    accountText: string = null;
    public truckData: any;
    public dataEdit: any;
    public dataFHWA: any;
    constructor(
        private tableService: TruckassistTableService,
        private confirmationService: ConfirmationService,
        private notificationService: NotificationService,
        private commonTruckService: CommonTruckTrailerService,
        private dropDownService: DropDownService
    ) {}

    ngOnInit(): void {
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

    public onShowDetails(componentData: any) {
        componentData.showDetails = !componentData.showDetails;
    }

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
        return index;
    }

    /**Function for toggle page in cards */
    public toggleResizePage(value: number, indexName: string) {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
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
            'truck'
        );
    }
    private deleteRegistrationByIdFunction(id: number) {
        this.commonTruckService
            .deleteRegistrationById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Registration successfully deleted',
                        'Success:'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        `Registration with id: ${id} couldn't be deleted`,
                        'Error:'
                    );
                },
            });
    }

    private deleteInspectionByIdFunction(id: number) {
        this.commonTruckService
            .deleteInspectionById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Inspection successfully deleted',
                        'Success:'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        `Inspection with id: ${id} couldn't be deleted`,
                        'Error:'
                    );
                },
            });
    }
    private deleteTitleByIdFunction(id: number) {
        this.commonTruckService
            .deleteTitleById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Title successfully deleted',
                        'Success:'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        `Title with id: ${id} couldn't be deleted`,
                        'Error:'
                    );
                },
            });
    }
    public onFileAction(action: string) {
        onFileActionMethods(action);
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
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
