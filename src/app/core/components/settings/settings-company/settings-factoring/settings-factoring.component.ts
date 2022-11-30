import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    OnDestroy,
} from '@angular/core';
import { SettingsCompanyService } from '../../state/company-state/settings-company.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { Subject, takeUntil } from 'rxjs';
import { CompanyStore } from '../../state/company-state/company-settings.store';
import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import {
    Confirmation,
    ConfirmationModalComponent,
} from '../../../modals/confirmation-modal/confirmation-modal.component';
import { OnInit } from '@angular/core';

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
                next: (res: Confirmation) => {
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
            .subscribe({
                next: () => {
                  
                },
                error: () => {
                
                },
            });
    }

    public onDeleteFactoringCompany() {
        this.modalService.openModal(
            ConfirmationModalComponent,
            { size: 'small' },
            {
                id: this.companyStore.getValue().ids[0],
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
