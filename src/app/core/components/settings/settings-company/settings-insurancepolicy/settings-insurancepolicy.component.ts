import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { SettingsCompanyService } from '../../state/company-state/settings-company.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import {
    Confirmation,
    ConfirmationModalComponent,
} from '../../../modals/confirmation-modal/confirmation-modal.component';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';
import { Subject, takeUntil } from 'rxjs';
import { card_component_animation } from '../../../shared/animations/card-component.animations';
import { FormControl } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { onFileActionMethods } from 'src/app/core/utils/methods.globals';
@Component({
    selector: 'app-settings-insurancepolicy',
    templateUrl: './settings-insurancepolicy.component.html',
    styleUrls: ['./settings-insurancepolicy.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [card_component_animation('showHideCardBody')],
})
export class SettingsInsurancepolicyComponent implements OnChanges, OnDestroy {
    @Input() public insurancePolicyData: any;
    public insuranceNote: FormControl = new FormControl();

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
                next: (res: Confirmation) => {
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
            .subscribe({
                next: () => {
                    
                },
                error: () => {
                  
                },
            });
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
                    iconName: 'edit'
                },
                {
                    title: 'border',
                },
                {
                    title: 'View Details',
                    name: 'view-details',
                    svg: 'assets/svg/common/ic_hazardous-info.svg',
                    show: true,
                    iconName: 'view-details'
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
                    iconName: 'delete'
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
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
