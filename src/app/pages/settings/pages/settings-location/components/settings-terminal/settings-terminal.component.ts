import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// services
import { SettingsLocationService } from '@pages/settings/pages/settings-location/services/settings-location.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { CompanyTerminalService } from '@pages/settings/services/company-terminal.service';

// pipes
import { FormatCurrency } from '@shared/pipes/format-currency.pipe';

// utils
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';

@Component({
    selector: 'app-settings-terminal',
    templateUrl: './settings-terminal.component.html',
    styleUrls: ['./settings-terminal.component.scss'],
    providers: [FormatCurrency],
})
export class SettingsTerminalComponent implements OnInit, OnDestroy {
    public terminalData: any;
    public terminalActions: any;
    private destroy$ = new Subject<void>();
    public terminalDataById: any;
    constructor(
        private settingsLocationService: SettingsLocationService,
        private terminalService: CompanyTerminalService,
        private tableService: TruckassistTableService,
        private cdRef: ChangeDetectorRef,
        private dropDownService: DropDownService,
        private confirmationService: ConfirmationService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation) {
                    this.getTerminalList();
                    this.cdRef.detectChanges();
                }
            });
        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case 'delete': {
                            if (res.template === 'Company Terminal') {
                                this.deleteTerminalById(res.id);
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
        this.terminalData =
            this.activatedRoute.snapshot.data.terminal.pagination;
        this.initOptions();
    }
    public getTerminalById(id: number) {
        this.settingsLocationService
            .getCompanyTerminalById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.terminalDataById = item));
    }
    public getTerminalList() {
        this.terminalService
            .getTerminalList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.terminalData = item.pagination));
    }

    public optionsEvent(eventData: any, action: string) {
        this.getTerminalById(eventData.id);
        setTimeout(() => {
            const name = DropActionNameHelper.dropActionNameDriver(
                eventData,
                action
            );
            this.dropDownService.dropActionCompanyLocation(
                eventData,
                name,
                this.terminalDataById
            );
        }, 100);
    }
    public deleteTerminalById(id: number) {
        this.settingsLocationService
            .deleteCompanyTerminalById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }
    public onAction(modal: { modalName: string; type: string }) {
        this.settingsLocationService.onModalAction(modal);
    }

    public identityTerminalData(index: number, item: any): number {
        return item.id;
    }

    public identityCardData(index: number, item: any): number {
        return item.id;
    }
    /**Function for dots in cards */
    public initOptions(): void {
        this.terminalActions = {
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
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
