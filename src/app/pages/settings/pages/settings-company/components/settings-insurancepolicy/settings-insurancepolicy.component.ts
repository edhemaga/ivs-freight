import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { Subject, takeUntil } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';

// animations
import { cardComponentAnimation } from '@shared/animations/card-component.animation';

// services
import { SettingsCompanyService } from '@pages/settings/services/settings-company.service';
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';

// components
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// enums
import { EGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-settings-insurancepolicy',
    templateUrl: './settings-insurancepolicy.component.html',
    styleUrls: ['./settings-insurancepolicy.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [cardComponentAnimation('showHideCardBody')],
})
export class SettingsInsurancepolicyComponent
    implements OnChanges, OnDestroy, OnInit
{
    @ViewChild('insuranceFiles') insuranceFiles: TaUploadFilesComponent;
    @Input() public insurancePolicyData: any;
    public insuranceNote: UntypedFormControl = new UntypedFormControl();

    public copyPolicyName: boolean[] = [];
    public dropOptions: any;
    private destroy$ = new Subject<void>();
    public toggler: boolean[] = [];
    constructor(
        private settingsCompanyService: SettingsCompanyService,
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
                        case EGeneralActions.DELETE: {
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
                    iconName: EGeneralActions.DELETE,
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
                        type: EGeneralActions.DELETE,
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

    public downloadAllFiles(): void {
        this.insuranceFiles.downloadAllFiles();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
