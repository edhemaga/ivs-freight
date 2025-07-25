import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

//States
import { OfficeStore } from '@pages/settings/state/setting-ofice-state/company-office.store';
import { ParkingStore } from '@pages/settings/state/parking-state/company-parking.store';
import { CompanyRepairShopStore } from '@pages/settings/state/setting-reapir-shop-state/company-repairshop.store';
import { TerminalStore } from '@pages/settings/state/settings-terminal-state/company-terminal.store';

//Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

@Component({
    selector: 'app-settings-toolbar',
    templateUrl: './settings-toolbar.component.html',
    styleUrls: ['./settings-toolbar.component.scss'],
})
export class SettingsToolbarComponent implements OnInit, OnDestroy {
    public countLocation: number;
    public settingsToolbar: any;
    private destroy$ = new Subject<void>();
    public companyCount: number;
    constructor(
        private terminalStore: TerminalStore,
        private comRShopStore: CompanyRepairShopStore,
        private parkingStore: ParkingStore,
        private officeStore: OfficeStore,
        private tableService: TruckassistTableService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation) {
                    this.toolBarOptions();
                    this.cdRef.detectChanges();
                }
            });

        this.toolBarOptions();
    }
    public identity(index: number, item: any): number {
        return item.id;
    }
    public toolBarOptions() {
        const companiesCount = JSON.parse(
            localStorage.getItem('companiesCount')
        );
        this.companyCount = companiesCount.numberOfCompany;
        let countLocation;
        countLocation =
            this.terminalStore.getValue().ids.length +
            // this.comRShopStore.getValue().ids.length + IT GIVES ERROR IT NEED FURTHER INVESTIGATION FROM SOMEONE WHO WOKRED ON IT
            this.parkingStore.getValue().ids.length +
            this.officeStore.getValue().ids.length;

        this.settingsToolbar = [
            {
                id: 1,
                name: 'Settings',
                count: null,
                svg: null,
                background: '#FFFFFF',
                route: null,
            },
            {
                id: 2,
                name: 'Company',
                count: this.companyCount,
                svg: 'ic_company.svg',
                background: '#FFFFFF',
                route: '/settings/company',
            },
            {
                id: 3,
                name: 'Location',
                count: countLocation,
                svg: 'assets/svg/common/ic_location.svg',
                background: '#FFFFFF',
                route: '/settings/location',
            },
            {
                id: 4,
                name: 'Document',
                count: 9,
                svg: 'assets/svg/common/ic_document.svg',
                background: '#FFFFFF',
                route: '/settings/document',
            },
            {
                id: 5,
                name: 'Billing',
                count: 10,
                svg: 'assets/svg/common/ic_billing.svg',
                background: '#FFFFFF',
                route: '/settings/billing',
            },
            {
                id: 6,
                name: 'Integration',
                count: 4,
                svg: 'assets/svg/common/ic_integration.svg',
                background: '#FFFFFF',
                route: '/settings/integration',
            },
            {
                id: 7,
                name: null,
                count: null,
                svg: null,
                background: '#FFFFFF',
                route: null,
            },
        ];
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
