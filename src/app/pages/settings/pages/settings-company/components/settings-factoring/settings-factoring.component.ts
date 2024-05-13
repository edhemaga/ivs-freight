import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    OnDestroy,
} from '@angular/core';
import { OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// serivces
import { SettingsCompanyService } from '@pages/settings/services/settings-company.service';
import { NotificationService } from '@shared/services/notification.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ModalService } from '@shared/services/modal.service';

// state
import { CompanyStore } from '@pages/settings/state/company-state/company-settings.store';

// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-settings-factoring',
    templateUrl: './settings-factoring.component.html',
    styleUrls: ['./settings-factoring.component.scss'],
})
export class SettingsFactoringComponent
    implements OnInit, OnChanges, OnDestroy
{
    private destroy$ = new Subject<void>();
    @Input() public factoringData: any;
    public factoringPhone: boolean;
    public factoringEmail: boolean;
    public factoringNote: UntypedFormControl = new UntypedFormControl();
    constructor(
        private settingsCompanyService: SettingsCompanyService,
        private notificationService: NotificationService,
        private companyStore: CompanyStore,
        private confirmationService: ConfirmationService,
        private modalService: ModalService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes?.factoringData?.currentValue !==
            changes?.factoringData?.previousValue
        ) {
            this.factoringData = changes?.factoringData?.currentValue;
        }
    }
    ngOnInit() {
        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case 'delete': {
                            if (res.template === 'factoring') {
                                this.deleteFactoringByCompanyId(res.id);
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
    public onAction(modal: { modalName: string; type: string; company: any }) {
        this.settingsCompanyService.onModalAction(modal);
    }

    public deleteFactoringByCompanyId(id: number) {
        this.settingsCompanyService
            .deleteFactoringCompanyById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public onDeleteFactoringCompany() {
        this.modalService.openModal(
            ConfirmationModalComponent,
            { size: 'small' },
            {
                id: this.factoringData.id,
                template: 'factoring',
                type: 'delete',
                image: false,
            }
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
