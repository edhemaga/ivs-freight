import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, Subscription, takeUntil } from 'rxjs';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { SettingsCompanyService } from '@pages/settings/services/settings-company.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { ModalService } from '@shared/services/modal.service';

// store
import { CompanyQuery } from '@pages/settings/state/company-state/company-settings.query';
import { CompanyStore } from '@pages/settings/state/company-state/company-settings.store';

// components
import { SettingsBasicModalComponent } from '@pages/settings/pages/settings-modals/settings-company-modals/settings-basic-modal/settings-basic-modal.component';

// models
import { CompanyResponse, SignInResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-settings-company',
    templateUrl: './settings-company.component.html',
    styleUrls: ['./settings-company.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DetailsPageService],
})
export class SettingsCompanyComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public data: any;
    public dataDivison: any;
    public optionsCmp: any;
    public dataCompany: any;

    constructor(
        private settingsCompanyService: SettingsCompanyService,
        private activated: ActivatedRoute,
        private detailsPageSer: DetailsPageService,
        private cdRef: ChangeDetectorRef,
        private tableService: TruckassistTableService,
        private settingCompanyQuery: CompanyQuery,
        private DetailsDataService: DetailsDataService,
        private CompanyStore: CompanyStore,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.selectCompanyFunction();
        this.getCompanyDivision();

        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res?.animation) {
                    this.dataCompany = res.data.divisions;

                    this.getCompanyDivision();

                    const activeCompanyId = this.optionsCmp.find(
                        (company) => company.active
                    ).id;

                    if (activeCompanyId === res.data.id) {
                        this.data = res.data;
                    } else {
                        this.selectCompany({ id: activeCompanyId });
                    }

                    this.cdRef.detectChanges();
                }
            });

        this.getData(this.activated.snapshot.data.company);

        this.detailsPageSer.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                let currentIndex = this.dataCompany.findIndex(
                    (comp) => comp.id === id
                );

                if (this.dataCompany[currentIndex].isDivision) {
                    this.settingsCompanyService
                        .getCompanyDivisionById(id)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (res: CompanyResponse) => {
                                this.getData(res);

                                this.cdRef.detectChanges();
                            },
                            error: () => {
                                if (this.CompanyStore.getValue()?.entities) {
                                    this.getData(
                                        this.CompanyStore.getValue()?.entities[
                                            id
                                        ]
                                    );
                                } else {
                                    this.getData(
                                        this.activated.snapshot.data.company
                                    );
                                }
                            },
                        });
                } else {
                    if (this.CompanyStore.getValue()?.entities) {
                        this.getData(
                            this.CompanyStore.getValue()?.entities[id]
                        );
                    } else {
                        this.getData(this.activated.snapshot.data.company);
                    }
                }
            });
        this.DetailsDataService.setNewData(this.data);

        this.checkIfUserSettingsAreUpdated();
    }

    private checkIfUserSettingsAreUpdated(): void {
        const loggedUser: SignInResponse = JSON.parse(
            localStorage.getItem('user')
        );

        if (!loggedUser.areSettingsUpdated) {
            this.modalService.openModal(
                SettingsBasicModalComponent,
                {
                    size: 'medium',
                },
                {
                    type: 'edit-company-first-login',
                },
                null,
                false
            );
        }
    }

    public getData(data: any): void {
        this.data = data;
    }

    public selectCompanyFunction(): Subscription {
        return this.settingCompanyQuery
            .selectAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) =>
                item.map((company) => {
                    this.dataCompany = company.divisions;
                })
            );
    }

    public getCompanyDivision(): void {
        const previousActiveCompanyId = this.optionsCmp?.length
            ? this.optionsCmp.find((company) => company.active).id
            : 0;

        this.optionsCmp = this.dataCompany?.map((item) => {
            return {
                ...item,
                id: item.id,
                name: item.companyName,
                active: previousActiveCompanyId
                    ? previousActiveCompanyId === item.id
                        ? true
                        : false
                    : !item.isDivision,
            };
        });
    }

    public selectCompany(event: any): void {
        this.optionsCmp = this.dataCompany.map((item) => {
            return {
                ...item,
                id: item.id,
                name: item.companyName,
                active: item.id === event.id,
            };
        });

        this.detailsPageSer.getDataDetailId(event.id);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
