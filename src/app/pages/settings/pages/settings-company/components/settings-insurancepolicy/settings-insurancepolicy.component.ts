import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
    OnDestroy,
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';

//Animations
import { card_component_animation } from 'src/app/core/components/shared/animations/card-component.animations';

//Helpers
import { onFileActionMethods } from 'src/app/core/utils/methods.globals';
import { Clipboard } from '@angular/cdk/clipboard';

//Services
import { SettingsCompanyService } from '../../services/settings-company.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { ConfirmationService } from 'src/app/core/components/modals/confirmation-modal/state/state/services/confirmation.service';

//Components
import { TaUploadFilesComponent } from 'src/app/core/components/shared/ta-upload-files/ta-upload-files.component';
import { ConfirmationModalComponent } from 'src/app/core/components/modals/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-settings-insurancepolicy',
    templateUrl: './settings-insurancepolicy.component.html',
    styleUrls: ['./settings-insurancepolicy.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [card_component_animation('showHideCardBody')],
})
export class SettingsInsurancepolicyComponent implements OnChanges, OnDestroy {
    @ViewChild('insuranceFiles') insuranceFiles: TaUploadFilesComponent;
    @Input() public insurancePolicyData: any;
    public insuranceNote: UntypedFormControl = new UntypedFormControl();

    public copyPolicyName: boolean[] = [];
    public dropOptions: any;
    private destroy$ = new Subject<void>();
    public toggler: boolean[] = [];
    constructor(
        private settingsCompanyService: SettingsCompanyService,
        private notificationService: NotificationService,
        private clipboar: Clipboard,
        private confirmationService: ConfirmationService,
        private modalService: ModalService
    ) {}
    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes?.insurancePolicyData?.currentValue !==
            changes?.insurancePolicyData?.previousValue
        ) {
            this.insurancePolicyData =
                changes?.insurancePolicyData?.currentValue;
        }
    }

    ngOnInit(): void {
        this.initDropOptions();
        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case 'delete': {
                            if (res.template === 'insurance') {
                                this.deleteInsurancePolicy(res.id);
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
    }
    /**Function for toggle page in cards */
    public toggleResizePage(value: number) {
        this.toggler[value] = !this.toggler[value];
    }
    public onAction(modal: { modalName: string; type: string; company?: any }) {
        this.settingsCompanyService.onModalAction(modal);
    }

    public deleteInsurancePolicy(insurance: any) {
        this.settingsCompanyService
            .deleteInsurancePolicyById(insurance)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public identity(index: number, item: any): number {
        return item.id;
    }

    /* To copy any Text */
    public copyText(val: any, index: number) {
        this.copyPolicyName[index] = true;
        this.clipboar.copy(val);
    }
    /**Function for dots in cards */
    public initDropOptions(): void {
        this.dropOptions = {
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
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    text: 'Are you sure you want to delete driver(s)?',
                    svg: 'assets/svg/common/ic_trash.svg',
                    danger: true,
                    show: true,
                    redIcon: true,
                    iconName: 'delete',
                },
            ],
            export: true,
        };
    }

    //Function for drop-down
    public optionsEvent(action: any, insurance: any) {
        switch (action.type) {
            case 'edit': {
                this.onAction({
                    modalName: 'insurance-policy',
                    type: 'edit',
                    company: insurance,
                });
                break;
            }
            case 'delete-item': {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        id: insurance.id,
                        template: 'insurance',
                        type: 'delete',
                        image: false,
                    }
                );
                break;
            }
            default: {
                break;
            }
        }
    }

    public onFileAction(action: string) {
        onFileActionMethods(action);
    }

    public downloadAllFiles(): void {
        this.insuranceFiles.downloadAllFiles();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
